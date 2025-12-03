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
app.use(express.json());

// Improved session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

const crypto = require('crypto');

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

// Helper function to send HTML error pages
function sendErrorPage(res, statusCode, message) {
  res.status(statusCode).send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Error</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 50px auto;
          padding: 20px;
          text-align: center;
        }
        .error-box {
          background-color: #ffe6e6;
          border: 1px solid #ff4444;
          border-radius: 5px;
          padding: 20px;
          margin: 20px 0;
        }
        .error-box h2 {
          color: #cc0000;
          margin-top: 0;
        }
        .error-box p {
          color: #333;
        }
        a {
          display: inline-block;
          margin-top: 20px;
          padding: 10px 20px;
          background-color: #007bff;
          color: white;
          text-decoration: none;
          border-radius: 4px;
        }
        a:hover {
          background-color: #0056b3;
        }
      </style>
    </head>
    <body>
      <div class="error-box">
        <h2>Error</h2>
        <p>${message}</p>
      </div>
      <a href="javascript:history.back()">Go Back</a>
    </body>
    </html>
  `);
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to handle resume uploads
app.post('/upload', upload.single('resume'), (req, res) => {
  if (!req.file) {
    return sendErrorPage(res, 400, 'No file uploaded.');
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
      return sendErrorPage(res, 500, 'Error saving application.');
    }
    res.redirect('/applySuccess.html');
  });
});

// Chatbot route
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

// Redirect /signup GET requests to signup.html
app.get('/signup', (req, res) => {
  res.redirect('/signup.html');
});

// FIXED: Signup route with better validation and error handling
app.post('/signup', async (req, res) => {
  const { username, password, email } = req.body;

  console.log('Signup attempt:', { username, email, passwordLength: password?.length });

  // Validate input
  if (!username || !password || !email) {
    return sendErrorPage(res, 400, 'Username, email and password are required.');
  }

  if (username.length < 3) {
    return sendErrorPage(res, 400, 'Username must be at least 3 characters long.');
  }

  if (password.length < 6) {
    return sendErrorPage(res, 400, 'Password must be at least 6 characters long.');
  }

  try {
    // Check if user already exists
    const checkSql = `SELECT * FROM users WHERE username = ? OR email = ?`;
    db.get(checkSql, [username, email], async (err, existingUser) => {
      if (err) {
        console.error('Database error checking user:', err.message);
        return sendErrorPage(res, 500, 'Database error. Please try again.');
      }

      if (existingUser) {
        return sendErrorPage(res, 400, 'Username or email already exists. Please choose another.');
      }

      try {
        // Hash password and create user
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const insertSql = `INSERT INTO users (username, password, email, verification_token, is_verified) VALUES (?, ?, ?, ?, 0)`;
        
        db.run(insertSql, [username, hashedPassword, email, verificationToken], function(err) {
          if (err) {
            console.error('Error creating user:', err.message);
            return sendErrorPage(res, 500, 'Error creating user. Please try again.');
          }
          
          console.log('User created with ID:', this.lastID);

          // SIMULATE SENDING EMAIL
          const verifyLink = `http://localhost:${port}/verify-email?token=${verificationToken}`;
          console.log(`\n---------------------------------------------------------`);
          console.log(`SIMULATED EMAIL TO: ${email}`);
          console.log(`SUBJECT: Verify your email`);
          console.log(`BODY: Click here to verify your account: ${verifyLink}`);
          console.log(`---------------------------------------------------------\n`);
          
          // Create empty profile for new user, initializing with email
          const profileSql = `INSERT INTO profiles (user_id, full_name, email, phone, resume_path) VALUES (?, '', ?, '', '')`;
          db.run(profileSql, [this.lastID, email], (profileErr) => {
            if (profileErr) {
              console.error('Error creating profile:', profileErr.message);
            } else {
              console.log('Profile created for user:', this.lastID);
            }
          });

          // Redirect to success page or show message
          res.send(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>Signup Successful</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  max-width: 600px;
                  margin: 50px auto;
                  padding: 20px;
                  text-align: center;
                }
                .success-box {
                  background-color: #e6ffe6;
                  border: 1px solid #44ff44;
                  border-radius: 5px;
                  padding: 20px;
                  margin: 20px 0;
                }
                .info-box {
                    background-color: #e6f7ff;
                    border: 1px solid #1890ff;
                    border-radius: 5px;
                    padding: 20px;
                    margin: 20px 0;
                }
              </style>
            </head>
            <body>
              <div class="success-box">
                <h2>✓ Account Created Successfully!</h2>
              </div>
              <div class="info-box">
                <h3>Please Verify Your Email</h3>
                <p>We have sent a verification link to <strong>${email}</strong>.</p>
                <p>Please check the server console (simulated email) to get the link and verify your account before logging in.</p>
                <a href="/signin.html">Go to Sign In</a>
              </div>
            </body>
            </html>
          `);
        });
      } catch (hashError) {
        console.error('Password hashing error:', hashError);
        return sendErrorPage(res, 500, 'Error processing password. Please try again.');
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    return sendErrorPage(res, 500, 'An unexpected error occurred. Please try again.');
  }
});

// Email verification route
app.get('/verify-email', (req, res) => {
  const { token } = req.query;

  if (!token) {
    return sendErrorPage(res, 400, 'Invalid verification link.');
  }

  const sql = `SELECT * FROM users WHERE verification_token = ?`;
  db.get(sql, [token], (err, user) => {
    if (err) {
      console.error('Database error verifying email:', err);
      return sendErrorPage(res, 500, 'Error verifying email.');
    }

    if (!user) {
      return sendErrorPage(res, 400, 'Invalid or expired verification link.');
    }

    // Update user as verified and clear token
    const updateSql = `UPDATE users SET is_verified = 1, verification_token = NULL WHERE id = ?`;
    db.run(updateSql, [user.id], (err) => {
      if (err) {
        console.error('Error updating verification status:', err);
        return sendErrorPage(res, 500, 'Error verifying email.');
      }

      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Email Verified</title>
          <meta http-equiv="refresh" content="3;url=/signin.html">
          <style>
            body {
              font-family: Arial, sans-serif;
              max-width: 600px;
              margin: 50px auto;
              padding: 20px;
              text-align: center;
            }
            .success-box {
              background-color: #e6ffe6;
              border: 1px solid #44ff44;
              border-radius: 5px;
              padding: 20px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="success-box">
            <h2>✓ Email Verified Successfully!</h2>
            <p>You can now sign in to your account.</p>
            <p>Redirecting to sign in page...</p>
          </div>
        </body>
        </html>
      `);
    });
  });
});

