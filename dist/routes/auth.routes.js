"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { authController } = require("../controller/auth.controller");
const router = express_1.default.Router();
module.exports = (app) => {
    app.use((_req, res, next) => {
        res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
        next();
    });
    router.post("/signup", authController.signup);
    router.post("/signin", authController.signin);
    router.post("/signout", authController.signout);
    router.post("/forgotPassword", authController.forgotPassword);
    router.post("/checkUserForKebap", authController.checkUserForKebap);
    router.post("/refreshSession", authController.refreshSession);
    router.post("/verifyOtp", authController.verifyOtp);
    app.use("/v1/auth", router);
};
