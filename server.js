const express = require('express');
const axios = require('axios');
const { createClient } = require('redis');

// Create an Express app
const app = express();

// Redis connection details
const REDIS_HOST = 'redis://'; // Correct Redis connection URL format

// Create a Redis client
const redisClient = createClient({
  url: REDIS_HOST,
});

// Log Redis connection errors
redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

// Ensure Redis client is connected before handling requests
(async () => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis');

    // Middleware to check the cache for the /todos endpoint
    const cacheMiddleware = async (req, res, next) => {
      const cacheKey = 'todos'; // We use a single key for the entire list of todos

      try {
        // Check if the data is in Redis cache
        const cachedData = await redisClient.get(cacheKey);

        if (cachedData !== null) {
          // If cache hit, send the cached response
          console.log('Cache hit');
          return res.json(JSON.parse(cachedData));
        } else {
          // If cache miss, proceed to the next middleware
            console.log('Cache miss');
            next();
        }
      } catch (err) {
        console.error('Redis GET error:', err);
        next(); // If there's an error, proceed without the cache
      }
    };

    // Route to get the entire list of todos with caching
    app.get('/todos', cacheMiddleware, async (req, res) => {
      try {
        // Fetch the data from the external API
        const response = await axios.get('https://jsonplaceholder.typicode.com/todos');

        const data = response.data;

        // Store the fetched data in Redis with an expiration time (30 seconds)
        await redisClient.setEx('todos', 30, JSON.stringify(data)); //TTL

        // Send the response to the client
        res.json(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Server Error');
      }
    });

    // Start the server after the Redis client is connected
    const PORT = process.env.PORT || 1000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
  }
})();
