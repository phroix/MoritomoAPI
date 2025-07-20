import express, { Application, Request, Response, NextFunction } from "express";
const { uploadMiddleware } = require("../controller/user.controller");
const { userController } = require("../controller/user.controller");
import authMiddleware from "../middleware/auth.middleware";

const router = express.Router();

module.exports = (app: Application) => {
  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  router.get("/getUser", userController.getUser);
  router.put("/updateUser", userController.updateUser);
  router.post(
    "/uploadUserProfilePicture",
    uploadMiddleware,
    userController.uploadUserProfilePicture
  );

  // app.use("/v1/users", router);
  app.use("/v1/users", authMiddleware, router);
};
