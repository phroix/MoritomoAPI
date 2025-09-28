// import { Request, Response } from "express";
// import { supabaseAdmin } from "../config/db.config";

// const getKebapsList = async (req: Request, res: Response) => {
//   try {
//     const { from, to } = req.query;

//     let { data: kebaps, error: kebapsError } = await supabaseAdmin
//       .from("kebaps")
//       .select("id, name, user_id")
//       .order("id", { ascending: true })
//       .range(Number(from), Number(to));

//     if (kebapsError) throw kebapsError;
//     if (!kebaps || kebaps.length === 0) {
//       return res.status(404).json({ message: "Keine Kebaps gefunden" });
//     }

//     res.json(kebaps);
//   } catch (err) {
//     console.error("Error in getKebaps:", err);
//     res.status(500).send("Error fetching kebaps data");
//   }
// };

// const getKebapById = async (req: Request, res: Response) => {
//   try {
//     const id = req.params.id;
//     // const userId = req.query.userId as string;

//     // let isFavorite = false;

//     // 2️⃣ Get valid subscriptions
//     const { data: validSubscriptions, error: subscriptionsError } =
//       await supabaseAdmin
//         .from("subscriptions")
//         .select("kebap_id")
//         .gt("endDate", new Date().toISOString())
//         .eq("kebap_id", id);
//     console.log("validSubscriptions", validSubscriptions);

//     if (subscriptionsError) throw subscriptionsError;

//     // const userId = req.params.userId;
//     const { data: kebap, error } = await supabaseAdmin
//       .from("kebaps")
//       .select("*")
//       .eq("id", id)
//       .single();

//     // Get all reviews for this kebap to calculate new average rating
//     const { data: allKebapReviews, error: kebapReviewsError } =
//       await supabaseAdmin.from("reviews").select("rating").eq("kebap_id", id);

//     if (kebapReviewsError) {
//       throw kebapReviewsError;
//     }

//     // Calculate average rating
//     const totalRating = allKebapReviews.reduce(
//       (sum, review) => sum + review.rating,
//       0
//     );
//     const averageRating = Number(
//       (totalRating / allKebapReviews.length).toFixed(1)
//     );

//     if (error) {
//       return res.status(404).json({ error: "Kebap not found" });
//     }

//     // Get images for the kebap
//     const { data: files, error: listError } = await supabaseAdmin.storage
//       .from("KebapImages")
//       .list(`${kebap.user_id}`, {
//         limit: 6,
//         sortBy: { column: "name", order: "asc" },
//       });

//     // console.log("files", files);
//     // Filter out the .emptyFolderPlaceholder file
//     const imageFiles =
//       files?.filter((file) => file.name !== ".emptyFolderPlaceholder") || [];

//     if (listError || imageFiles.length === 0) {
//       console.error("Error listing files:", listError);
//       return res.json({
//         ...kebap,
//         images: [],
//         averageRating: averageRating,
//         verifyBadge: validSubscriptions.length > 0 ? true : false,
//       });
//     }

//     // Generate signed URLs for each file
//     const imageUrls = await Promise.all(
//       imageFiles.map(async (file) => {
//         const { data: publicUrl } = await supabaseAdmin.storage
//           .from("KebapImages")
//           .getPublicUrl(`${kebap.user_id}/${file.name}`);
//         return {
//           name: file.name,
//           url: publicUrl?.publicUrl,
//         };
//       })
//     );

//     return res.json({
//       ...kebap,
//       averageRating: averageRating,
//       images: imageUrls.filter((img) => img.url),
//       verifyBadge: validSubscriptions.length > 0 ? true : false,
//     });
//   } catch (error) {
//     console.error("Error in getKebapById:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

// const getUser = async (req: Request, res: Response) => {
//   try {
//     const userId = req.params.userId;

//     const { data: user, error: userError } =
//       await supabaseAdmin.auth.admin.getUserById(userId);

//     if (!user || userError) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Check if user image exists before creating public URL
//     const { data: files, error: listError } = await supabaseAdmin.storage
//       .from("userimages")
//       .list("images", {
//         limit: 1,
//         search: userId,
//       });

//     let publicUrl = null;
//     if (!listError && files && files.length > 0) {
//       const userFile = files.find((file) => file.name === userId);
//       if (userFile) {
//         const { data: urlData } = supabaseAdmin.storage
//           .from("userimages")
//           .getPublicUrl(`images/${userId}`);
//         publicUrl = urlData.publicUrl;
//       }
//     }

//     let { data: levels, error } = await supabaseAdmin
//       .from("levels")
//       .select("exp")
//       .eq("user_id", userId);

//     if (error) throw error;

//     const exp = levels?.[0]?.exp || 0;
//     let level = "Flatbread";

