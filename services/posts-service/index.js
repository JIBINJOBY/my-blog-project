// services/posts-service/index.js
const express = require('express');
const { Pool } = require('pg'); // PostgreSQL client

const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies
const port = 5001;

// --- Database Connection ---
// Read the connection string from the environment variable injected by Kubernetes
const connectionString = process.env.DB_CONNECTION_STRING;

if (!connectionString) {
  console.error("FATAL ERROR: DB_CONNECTION_STRING environment variable is not set.");
  process.exit(1); // Exit if the connection string is missing
}

const pool = new Pool({
  connectionString: connectionString,
  // Recommended settings for Azure PostgreSQL with SSL
  ssl: {
    rejectUnauthorized: false 
  }
});

// --- Database Initialization ---
async function initializeDatabase() {
  try {
    const client = await pool.connect();
    console.log("Connected to the database successfully!");

    // Create the 'posts' table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Ensured 'posts' table exists.");
    client.release(); // Release the client back to the pool
  } catch (err) {
    console.error("Error initializing database:", err.stack);
    process.exit(1); // Exit if database initialization fails
  }
}

// --- API Endpoints ---

// GET /posts - Fetch all posts from the database
app.get('/posts', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT id, title, content, created_at FROM posts ORDER BY created_at DESC');
    client.release();
    res.json(result.rows); // Send the posts back as JSON
  } catch (err) {
    console.error("Error fetching posts:", err.stack);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// POST /posts - Create a new post in the database
app.post('/posts', async (req, res) => {
  const { title, content } = req.body; // Get title and content from request body

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO posts (title, content) VALUES ($1, $2) RETURNING id, title, content, created_at',
      [title, content || ''] // Use empty string if content is not provided
    );
    client.release();
    res.status(201).json(result.rows[0]); // Send the newly created post back
  } catch (err) {
    console.error("Error creating post:", err.stack);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// --- Start Server ---
// Initialize DB first, then start listening
initializeDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Posts service listening on port ${port}`);
  });
});