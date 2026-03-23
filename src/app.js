const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Vibetrack API Running...");
});

module.exports = app;
