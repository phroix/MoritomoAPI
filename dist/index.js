"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// home route
app.get("/", (req, res) => {
    res.json({ message: "MoriTomo-API v1.0.0" });
});
//routes
require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);
require("./routes/admin.routes")(app);
require("./routes/test.routes")(app);
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log("Server is running on Port", PORT);
});
