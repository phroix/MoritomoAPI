import express, { Application, Request, Response, NextFunction } from "express";
const {
  overviewController,
} = require("../../controller/zaimu/overview.controller");
import authMiddleware from "../../middleware/auth.middleware";
import { withSupabase } from "../../middleware/auth.middleware";

const router = express.Router();

module.exports = (app: Application) => {
  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  router.get(
    "/overviews/monthlyOverviews",
    authMiddleware,
    withSupabase,
    overviewController.getOverviews
  );
  router.get(
    "/overviews/monthlyOverviewAmount",
    authMiddleware,
    withSupabase,
    overviewController.getOverviewAmount
  );
  router.post(
    "/overviews/overview",
    authMiddleware,
    withSupabase,
    overviewController.createOverview
  );
  router.put(
    "/overviews/overview/:id",
    authMiddleware,
    withSupabase,
    overviewController.updateOverview
  );
  router.delete(
    "/overviews/overview/:id",
    authMiddleware,
    withSupabase,
    overviewController.deleteOverview
  );

  app.use("/v1/zaimu", router);
};
