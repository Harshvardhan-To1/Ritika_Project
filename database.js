const sqlite3 = require('sqlite3').verbose();

// Create database with OPEN_READWRITE | OPEN_CREATE flags to create if doesn't exist
const db = new sqlite3.Database('./placements.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
    process.exit(1); // Exit if can't connect to database
  }
  console.log('Connected to the placements database.');
});

// Create tables if they don't exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  )`, (err) => {
    if (err) {
      console.error('Error creating users table:', err.message);
    } else {
      console.log('Users table ready.');
    }
  });

  db.run(`CREATE TABLE IF NOT EXISTS profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    resume_path TEXT,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`, (err) => {
    if (err) {
      console.error('Error creating profiles table:', err.message);
    } else {
      console.log('Profiles table ready.');
    }
  });

  db.run(`CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_name TEXT NOT NULL,
    application_date TEXT NOT NULL
  )`, (err) => {
    if (err) {
      console.error('Error creating applications table:', err.message);
    } else {
      console.log('Applications table ready.');
    }
  });
});

module.exports = db;