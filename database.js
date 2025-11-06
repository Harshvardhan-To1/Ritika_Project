const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./placements.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the placements database.');
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  )`, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Users table created.');
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
      console.error(err.message);
    }
    console.log('Profiles table created.');
  });

  db.run(`CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_name TEXT NOT NULL,
    application_date TEXT NOT NULL
  )`, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Applications table created.');
  });
});

module.exports = db;
