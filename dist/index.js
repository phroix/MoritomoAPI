"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const ORIGINS = [
    "http://localhost:3000",
    "https://moritomo.philroth.com", // dein Web-Frontend (falls vorhanden)
];
app.use((0, cors_1.default)({
    origin: ORIGINS,
    credentials: true,
}));
// home route
app.get("/", (req, res) => {
    res.json({ message: "MoriTomo-API v1.0" });
});
//routes
require("./routes/auth.routes")(app);
require("./routes/zaimu/overview.routes")(app);
require("./routes/zaimu/transaction.routes")(app);
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log("Server is running on Port", PORT);
});
