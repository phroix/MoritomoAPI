"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { uploadMiddleware } = require("../controller/user.controller");
const { testController } = require("../controller/test.controller");
const router = express_1.default.Router();
module.exports = (app) => {
    app.use((_req, res, next) => {
        res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
        next();
    });
    router.get("/", testController.getTest);
    router.post("/", testController.createTest);
    app.use("/v1/tests", router);
    // app.use("/v1/tests", authMiddleware, router);
};
