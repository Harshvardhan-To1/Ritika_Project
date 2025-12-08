const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('./database.js');
const bcrypt = require('bcrypt');
const session = require('express-session');
require('dotenv').config();
const Groq = require('groq-sdk');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const app = express();
const port = 3000;

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail', // or 'outlook', 'yahoo', etc.
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASSWORD // Your email password or app password
  }
});

// Verify email configuration on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('Email configuration error:', error);
    console.log('Email sending will not work. Please check your .env file.');
  } else {
    console.log('Email server is ready to send messages');
  }
});

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

// Helper function to generate 6-digit verification code
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Helper function to send verification email
async function sendVerificationEmail(email, code, username) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify Your Email - Placement Portal',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .code-box { background: white; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
          .code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✉️ Email Verification</h1>
          </div>
          <div class="content">
            <h2>Hello ${username}!</h2>
            <p>Thank you for signing up for the Placement Portal. Please use the verification code below to complete your registration:</p>
            <div class="code-box">
              <div class="code">${code}</div>
            </div>
            <p>This code will expire in <strong>10 minutes</strong>.</p>
            <p>If you didn't create an account with us, please ignore this email.</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p><strong>Need help?</strong> Contact our support team.</p>
            </div>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
            <p>&copy; 2024 Placement Portal. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent to:', email);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
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

// Original non-streaming chatbot route (kept for backward compatibility)
app.post('/chatbot', async (req, res) => {
  const userMessage = req.body.message;
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful career assistant for Placemate, a placement portal. Help students with interview preparation, resume tips, career guidance, and placement-related queries. Be concise, friendly, and professional."
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024
    });
    const text = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    res.json({ response: text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ response: 'Error generating response from AI.' });
  }
});

// NEW: Streaming chatbot route using Server-Sent Events (SSE) with Groq
app.post('/chatbot/stream', async (req, res) => {
  const userMessage = req.body.message;
  
  // Set headers for Server-Sent Events
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Disable buffering for nginx
  
  try {
    // Use Groq streaming
    const stream = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful career assistant for Placemate, a placement portal. Help students with interview preparation, resume tips, career guidance, and placement-related queries. Be concise, friendly, and professional."
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
      stream: true
    });
    
    // Stream each chunk as it arrives
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        // Send the chunk as an SSE event
        res.write(`data: ${JSON.stringify({ text: content })}\n\n`);
      }
    }
    
    // Send completion signal
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
    
  } catch (error) {
    console.error('Streaming error:', error);
    res.write(`data: ${JSON.stringify({ error: 'Error generating response from AI.' })}\n\n`);
    res.end();
  }
});

// Redirect /signup GET requests to signup.html
app.get('/signup', (req, res) => {
  res.redirect('/signup.html');
});

