require("dotenv").config(); // Loads .env into process.env
const express = require("express");
const axios = require("axios");
const rateLimit = require("express-rate-limit");
const { createClient } = require("redis");

// Read environment variables
const {
  PORT = 3000,
  WEATHER_API_KEY,
  REDIS_HOST = "127.0.0.1",
  REDIS_PORT = 6379,
  REDIS_USERNAME,
  REDIS_PASSWORD,
} = process.env;

// Initialize Express
const app = express();

// Rate Limiter: limits each IP to 10 requests per minute
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: { error: "Too many requests, please try again later." },
});
app.use(limiter);

// Create Redis client
const redisClient = createClient({
  username: REDIS_USERNAME, // optional
  password: REDIS_PASSWORD, // optional
  socket: {
    host: REDIS_HOST,
    port: REDIS_PORT,
  },
});

// Connect Redis
redisClient.connect().catch((err) => {
  console.error("Redis connection error:", err);
});

/**
 * GET /weather?city=YOUR_CITY
 * Example: /weather?city=London
 */
app.get("/weather", async (req, res) => {
  const { city } = req.query;
  if (!city) {
    return res
      .status(400)
      .json({ error: "Please provide a city, e.g. ?city=London" });
  }

  try {
    // 1) Check cache for city
    const cachedData = await redisClient.get(city);
    if (cachedData) {
      console.log("Returning cached data");
      return res.json(JSON.parse(cachedData));
    }

    // 2) If not in cache, request from Visual Crossing (or any 3rd party)
    console.log("Fetching fresh data from API...");
    const apiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(
      city
    )}`;
    const params = {
      key: WEATHER_API_KEY,
      unitGroup: "metric", // or 'us' if you want Fahrenheit
    };

    const response = await axios.get(apiUrl, { params });
    const weatherData = response.data;

    // 3) Store in Redis with a 12-hour expiration (43200 seconds)
    await redisClient.setEx(city, 43200, JSON.stringify(weatherData));

    // 4) Return response
    return res.json(weatherData);
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    return res.status(500).json({
      error: "Failed to fetch weather data. Please try again later.",
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Weather API running on port ${PORT}`);
});
