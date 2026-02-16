"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { overviewController, } = require("../../controller/zaimu/overview.controller");
const auth_middleware_1 = __importDefault(require("../../middleware/auth.middleware"));
const auth_middleware_2 = require("../../middleware/auth.middleware");
const router = express_1.default.Router();
module.exports = (app) => {
    app.use((_req, res, next) => {
        res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
        next();
    });
    router.get("/overviews/monthlyOverviews", auth_middleware_1.default, auth_middleware_2.withSupabase, overviewController.getOverviews);
    router.get("/overviews/monthlyOverviewAmount", auth_middleware_1.default, auth_middleware_2.withSupabase, overviewController.getOverviewAmount);
    router.post("/overviews/overview", auth_middleware_1.default, auth_middleware_2.withSupabase, overviewController.createOverview);
    router.put("/overviews/overview/:id", auth_middleware_1.default, auth_middleware_2.withSupabase, overviewController.updateOverview);
    router.delete("/overviews/overview/:id", auth_middleware_1.default, auth_middleware_2.withSupabase, overviewController.deleteOverview);
    app.use("/v1/zaimu", router);
};
