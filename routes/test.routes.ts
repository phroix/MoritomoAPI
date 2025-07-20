import express, { Application, Request, Response, NextFunction } from "express";
const { uploadMiddleware } = require("../controller/user.controller");
const { testController } = require("../controller/test.controller");
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

  router.get("/", testController.getTest);
  router.post("/", testController.createTest);

  app.use("/v1/tests", router);
  // app.use("/v1/tests", authMiddleware, router);
};