//     if (exp >= 2000) {
//       level = "Kebab Gourmet";
//     } else if (exp >= 1500) {
//       level = "Kebab Connaisseur";
//     } else if (exp >= 1000) {
//       level = "Professional";
//     } else if (exp >= 500) {
//       level = "Advocate";
//     }

//     return res.status(200).json({
//       user: user.user,
//       ...(publicUrl && { publicUrl }),
//       ...(levels && levels.length > 0 && { exp, level }),
//     });
//   } catch (error) {
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

// const getAllUsers = async (req: Request, res: Response) => {
//   try {
//     const { page = 1, perPage = 18 } = req.query;

//     const {
//       data: { users },
//       error,
//     } = await supabaseAdmin.auth.admin.listUsers({
//       page: Number(page),
//       perPage: Number(perPage),
//     });

//     if (error) {
//       console.error("Supabase Admin Error:", error);
//       return res.status(500).json({ error: "Supabase Admin error" });
//     }

//     // Filter und nur relevante Felder extrahieren
//     const filteredUsers = users
//       .filter((user) => user.user_metadata?.role !== "admin")
//       .map((user) => ({
//         id: user.id,
//         email: user.email,
//         full_name: user.user_metadata?.full_name || null,
//       }));

//     return res.status(200).json({ users: filteredUsers });
//   } catch (error) {
//     console.error("Internal server error:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

// const deleteUser = async (req: Request, res: Response) => {
//   const { userId } = req.params;
//   try {
//     const { data, error } = await supabaseAdmin.auth.admin.deleteUser(userId);
//     if (error) {
//       return res.status(400).json({ error: error.message });
//     }
//     return res.status(200).json({ message: "User deleted successfully", data });
//   } catch (error) {
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

// const updateUser = async (req: Request, res: Response) => {
//   const { userId } = req.params;
//   const { email, password, fullName } = req.body;
//   try {
//     const { data: responseData, error } =
//       await supabaseAdmin.auth.admin.updateUserById(userId, {
//         email: email && email,
//         password: password && password,
//         user_metadata: {
//           full_name: fullName && fullName,
//         },
//       });
//     if (error) {
//       return res.status(400).json({ error: error.message });
//     }
//     return res
//       .status(200)
//       .json({ message: "User updated successfully", data: responseData });
//   } catch (error) {
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

// const deleteKebap = async (req: Request, res: Response) => {
//   try {
//     const id = req.params.id;
//     const { data, error } = await supabaseAdmin
//       .from("kebaps")
//       .delete()
//       .eq("id", id);

//     if (error === null) {
//       return res.status(404).json({ message: "User not authorized" });
//     }
//     if (error) {
//       console.error("Error deleting kebap:", error);
//       return res.status(400).json({ error: error.message });
//     }
//     return res.status(200).json({
//       message: "Kebap deleted successfully",
//       data: data,
//     });
//   } catch (error) {
//     console.error("Error in deleteKebap:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

// const setKebapAsMember = async (req: Request, res: Response) => {
//   try {
//     const { kebapId, userId } = req.body;

//     // Vor dem Update prüfen, ob der User schon einem Kebap zugeordnet ist
//     const { data: existingKebap, error: existingKebapError } =
//       await supabaseAdmin
//         .from("kebaps")
//         .select("id")
//         .eq("user_id", userId)
//         .single();

//     if (existingKebap) {
//       return res.status(400).json({
//         error: "Dieser User ist bereits einem Kebap zugeordnet.",
//       });
//     }
//     if (existingKebapError && existingKebapError.code !== "PGRST116") {
//       // PGRST116 = Row not found, also kein Problem
//       return res.status(500).json({
//         error: "Fehler bei der Überprüfung des Users.",
//       });
//     }

//     const { data, error } = await supabaseAdmin
//       .from("kebaps")
//       .update({
//         user_id: userId,
//       })
//       .eq("id", kebapId)
//       .select();

//     const oneYearFromNow = new Date();
//     oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
//     const endDate = oneYearFromNow.toISOString();

//     const { data: subscriptionData, error: subscriptionError } =
//       await supabaseAdmin
//         .from("subscriptions")
//         .insert([
//           {
//             kebap_id: kebapId,
//             startDate: new Date().toISOString(),
//             endDate: endDate,
//           },
//         ])
//         .select();

//     if (error || subscriptionError) {
//       console.error("Error creating kebap:", error);
//       return res.status(400).json({
//         error: error?.message || subscriptionError?.message,
//       });
//     }

//     return res.status(201).json({
//       message: "Kebap set as member successfully",
//       data: data,
//       subscriptionData: subscriptionData,
//     });
//   } catch (error) {
//     console.error("Error in createKebap:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

// const removeUserFromKebap = async (req: Request, res: Response) => {
//   try {
//     const { kebapId } = req.body;

