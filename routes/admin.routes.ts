import express, { Application, Request, Response, NextFunction } from "express";
const { adminController } = require("../controller/admin.controller");
import adminAuthMiddleware from "../middleware/adminAuth.middleware";

const router = express.Router();

module.exports = (app: Application) => {
  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
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
  app.use("/v1/admin", adminAuthMiddleware, router);
};
