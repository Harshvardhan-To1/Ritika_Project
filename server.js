const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('./database.js');
const bcrypt = require('bcrypt');
const session = require('express-session');
require('dotenv').config();

const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const app = express();
const port = 3000;

// Serve static files from the root directory
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Route to handle resume uploads
app.post('/upload', upload.single('resume'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.send(`File uploaded successfully: ${req.file.path}`);
});

// Route to handle drive applications
app.post('/apply', (req, res) => {
  const { company_name } = req.body;
  const application_date = new Date().toISOString();

  const sql = `INSERT INTO applications (company_name, application_date) VALUES (?, ?)`;
  db.run(sql, [company_name, application_date], (err) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send('Error saving application.');
    }
    res.redirect('/applySuccess.html');
  });
});

// Chatbot route
app.use(express.json());
app.post('/chatbot', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp"});
    const result = await model.generateContent(userMessage);
    const response = await result.response;
    const text = response.text();
    res.json({ response: text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ response: 'Error generating response from AI.' });
  }
});

// Signup route
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const sql = `INSERT INTO users (username, password) VALUES (?, ?)`;
  db.run(sql, [username, hashedPassword], (err) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send('Error creating user.');
    }
    res.redirect('/signin.html');
  });
});

// Signin route
app.post('/signin', (req, res) => {
  const { username, password } = req.body;
  const sql = `SELECT * FROM users WHERE username = ?`;
  db.get(sql, [username], async (err, user) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send('Error signing in.');
    }
    if (!user) {
      return res.status(400).send('User not found.');
    }
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      req.session.userId = user.id;
      res.redirect('/profile.html');
    } else {
      res.status(400).send('Invalid credentials.');
    }
  });
});

// Profile data route
app.get('/profile-data', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send('Not authenticated.');
  }
  const sql = `SELECT * FROM profiles WHERE user_id = ?`;
  db.get(sql, [req.session.userId], (err, profile) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send('Error fetching profile.');
    }
    res.json(profile);
  });
});

// Update profile route
app.post('/update-profile', upload.single('resume'), (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send('Not authenticated.');
  }

  const { full_name, email, phone } = req.body;
  const resume_path = req.file ? req.file.path : null;

  const sql = `SELECT * FROM profiles WHERE user_id = ?`;
  db.get(sql, [req.session.userId], (err, profile) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send('Error updating profile.');
    }

    if (profile) {
      const updateSql = `UPDATE profiles SET full_name = ?, email = ?, phone = ?, resume_path = ? WHERE user_id = ?`;
      db.run(updateSql, [full_name, email, phone, resume_path, req.session.userId], (err) => {
        if (err) {
          console.error(err.message);
          return res.status(500).send('Error updating profile.');
        }
        res.redirect('/profile.html');
      });
    } else {
      const insertSql = `INSERT INTO profiles (user_id, full_name, email, phone, resume_path) VALUES (?, ?, ?, ?, ?)`;
      db.run(insertSql, [req.session.userId, full_name, email, phone, resume_path], (err) => {
        if (err) {
          console.error(err.message);
          return res.status(500).send('Error updating profile.');
        }
        res.redirect('/profile.html');
      });
    }
  });
});

// Middleware to protect routes
const protectedRoute = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/signin.html');
  }
  next();
};

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/profile.html');
    }
    res.clearCookie('connect.sid');
    res.redirect('/signin.html');
  });
});

app.get('/profile.html', protectedRoute, (req, res) => {
    res.sendFile(path.join(__dirname, 'protected', 'profile.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
