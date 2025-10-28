// A simple "Hello World" API server
const express = require('express');
const app = express();
const port = 5001; // This service will run on port 5001

// A simple endpoint to prove it's working
app.get('/posts', (req, res) => {
  res.json([
    { id: 1, title: "Hello from the Posts Service!" },
    { id: 2, title: "DevOps is fun!" }
  ]);
});

// Get the DB password from an environment variable (set by Kubernetes)
app.get('/db-test', (req, res) => {
  const dbPassword = process.env.DB_PASSWORD || "Not Set";
  res.send(`Database password is: ${dbPassword}`);
});

app.listen(port, () => {
  console.log(`Posts service listening on port ${port}`);
});