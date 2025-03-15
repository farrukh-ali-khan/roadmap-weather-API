# Weather API with Redis Caching

This project is a Node.js/Express application that provides a simple weather API endpoint. It fetches weather data from [Visual Crossing](https://www.visualcrossing.com/weather-api) and caches the responses in Redis for 12 hours to reduce the number of external API calls. Additionally, it includes rate limiting using `express-rate-limit` to prevent abuse.

## Features

- **Weather API Endpoint**: Get weather information by providing a city name.
- **Redis Caching**: Stores weather responses in Redis with a 12-hour expiration.
- **Rate Limiting**: Limits each IP to 10 requests per minute.
- **Environment Variables**: Uses `dotenv` to securely manage configuration details like API keys and Redis credentials.

## Prerequisites

- [Node.js](https://nodejs.org/en/) (v14+ recommended)
- [Redis](https://redis.io/) (running locally or via a managed service)
- A Visual Crossing Weather API key (free sign-up available at [Visual Crossing](https://www.visualcrossing.com/weather-api))

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/farrukh-ali-khan/roadmap-weather-API.git
   cd weather-api
   ```

Install dependencies:
npm install

Create a .env file:

Create a .env file in the root directory and add the following content, updating the values with your credentials:

PORT=3000
WEATHER_API_KEY=YOUR_VISUAL_CROSSING_API_KEY

REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_USERNAME=default
REDIS_PASSWORD=your_redis_password
