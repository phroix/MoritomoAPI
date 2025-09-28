import express, { Application, Request, Response, NextFunction } from "express";
const { authController } = require("../controller/auth.controller");
const { withSupabase } = require("../middleware/auth.middleware");

const router = express.Router();

module.exports = (app: Application) => {
  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  router.post("/session", authController.login);
  router.delete("/session", withSupabase, authController.logout);

  app.use("/v1/auth", router);
};