// Redirect /signin GET requests to signin.html
app.get('/signin', (req, res) => {
  res.redirect('/signin.html');
});

// FIXED: Signin route with better error handling
app.post('/signin', (req, res) => {
  const { username, password } = req.body;

  console.log('Signin attempt:', { username });

  // Validate input
  if (!username || !password) {
    return sendErrorPage(res, 400, 'Username and password are required.');
  }

  const sql = `SELECT * FROM users WHERE username = ?`;
  db.get(sql, [username], async (err, user) => {
    if (err) {
      console.error('Database error during signin:', err.message);
      return sendErrorPage(res, 500, 'Error signing in. Please try again.');
    }

    if (!user) {
      console.log('User not found:', username);
      return sendErrorPage(res, 401, 'Invalid username or password.');
    }

    // Check if email is verified
    if (user.is_verified === 0) {
      return sendErrorPage(res, 403, 'Please verify your email address before signing in.');
    }

    try {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        req.session.userId = user.id;
        req.session.username = user.username;
        
        console.log('Login successful for user:', username);
        
        // Save session before redirecting
        req.session.save((err) => {
          if (err) {
            console.error('Session save error:', err);
            return sendErrorPage(res, 500, 'Error during signin.');
          }
          res.redirect('/profile.html');
        });
      } else {
        console.log('Invalid password for user:', username);
        return sendErrorPage(res, 401, 'Invalid username or password.');
      }
    } catch (error) {
      console.error('Password comparison error:', error);
      return sendErrorPage(res, 500, 'Error during signin.');
    }
  });
});

