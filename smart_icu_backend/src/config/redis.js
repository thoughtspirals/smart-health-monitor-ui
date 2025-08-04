const redis = require("redis");

const redisClient = redis.createClient({
  socket: {
    host: "localhost", // If running Redis inside Docker on the same machine
    port: 6379,
  },
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

redisClient.connect();

module.exports = redisClient;