// UPDATED: Signup route with verification code
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

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return sendErrorPage(res, 400, 'Please provide a valid email address.');
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
        const verificationCode = generateVerificationCode();
        const codeExpiry = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

        const insertSql = `INSERT INTO users (username, password, email, verification_code, code_expiry, is_verified) VALUES (?, ?, ?, ?, ?, 0)`;
        
        db.run(insertSql, [username, hashedPassword, email, verificationCode, codeExpiry], async function(err) {
          if (err) {
            console.error('Error creating user:', err.message);
            return sendErrorPage(res, 500, 'Error creating user. Please try again.');
          }
          
          console.log('User created with ID:', this.lastID);
          
          // Send verification email
          const emailSent = await sendVerificationEmail(email, verificationCode, username);
          
          if (!emailSent) {
            console.error('Failed to send verification email');
            // Still allow signup but show warning
          }

          // Store user info in session for verification page
          req.session.pendingUserId = this.lastID;
          req.session.pendingUsername = username;
          req.session.pendingEmail = email;
          
          // Create empty profile for new user
          const profileSql = `INSERT INTO profiles (user_id, full_name, email, phone, resume_path) VALUES (?, '', ?, '', '')`;
          db.run(profileSql, [this.lastID, email], (profileErr) => {
            if (profileErr) {
              console.error('Error creating profile:', profileErr.message);
            } else {
              console.log('Profile created for user:', this.lastID);
            }
          });

          // Save session and redirect to verification page
          req.session.save((err) => {
            if (err) {
              console.error('Session save error:', err);
              return sendErrorPage(res, 500, 'Error during signup.');
            }
            res.redirect('/verify-email.html');
          });
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

// NEW: Email verification page
app.get('/verify-email.html', (req, res) => {
  if (!req.session.pendingUserId) {
    return res.redirect('/signup.html');
  }
  res.sendFile(path.join(__dirname, 'verify-email.html'));
});

// NEW: Get verification session info
app.get('/verification-info', (req, res) => {
  if (!req.session.pendingUserId) {
    return res.status(400).json({ error: 'No pending verification' });
  }
  res.json({
    email: req.session.pendingEmail,
    username: req.session.pendingUsername
  });
});

// NEW: Verify code endpoint
app.post('/verify-code', (req, res) => {
  const { code } = req.body;
  
  if (!req.session.pendingUserId) {
    return res.status(400).json({ success: false, message: 'No pending verification found. Please sign up again.' });
  }

  const sql = `SELECT * FROM users WHERE id = ?`;
  db.get(sql, [req.session.pendingUserId], (err, user) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ success: false, message: 'Database error.' });
    }

    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found.' });
    }

    // Check if code has expired
    const now = new Date();
    const expiry = new Date(user.code_expiry);
    
    if (now > expiry) {
      return res.status(400).json({ success: false, message: 'Verification code has expired. Please request a new one.' });
    }

    // Check if code matches
    if (user.verification_code !== code) {
      return res.status(400).json({ success: false, message: 'Invalid verification code. Please try again.' });
    }

    // Update user as verified
    const updateSql = `UPDATE users SET is_verified = 1, verification_code = NULL, code_expiry = NULL WHERE id = ?`;
    db.run(updateSql, [user.id], (err) => {
      if (err) {
        console.error('Error updating verification status:', err);
        return res.status(500).json({ success: false, message: 'Error verifying code.' });
      }

      // Clear pending session data
      delete req.session.pendingUserId;
      delete req.session.pendingUsername;
      delete req.session.pendingEmail;

      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err);
        }
        res.json({ success: true, message: 'Email verified successfully!' });
      });
    });
  });
});

// NEW: Resend verification code
app.post('/resend-code', async (req, res) => {
  if (!req.session.pendingUserId) {
    return res.status(400).json({ success: false, message: 'No pending verification found.' });
  }

  const sql = `SELECT * FROM users WHERE id = ?`;
  db.get(sql, [req.session.pendingUserId], async (err, user) => {
    if (err || !user) {
      return res.status(500).json({ success: false, message: 'Error fetching user data.' });
    }

    // Generate new code
    const newCode = generateVerificationCode();
    const newExpiry = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Update database
    const updateSql = `UPDATE users SET verification_code = ?, code_expiry = ? WHERE id = ?`;
    db.run(updateSql, [newCode, newExpiry, user.id], async (err) => {
      if (err) {
        console.error('Error updating verification code:', err);
        return res.status(500).json({ success: false, message: 'Error generating new code.' });
      }

      // Send new email
      const emailSent = await sendVerificationEmail(user.email, newCode, user.username);
      
      if (emailSent) {
        res.json({ success: true, message: 'New verification code sent to your email.' });
      } else {
        res.status(500).json({ success: false, message: 'Error sending email. Please try again.' });
      }
    });
  });
});

// Redirect /signin GET requests to signin.html
app.get('/signin', (req, res) => {
  res.redirect('/signin.html');
});

// UPDATED: Signin route with verification check
app.post('/signin', (req, res) => {
  const { username, password } = req.body;
  console.log('Signin attempt:', { username });

  // Validate input
  if (!username || !password) {
    return sendErrorPage(res, 400, 'Username and password are required.');
  }

  const sql = `SELECT * FROM users WHERE username = ? OR email = ?`;
  db.get(sql, [username, username], async (err, user) => {
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
      // Store user info in session and redirect to verification
      req.session.pendingUserId = user.id;
      req.session.pendingUsername = user.username;
      req.session.pendingEmail = user.email;
      
      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err);
        }
        return res.redirect('/verify-email.html?message=Please verify your email before signing in.');
      });
      return;
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

// Profile data route
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

// Update profile route
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

// Logout route
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

// Serve profile.html from root directory
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