require("dotenv").config();
const express = require("express");
const cors = require("cors");
const config = require("./config/config.json")["development"];
const redisClient = require("./config/redisConfig");
const zoneRoutes = require("./routes/zoneCoordinate.routes");
const agentRoutes = require("./routes/agentRoutes");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const app = express();
const PORT = config.port1;

app.use(express.json());
app.use(cors());

app.locals.redisClient = redisClient;

app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Welcome to Map Analyzer");
});

app.use("/api/delivery", zoneRoutes);
app.use("/api/delivery", agentRoutes);
app.use("/api/delivery", productRoutes);
app.use("/api/delivery", userRoutes);
app.use("/api/delivery", notificationRoutes);
