"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { authController } = require("../controller/auth.controller");
const { withSupabase } = require("../middleware/auth.middleware");
const router = express_1.default.Router();
module.exports = (app) => {
    app.use((_req, res, next) => {
        res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
        next();
    });
    router.post("/session", authController.login);
    router.delete("/session", withSupabase, authController.logout);
    app.use("/v1/auth", router);
};