//     // 1. user_id vom Kebap auf null setzen
//     const { data: kebapData, error: kebapError } = await supabaseAdmin
//       .from("kebaps")
//       .update({ user_id: null })
//       .eq("id", kebapId)
//       .select();

//     if (kebapError) {
//       console.error("Kebap update error:", kebapError);
//       return res.status(400).json({ error: kebapError.message });
//     }

//     // 2. Neueste Subscription holen
//     const { data: latestSubscription, error: selectError } = await supabaseAdmin
//       .from("subscriptions")
//       .select("id")
//       .eq("kebap_id", kebapId)
//       .order("endDate", { ascending: false })
//       .limit(1);

//     if (selectError || !latestSubscription) {
//       console.error("Subscription select error:", selectError);
//       return res
//         .status(400)
//         .json({ error: selectError?.message || "No subscription found" });
//     }

//     // 3. Enddatum auf gestern setzen
//     const yesterday = new Date();
//     yesterday.setDate(yesterday.getDate() - 1);

//     const { data: updatedSubscription, error: updateError } =
//       await supabaseAdmin
//         .from("subscriptions")
//         .update({ endDate: yesterday.toISOString() })
//         .eq("id", latestSubscription[0].id)
//         .select();

//     if (updateError) {
//       console.error("Subscription update error:", updateError);
//       return res.status(400).json({ error: updateError.message });
//     }

//     return res.status(200).json({
//       message: "User removed and latest subscription ended",
//       data: kebapData,
//       subscriptionData: updatedSubscription,
//     });
//   } catch (error) {
//     console.error("Unexpected error:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

// const extendSubscription = async (req: Request, res: Response) => {
//   try {
//     const { kebapId } = req.body;

//     const oneYearFromNow = new Date();
//     oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
//     const newEndDate = oneYearFromNow.toISOString();

//     const { data: subscriptionData, error: subscriptionError } =
//       await supabaseAdmin
//         .from("subscriptions")
//         .insert([
//           {
//             kebap_id: kebapId,
//             startDate: new Date().toISOString(),
//             endDate: newEndDate,
//           },
//         ])
//         .select();

//     if (subscriptionError) {
//       console.error("Error creating kebap:", subscriptionError);
//       return res.status(400).json({
//         error: subscriptionError?.message,
//       });
//     }

//     return res.status(201).json({
//       message: "Subscription extended successfully",
//       subscriptionData: subscriptionData,
//     });
//   } catch (error) {
//     console.error("Error in extendSubscription:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

// const getLatestSubscription = async (req: Request, res: Response) => {
//   try {
//     const kebapId = req.query.kebapId;
//     console.log("kebapId", kebapId);
//     const { data, error } = await supabaseAdmin
//       .from("subscriptions")
//       .select("*")
//       .eq("kebap_id", kebapId)
//       .gt("endDate", new Date().toISOString())
//       .order("endDate", { ascending: false })
//       .limit(1);

//     if (error) {
//       console.error("Error getting latest subscription:", error);
//       return res.status(400).json({ error: error.message });
//     }

//     return res.status(200).json(data[0]);
//   } catch (error) {
//     console.error("Error in getLatestSubscription:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

// const createKebap = async (req: Request, res: Response) => {
//   try {
//     const { kebapData } = req.body;

//     const { data, error } = await supabaseAdmin
//       .from("kebaps")
//       .insert([kebapData])
//       .select();

//     if (error) {
//       console.error("Error creating kebap:", error);
//       return res.status(400).json({ error: error.message });
//     }

//     return res.status(201).json({
//       message: "Kebap created successfully",
//       data: data,
//       // uploadData: uploadData,
//     });
//   } catch (error) {
//     console.error("Error in createKebap:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

// const deleteMessage = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const { data, error } = await supabaseAdmin
//       .from("messages")
//       .delete()
//       .eq("id", id);

//     if (error) {
//       return res.status(400).json({ error: error.message });
//     }
//     return res
//       .status(200)
//       .json({ message: "Message deleted successfully", data });
//   } catch (error) {
//     console.error("Error in deleteMessage:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

// const getMessagesBasedOnType = async (req: Request, res: Response) => {
//   try {
//     const { type, from, to } = req.query;

//     const { data, error } = await supabaseAdmin
//       .from("messages")
//       .select("*")
//       .eq("message_type", type)
//       .range(Number(from), Number(to));

//     if (error) {
//       return res.status(400).json({ error: error.message });
//     }
//     return res.status(200).json(data);
//   } catch (error) {
//     console.error("Error in deleteMessage:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

// export const adminController = {
//   getUser,
//   updateUser,
//   deleteUser,
//   getAllUsers,
//   getKebapsList,
//   getKebapById,
//   deleteKebap,
//   createKebap,
//   setKebapAsMember,
//   removeUserFromKebap,
//   extendSubscription,
//   getLatestSubscription,
//   deleteMessage,
//   getMessagesBasedOnType,
// };
