import express, { Application, Request, Response, NextFunction } from "express";
const {
  transactionController,
} = require("../../controller/zaimu/transaction.controller");
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
    "/transactions/transactionsByOverview",
    authMiddleware,
    withSupabase,
    transactionController.getTransactions
  );
  router.post(
    "/transactions/transaction",
    authMiddleware,
    withSupabase,
    transactionController.createTransaction
  );
  router.put(
    "/transactions/transaction/:id",
    authMiddleware,
    withSupabase,
    transactionController.updateTransaction
  );
  router.delete(
    "/transactions/transaction/:id",
    authMiddleware,
    withSupabase,
    transactionController.deleteTransaction
  );

  app.use("/v1/zaimu", router);
};
