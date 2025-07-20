"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { adminController } = require("../controller/admin.controller");
const adminAuth_middleware_1 = __importDefault(require("../middleware/adminAuth.middleware"));
const router = express_1.default.Router();
module.exports = (app) => {
    app.use((_req, res, next) => {
        res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
        next();
    });
    router.get("/getUser/:userId", adminController.getUser);
    router.put("/updateUser/:userId", adminController.updateUser);
    router.delete("/deleteUser/:userId", adminController.deleteUser);
    router.get("/getAllUsers", adminController.getAllUsers);
    router.get("/getKebapsList", adminController.getKebapsList);
    router.get("/getKebapById/:id", adminController.getKebapById);
    router.post("/createKebap", adminController.createKebap);
    router.delete("/deleteKebap/:id", adminController.deleteKebap);
    router.post("/setKebapAsMember", adminController.setKebapAsMember);
    router.post("/removeUserFromKebap", adminController.removeUserFromKebap);
    router.get("/getLatestSubscription", adminController.getLatestSubscription);
    router.post("/extendSubscription", adminController.extendSubscription);
    router.get("/getMessagesBasedOnType", adminController.getMessagesBasedOnType);
    router.delete("/deleteMessage/:id", adminController.deleteMessage);
    // app.use("/v1/users", router);
    app.use("/v1/admin", adminAuth_middleware_1.default, router);
};
