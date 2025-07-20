"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { uploadMiddleware } = require("../controller/user.controller");
const { userController } = require("../controller/user.controller");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const router = express_1.default.Router();
module.exports = (app) => {
    app.use((_req, res, next) => {
        res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
        next();
    });
    router.get("/getUser", userController.getUser);
    router.put("/updateUser", userController.updateUser);
    router.post("/uploadUserProfilePicture", uploadMiddleware, userController.uploadUserProfilePicture);
    // app.use("/v1/users", router);
    app.use("/v1/users", auth_middleware_1.default, router);
};
