const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

// Serve static files from the root directory
app.use(express.static(__dirname));

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

// Chatbot route
app.use(express.json());
app.post('/chatbot', (req, res) => {
  const userMessage = req.body.message;
  let botResponse = "I'm sorry, I don't understand. Please ask me about placements, internships, or resumes.";

  if (userMessage.includes('hello') || userMessage.includes('hi')) {
    botResponse = 'Hello! How can I help you today?';
  } else if (userMessage.includes('placements') || userMessage.includes('internships')) {
    botResponse = 'You can find all the latest placement and internship drives on the "Apply for Drive" page.';
  } else if (userMessage.includes('resume')) {
    botResponse = 'You can upload your resume on the "Upload Resume" page.';
  }

  res.json({ response: botResponse });
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