// FIXED: Profile data route with null check
app.get('/profile-data', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }

  const sql = `SELECT * FROM profiles WHERE user_id = ?`;
  db.get(sql, [req.session.userId], (err, profile) => {
    if (err) {
      console.error('Error fetching profile:', err.message);
      return res.status(500).json({ error: 'Error fetching profile.' });
    }

    // Return empty profile if none exists
    if (!profile) {
      return res.json({
        full_name: '',
        email: '',
        phone: '',
        resume_path: ''
      });
    }

    res.json(profile);
  });
});

// FIXED: Update profile route - doesn't overwrite resume if not uploaded
app.post('/update-profile', upload.single('resume'), (req, res) => {
  if (!req.session.userId) {
    return sendErrorPage(res, 401, 'Not authenticated. Please sign in.');
  }

  const { full_name, email, phone } = req.body;
  
  // Check if existing profile exists
  const sql = `SELECT * FROM profiles WHERE user_id = ?`;
  db.get(sql, [req.session.userId], (err, profile) => {
    if (err) {
      console.error('Error fetching profile:', err.message);
      return sendErrorPage(res, 500, 'Error updating profile.');
    }

    if (profile) {
      // Update existing profile - only update resume if new file uploaded
      let updateSql, params;
      
      if (req.file) {
        updateSql = `UPDATE profiles SET full_name = ?, email = ?, phone = ?, resume_path = ? WHERE user_id = ?`;
        params = [full_name, email, phone, req.file.path, req.session.userId];
      } else {
        // Keep existing resume
        updateSql = `UPDATE profiles SET full_name = ?, email = ?, phone = ? WHERE user_id = ?`;
        params = [full_name, email, phone, req.session.userId];
      }

      db.run(updateSql, params, (err) => {
        if (err) {
          console.error('Error updating profile:', err.message);
          return sendErrorPage(res, 500, 'Error updating profile.');
        }
        res.redirect('/profile.html');
      });
    } else {
      // Create new profile
      const resume_path = req.file ? req.file.path : '';
      const insertSql = `INSERT INTO profiles (user_id, full_name, email, phone, resume_path) VALUES (?, ?, ?, ?, ?)`;
      db.run(insertSql, [req.session.userId, full_name, email, phone, resume_path], (err) => {
        if (err) {
          console.error('Error creating profile:', err.message);
          return sendErrorPage(res, 500, 'Error creating profile.');
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

// FIXED: Logout route with better error handling
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err);
      return res.redirect('/profile.html');
    }
    res.clearCookie('connect.sid');
    res.redirect('/signin.html');
  });
});

// FIXED: Serve profile.html from root directory
app.get('/profile.html', protectedRoute, (req, res) => {
  res.sendFile(path.join(__dirname, 'profile.html'));
});

// Serve successStories.html
app.get('/success-stories-page', (req, res) => {
  res.sendFile(path.join(__dirname, 'successStories.html'));
});

// Get all success stories
app.get('/api/success-stories', (req, res) => {
  const sql = `SELECT * FROM success_stories ORDER BY created_at DESC`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching stories:', err.message);
      return res.status(500).json({ error: 'Error fetching stories' });
    }
    res.json(rows);
  });
});

// Post a success story
app.post('/success-stories', protectedRoute, (req, res) => {
  const { company_name, story } = req.body;
  const user_id = req.session.userId;

  if (!company_name || !story) {
    return res.status(400).json({ error: 'Company name and story are required.' });
  }

  // Get user's full name from profiles to store as student_name
  db.get('SELECT full_name FROM profiles WHERE user_id = ?', [user_id], (err, profile) => {
    if (err) {
      console.error('Error fetching profile:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    // Default to username if profile name is not set
    let student_name = req.session.username;
    if (profile && profile.full_name) {
      student_name = profile.full_name;
    }

    const sql = `INSERT INTO success_stories (user_id, student_name, company_name, story) VALUES (?, ?, ?, ?)`;
    db.run(sql, [user_id, student_name, company_name, story], function(err) {
      if (err) {
        console.error('Error saving story:', err.message);
        return res.status(500).json({ error: 'Error saving story.' });
      }
      res.json({ message: 'Story added successfully', id: this.lastID });
    });
  });
});

// Check authentication status
app.get('/auth-status', (req, res) => {
  res.json({ 
    authenticated: !!req.session.userId,
    username: req.session.username || null
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log('Make sure the "uploads" directory exists!');
});