"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const db_config_1 = require("../config/db.config");
const refreshSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { data, error } = yield db_config_1.supabase.auth
            .refreshSession();
        if (error) {
            // Handle the error (e.g., invalid refresh token)
            return res.status(401).json({ error: error.message });
        }
        const { session, user } = data;
        res.status(200).json({ session, user });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, fullName } = req.body;
        let { data, error } = yield db_config_1.supabase.auth.signUp({
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
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    try {
        const { email, password } = req.body;
        let { data, error } = yield db_config_1.supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });
        if (error) {
            return res.status(400).json({ error: error === null || error === void 0 ? void 0 : error.message });
        }
        let kebapData = null;
        // Erst das Kebap laden
        const { data: kebap, error: kebapError } = yield db_config_1.supabase
            .from("kebaps")
            .select("*")
            .eq("user_id", (_a = data.user) === null || _a === void 0 ? void 0 : _a.id)
            .single();
        // Prüfen, ob ein gültiges Abo existiert
        let hasValidSubscription = false;
        if (!kebapError && kebap) {
            const { data: subscription, error: subscriptionError } = yield db_config_1.supabase
                .from("subscriptions")
                .select("*")
                .eq("kebap_id", kebap.id)
                .gt("endDate", new Date().toISOString())
                .single();
            hasValidSubscription = !!subscription && !subscriptionError;
        }
        if (!kebapError && kebap && hasValidSubscription) {
            // Nur wenn gültiges Abo, lade Bilder und Reviews
            const { data: files, error: listError } = yield db_config_1.supabase.storage
                .from("KebapImages")
                .list(`${kebap.user_id}`, {
                limit: 6,
                sortBy: { column: "name", order: "asc" },
            });
            const imageFiles = (files === null || files === void 0 ? void 0 : files.filter((file) => file.name !== ".emptyFolderPlaceholder")) || [];
            let images = [];
            if (!listError && imageFiles.length > 0) {
                const imageUrls = yield Promise.all(imageFiles.map((file) => __awaiter(void 0, void 0, void 0, function* () {
                    const { data: publicUrl } = yield db_config_1.supabase.storage
                        .from("KebapImages")
                        .getPublicUrl(`${kebap.user_id}/${file.name}`);
                    return {
                        name: file.name,
                        url: publicUrl === null || publicUrl === void 0 ? void 0 : publicUrl.publicUrl,
                    };
                })));
                images = imageUrls.filter((img) => img.url);
            }
            const { data: reviews, error: reviewsError } = yield db_config_1.supabase
                .from("reviews")
                .select("id")
                .eq("kebap_id", kebap.id);
            const numberOfReviews = (reviews === null || reviews === void 0 ? void 0 : reviews.length) || 0;
            kebapData = Object.assign(Object.assign({}, kebap), { images,
                numberOfReviews });
        }
        const kebapResult = Object.assign({ isKebap: kebapData ? true : false }, (kebapData && { kebapData: kebapData }));
        return res.status(200).json(Object.assign({ session: {
                access_token: (_b = data.session) === null || _b === void 0 ? void 0 : _b.access_token,
                token_type: (_c = data.session) === null || _c === void 0 ? void 0 : _c.token_type,
                expires_in: (_d = data.session) === null || _d === void 0 ? void 0 : _d.expires_in,
                expires_at: (_e = data.session) === null || _e === void 0 ? void 0 : _e.expires_at,
                refresh_token: (_f = data.session) === null || _f === void 0 ? void 0 : _f.refresh_token,
            }, kebap: kebapResult }, (((_g = data.user) === null || _g === void 0 ? void 0 : _g.user_metadata.role) && {
            role: (_h = data.user) === null || _h === void 0 ? void 0 : _h.user_metadata.role,
        })));
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});
const signout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { error } = yield db_config_1.supabase.auth.signOut();
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        return res.status(200).json({ message: "Logged out successfully" });
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    // console.log(email);
    try {
        const { data, error } = yield db_config_1.supabase.auth.signInWithOtp({
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
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { email, otp } = req.body;
    // console.log(email);
    try {
        const { data: { session }, error, } = yield db_config_1.supabase.auth.verifyOtp({
            email: email,
            token: otp,
            type: "email",
        });
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        let kebapData = null;
        // Erst das Kebap laden
        const { data: kebap, error: kebapError } = yield db_config_1.supabase
            .from("kebaps")
            .select("*")
            .eq("user_id", (_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.id)
            .single();
        // Prüfen, ob ein gültiges Abo existiert
        let hasValidSubscription = false;
        if (!kebapError && kebap) {
            const { data: subscription, error: subscriptionError } = yield db_config_1.supabase
                .from("subscriptions")
                .select("*")
                .eq("kebap_id", kebap.id)
                .gt("endDate", new Date().toISOString())
                .single();
            hasValidSubscription = !!subscription && !subscriptionError;
        }
        if (!kebapError && kebap && hasValidSubscription) {
            // Nur wenn gültiges Abo, lade Bilder und Reviews
            const { data: files, error: listError } = yield db_config_1.supabase.storage
                .from("KebapImages")
                .list(`${kebap.user_id}`, {
                limit: 6,
                sortBy: { column: "name", order: "asc" },
            });
            const imageFiles = (files === null || files === void 0 ? void 0 : files.filter((file) => file.name !== ".emptyFolderPlaceholder")) || [];
            let images = [];
            if (!listError && imageFiles.length > 0) {
                const imageUrls = yield Promise.all(imageFiles.map((file) => __awaiter(void 0, void 0, void 0, function* () {
                    const { data: publicUrl } = yield db_config_1.supabase.storage
                        .from("KebapImages")
                        .getPublicUrl(`${kebap.user_id}/${file.name}`);
                    return {
                        name: file.name,
                        url: publicUrl === null || publicUrl === void 0 ? void 0 : publicUrl.publicUrl,
                    };
                })));
                images = imageUrls.filter((img) => img.url);
            }
            const { data: reviews, error: reviewsError } = yield db_config_1.supabase
                .from("reviews")
                .select("id")
                .eq("kebap_id", kebap.id);
            const numberOfReviews = (reviews === null || reviews === void 0 ? void 0 : reviews.length) || 0;
            kebapData = Object.assign(Object.assign({}, kebap), { images,
                numberOfReviews });
        }
        const kebapResult = Object.assign({ isKebap: kebapData ? true : false }, (kebapData && { kebapData: kebapData }));
        return res.status(200).json(Object.assign({ session: {
                access_token: session === null || session === void 0 ? void 0 : session.access_token,
                token_type: session === null || session === void 0 ? void 0 : session.token_type,
                expires_in: session === null || session === void 0 ? void 0 : session.expires_in,
                expires_at: session === null || session === void 0 ? void 0 : session.expires_at,
                refresh_token: session === null || session === void 0 ? void 0 : session.refresh_token,
            }, kebap: kebapResult }, (((_b = session === null || session === void 0 ? void 0 : session.user) === null || _b === void 0 ? void 0 : _b.user_metadata.role) && {
            role: (_c = session === null || session === void 0 ? void 0 : session.user) === null || _c === void 0 ? void 0 : _c.user_metadata.role,
        })));
        // if (error) {
        //   return res.status(400).json({ error: error.message });
        // }
        // return res.status(200).json({ message: "OTP verified successfully" });
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});
const checkUserForKebap = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.body;
    // console.log("checkUserForKebap", user_id);
    // console.log("user_id", user_id);
    try {
        let { data: kebap, error: kebapsError } = yield db_config_1.supabase
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
        }
        else {
            return res.status(404).json({ message: "No kebaps found for this user" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.authController = {
    signup,
    signin,
    signout,
    forgotPassword,
    checkUserForKebap,
    refreshSession,
    verifyOtp,
};
