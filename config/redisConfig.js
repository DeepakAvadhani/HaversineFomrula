const Redis = require("ioredis");

const redis = new Redis({
  host: 'localhost',
  port: 6379,
  password: 'your_password',
  db: 0
});

redis.on("connect", () => {
  console.log("Connected to Redis successfully.");
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

module.exports = redis;
