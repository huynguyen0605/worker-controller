const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Create or open a SQLite database
const db = new sqlite3.Database('database.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS interactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      content TEXT,
      params TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS processes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      interactions TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS configurations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      process_id INTEGER,
      client_id INTEGER,
      FOREIGN KEY(process_id) REFERENCES processes(id),
      FOREIGN KEY(client_id) REFERENCES clients(id)
  )`);
});

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Middleware to handle CORS (Cross-Origin Resource Sharing) - Adjust as needed for your environment
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

require('./routes/clients')(app, db);
require('./routes/interactions')(app, db);
require('./routes/processes')(app, db);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
