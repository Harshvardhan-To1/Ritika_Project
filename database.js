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
    email TEXT,
    password TEXT NOT NULL,
    is_verified INTEGER DEFAULT 0,
    verification_code TEXT,
    code_expiry TEXT
  )`, (err) => {
    if (err) {
      console.error('Error creating users table:', err.message);
    } else {
      console.log('Users table ready.');
      
      // Check if we need to add new columns to existing table
      db.all("PRAGMA table_info(users)", (err, columns) => {
        if (err) {
          console.error('Error checking table schema:', err);
          return;
        }
        
        const hasVerificationCode = columns.some(col => col.name === 'verification_code');
        const hasCodeExpiry = columns.some(col => col.name === 'code_expiry');
        
        if (!hasVerificationCode) {
          db.run("ALTER TABLE users ADD COLUMN verification_code TEXT", (err) => {
            if (err) console.error('Error adding verification_code column:', err);
            else console.log('Added verification_code column to users table');
          });
        }
        
        if (!hasCodeExpiry) {
          db.run("ALTER TABLE users ADD COLUMN code_expiry TEXT", (err) => {
            if (err) console.error('Error adding code_expiry column:', err);
            else console.log('Added code_expiry column to users table');
          });
        }
      });
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

  db.run(`CREATE TABLE IF NOT EXISTS success_stories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    student_name TEXT,
    company_name TEXT NOT NULL,
    story TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`, (err) => {
    if (err) {
      console.error('Error creating success_stories table:', err.message);
    } else {
      console.log('Success stories table ready.');
    }
  });
});

module.exports = db;