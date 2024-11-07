# redis-cache-testing-todo-api

A simple demo application using Express.js and Redis to demonstrate caching and cache key testing with a sample Todos API

## Features

- Middleware for checking and setting cache keys in Redis.
- Fetches data from an external API and caches it in Redis.
- Configurable cache expiration time (TTL).
- Demonstrates handling cache hits, misses, and Redis errors.

## Prerequisites

- Node.js (v14+ recommended)
- Redis (installed locally or accessible via a hosted service like Redis Cloud)
- npm or yarn for dependency management

## Project Structure

The project structure is as follows:
redis-cache-demo/
├── index.js         # Main application file
├── package.json     # Project metadata and dependencies
└── README.md        # Project documentation

# Getting Started

1. Clone the Repository
```bash
git clone https://github.com/<your-username>/redis-cache-demo.git
cd redis-cache-demo

```
2. Install Dependencies
```bash
npm install
```
3. Configure Redis Connection
Open index.js.
Set the REDIS_HOST variable to your Redis instance's connection URL. Example for a local Redis instance:
javascript
Copy code
const REDIS_HOST = 'redis://127.0.0.1:6379';
4. Start the Server
```bash
npm start
```
The server will start on port 1000 (or a port defined in your environment variables).

5. Access the API
Endpoint: /todos
Retrieves the Todos list.
Caches the response in Redis with a 30-second expiration.
Example:
```bash
curl http://localhost:1000/todos
```
