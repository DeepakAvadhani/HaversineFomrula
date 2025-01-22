const express = require("express");
const cors = require("cors");
const config = require("./config/config.json")["development"];
const zoneRoutes = require("./routes/zoneCoordinate.routes");
const agentRoutes = require("./routes/agentRoutes");
const redis = require("redis");
const app = express();
const PORT = config.port1;

app.use(express.json());
app.use(cors());

const redisClient = redis.createClient({
  url: "redis://127.0.0.1:6379",
});

redisClient.on("error", (err) => console.error("Redis Client Error:", err));

(async () => {
  try {
    await redisClient.connect();
    console.log("Connected to Redis");

    app.locals.redisClient = redisClient;

    app.listen(PORT, () => {
      console.log(`Server is up and running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Failed to connect to Redis:", error);
    process.exit(1);
  }
})();

app.get("/", (req, res) => {
  res.send("Welcome to Map Analyzer");
});

app.use("/api", zoneRoutes);
app.use("/api", agentRoutes);
