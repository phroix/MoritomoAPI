import express, { Application, Request, Response, NextFunction } from "express";
const { authController } = require("../controller/auth.controller");

const router = express.Router();

module.exports = (app: Application) => {
  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
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
