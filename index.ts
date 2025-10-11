import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";

dotenv.config();

const app: Express = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

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
