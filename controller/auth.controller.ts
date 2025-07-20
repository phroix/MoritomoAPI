import { Request, Response } from "express";
import { supabase } from "../config/db.config";

const refreshSession = async (req: Request, res: Response) => {
  try {
    // if (!secret) {
    //   res.status(500).json({ error: "JWT secret is not configured" });
    //   return;
    // }
    // const authHeader = req.headers.authorization;
    // if (!authHeader) {
    //   res.status(401).json({ error: "Kein Token übermittelt" });
    //   return;
    // }
    // const token = authHeader.split(" ")[1];
    // jwt.verify(token, secret, (err, decoded) => {
    //   if (err) {
    //     res.status(401).json({ error: "Ungültiges oder abgelaufenes Token" });
    //     return;
    //   }
    // });
    // const refresh_token = req.headers.authorization || "";
    // const refreshToken = req.headers["x-refresh-token"] as string;

    // console.log("refresh_token", refreshToken);
    // const { refresh_token } = req.body;

    const { data, error } = await supabase.auth
      .refreshSession
      //   {
      //   refresh_token: refreshToken,ic
      // }
      ();

    if (error) {
      // Handle the error (e.g., invalid refresh token)

      return res.status(401).json({ error: error.message });
    }
    const { session, user } = data;
    res.status(200).json({ session, user });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, fullName } = req.body;
    let { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: fullName,
          // email: email,
          role: "user",
        },
      },
    });
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    let { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      return res.status(400).json({ error: error?.message });
    }

    let kebapData = null;
    // Erst das Kebap laden
    const { data: kebap, error: kebapError } = await supabase
      .from("kebaps")
      .select("*")
      .eq("user_id", data.user?.id)
      .single();

    // Prüfen, ob ein gültiges Abo existiert
    let hasValidSubscription = false;
    if (!kebapError && kebap) {
      const { data: subscription, error: subscriptionError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("kebap_id", kebap.id)
        .gt("endDate", new Date().toISOString())
        .single();
      hasValidSubscription = !!subscription && !subscriptionError;
    }

    if (!kebapError && kebap && hasValidSubscription) {
      // Nur wenn gültiges Abo, lade Bilder und Reviews
      const { data: files, error: listError } = await supabase.storage
        .from("KebapImages")
        .list(`${kebap.user_id}`, {
          limit: 6,
          sortBy: { column: "name", order: "asc" },
        });

      const imageFiles =
        files?.filter((file) => file.name !== ".emptyFolderPlaceholder") || [];

      let images: any[] = [];
      if (!listError && imageFiles.length > 0) {
        const imageUrls = await Promise.all(
          imageFiles.map(async (file) => {
            const { data: publicUrl } = await supabase.storage
              .from("KebapImages")
              .getPublicUrl(`${kebap.user_id}/${file.name}`);
            return {
              name: file.name,
              url: publicUrl?.publicUrl,
            };
          })
        );
        images = imageUrls.filter((img) => img.url);
      }

      const { data: reviews, error: reviewsError } = await supabase
        .from("reviews")
        .select("id")
        .eq("kebap_id", kebap.id);

      const numberOfReviews = reviews?.length || 0;

      kebapData = {
        ...kebap,
        images,
        numberOfReviews,
      };
    }

    const kebapResult = {
      isKebap: kebapData ? true : false,
      ...(kebapData && { kebapData: kebapData }),
    };

    return res.status(200).json({
      session: {
        access_token: data.session?.access_token,
        token_type: data.session?.token_type,
        expires_in: data.session?.expires_in,
        expires_at: data.session?.expires_at,
        refresh_token: data.session?.refresh_token,
      },
      kebap: kebapResult,
      ...(data.user?.user_metadata.role && {
        role: data.user?.user_metadata.role,
      }),
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const signout = async (req: Request, res: Response) => {
  try {
    let { error } = await supabase.auth.signOut();
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  // console.log(email);
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        // set this to false if you do not want the user to be automatically signed up
        shouldCreateUser: false,
      },
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  // console.log(email);
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.verifyOtp({
      email: email,
      token: otp,
      type: "email",
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    let kebapData = null;
    // Erst das Kebap laden
    const { data: kebap, error: kebapError } = await supabase
      .from("kebaps")
      .select("*")
      .eq("user_id", session?.user?.id)
      .single();

    // Prüfen, ob ein gültiges Abo existiert
    let hasValidSubscription = false;
    if (!kebapError && kebap) {
      const { data: subscription, error: subscriptionError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("kebap_id", kebap.id)
        .gt("endDate", new Date().toISOString())
        .single();
      hasValidSubscription = !!subscription && !subscriptionError;
    }

    if (!kebapError && kebap && hasValidSubscription) {
      // Nur wenn gültiges Abo, lade Bilder und Reviews
      const { data: files, error: listError } = await supabase.storage
        .from("KebapImages")
        .list(`${kebap.user_id}`, {
          limit: 6,
          sortBy: { column: "name", order: "asc" },
        });

      const imageFiles =
        files?.filter((file) => file.name !== ".emptyFolderPlaceholder") || [];

      let images: any[] = [];
      if (!listError && imageFiles.length > 0) {
        const imageUrls = await Promise.all(
          imageFiles.map(async (file) => {
            const { data: publicUrl } = await supabase.storage
              .from("KebapImages")
              .getPublicUrl(`${kebap.user_id}/${file.name}`);
            return {
              name: file.name,
              url: publicUrl?.publicUrl,
            };
          })
        );
        images = imageUrls.filter((img) => img.url);
      }

      const { data: reviews, error: reviewsError } = await supabase
        .from("reviews")
        .select("id")
        .eq("kebap_id", kebap.id);

      const numberOfReviews = reviews?.length || 0;

      kebapData = {
        ...kebap,
        images,
        numberOfReviews,
      };
    }

    const kebapResult = {
      isKebap: kebapData ? true : false,
      ...(kebapData && { kebapData: kebapData }),
    };

    return res.status(200).json({
      session: {
        access_token: session?.access_token,
        token_type: session?.token_type,
        expires_in: session?.expires_in,
        expires_at: session?.expires_at,
        refresh_token: session?.refresh_token,
      },
      kebap: kebapResult,
      ...(session?.user?.user_metadata.role && {
        role: session?.user?.user_metadata.role,
      }),
    });

    // if (error) {
    //   return res.status(400).json({ error: error.message });
    // }

    // return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const checkUserForKebap = async (req: Request, res: Response) => {
  const { user_id } = req.body;
  // console.log("checkUserForKebap", user_id);
  // console.log("user_id", user_id);
  try {
    let { data: kebap, error: kebapsError } = await supabase
      .from("kebaps")
      .select("id")
      // .order("id", { ascending: true })
      .eq("user_id", user_id);
    // console.log("kebap", kebap);

    if (!kebap || kebap.length === 0) {
      return res.status(404).json({ message: "Not authorized" });
    }

    if (kebapsError) {
      return res.status(400).json({ error: kebapsError });
    }

    if (kebap) {
      return res.status(200).json({ isKebap: true });
    } else {
      return res.status(404).json({ message: "No kebaps found for this user" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const authController = {
  signup,
  signin,
  signout,
  forgotPassword,
  checkUserForKebap,
  refreshSession,
  verifyOtp,
};
