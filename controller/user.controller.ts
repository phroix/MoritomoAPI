// import { Request, Response } from "express";
// import { supabase } from "../config/db.config";
// import multer from "multer";

// const getUser = async (req: Request, res: Response) => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//       return res.status(401).json({ error: "Unauthorized" });
//     }
//     const jwt = authHeader.split(" ")[1];

//     const {
//       data: { user },
//     } = await supabase.auth.getUser(jwt);

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Check if user image exists before creating public URL
//     const { data: files, error: listError } = await supabase.storage
//       .from("userimages")
//       .list("images", {
//         limit: 1,
//         search: user.id
//       });

//     let publicUrl = null;
//     if (!listError && files && files.length > 0) {
//       const userFile = files.find(file => file.name === user.id);
//       if (userFile) {
//         const { data: urlData } = supabase.storage
//           .from("userimages")
//           .getPublicUrl(`images/${user.id}`);
//         publicUrl = urlData.publicUrl;
//       }
//     }

//     let { data: levels, error } = await supabase
//       .from("levels")
//       .select("exp")
//       .eq("user_id", user.id);

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
//       user,
//       ...(publicUrl && { publicUrl }),
//       ...(levels && levels.length > 0 && { exp, level }),
//     });
//   } catch (error) {
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

// const updateUser = async (req: Request, res: Response) => {
//   const { email, password, data } = req.body;
//   console.log(email, password, data);
//   try {
//     const { data: responseData, error } = await supabase.auth.updateUser({
//       email: email && email,
//       password: password && password,
//       data: data && data,
//     });
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

// // Multer Konfiguration (Speicherung im Speicher)
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// export const uploadMiddleware = upload.single("image");
// const uploadUserProfilePicture = async (req: Request, res: Response) => {
//   try {
//     const { userId } = req.body;
//     const file = req.file;

//     if (!file) {
//       return res.status(400).json({ error: "Keine Datei hochgeladen" });
//     }
//     if (!userId) {
//       return res.status(400).json({ error: "User ID fehlt" });
//     }

//     // const filePath = `${userId}/user_${Date.now()}`;
//     const filePath = `images/${userId}`;
//     // const filePath = `profiles/ce64ce9e-7bf1-492f-a835-3c545192afcd`;
//     const { data, error } = await supabase.storage
//       .from("userimages")
//       .upload(filePath, file.buffer, {
//         contentType: file.mimetype,
//         upsert: true,
//         cacheControl: "max-age=0, must-revalidate",
//       });

//     if (error) {
//       console.error("Fehler beim Hochladen:", error);
//       return res.status(400).json({ error: error.message });
//     }
//     // console.log("data", data);

//     // const fileUrl = `${supabaseUrl}/storage/v1/object/public/UserImages/${filePath}`;

//     return res.status(201).json({
//       message: "Bild erfolgreich hochgeladen",
//       // data: { path: filePath, url: fileUrl },
//     });
//   } catch (error) {
//     console.error("Fehler beim Upload:", error);
//     return res.status(500).json({ error: "Interner Serverfehler" });
//   }
// };
// export const userController = {
//   getUser,
//   updateUser,
//   uploadUserProfilePicture,
// };
