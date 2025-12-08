# PROJECT REPORT
**On**

## **Placement and Internship Management Portal**

**Submitted in partial fulfillment of the requirements for the degree of**
**[Your Degree Name]**

**By**
**[Your Name]**
**[Your Roll No]**

**Under the Guidance of**
**[Guide Name]**

---

## **DECLARATION**

I hereby declare that the project entitled **“Placement and Internship Management Portal”** submitted by me in partial fulfillment of the requirements for the award of the degree of **[Your Degree]** is a record of original work carried out by me under the supervision of **[Guide Name]**. The matter embodied in this report has not been submitted to any other University or Institution for the award of any degree or diploma.

**(Signature of Student)**
**[Your Name]**
**Date:**

---

## **CERTIFICATE FROM GUIDE**

This is to certify that the project entitled **“Placement and Internship Management Portal”** is a bona fide work carried out by **[Your Name]** under my supervision and guidance. The project has reached the standard of fulfilling the requirements and the regulations relating to the degree.

**(Signature of Guide)**
**[Guide Name]**
**[Designation]**
**Date:**

---

## **CERTIFICATE FROM COMPANY/ORGANIZATION**

*(If applicable, insert certificate text here or leave blank)*

---

## **APPROVAL CERTIFICATE**

The project entitled **“Placement and Internship Management Portal”** submitted by **[Your Name]** is hereby approved as a creditable study of an engineering subject carried out and presented in a manner satisfactory to warrant its acceptance as a prerequisite for the degree for which it has been submitted.

**(Examiner 1)**                                                  **(Examiner 2)**

---

## **ACKNOWLEDGEMENT**

I would like to express my deep sense of gratitude to my guide **[Guide Name]** for their valuable guidance and constant encouragement throughout the development of this project.
I am also thankful to the **[Department Name]** for providing the necessary infrastructure and resources.
Finally, I thank my parents and friends for their support.

**[Your Name]**

---

## **TABLE OF CONTENTS**

1.  **INTRODUCTION**
    *   1.1 Background
    *   1.2 Purpose of the Project
    *   1.3 Project Scope
    *   1.4 Project Objectives
2.  **PROJECT PLANNING AND SCHEDULING**
    *   2.1 Project Plan
    *   2.2 Work Breakdown Structure
    *   2.3 Gantt Chart
    *   2.4 PERT Chart/ CPM
    *   2.5 Team Structure and Responsibilities
    *   2.6 Project Development Methodology
    *   2.7 Hardware and Software Requirements
3.  **SYSTEM ANALYSIS**
    *   3.1 Problem Description
    *   3.2 Requirements
    *   3.3 Analysis Diagrams
    *   3.4 Database Schema
4.  **SYSTEM DESIGN**
    *   4.1 System Architecture
    *   4.2 Physical Design
    *   4.3 Input and Output Design
    *   4.4 Algorithmic Design
5.  **IMPLEMENTATION**
    *   5.1 Source Code
    *   5.2 Integration of Modules/Files
    *   5.3 Screenshots
6.  **SYSTEM TESTING**
    *   6.1 Test Case Design
    *   6.2 Specific System Testing
    *   6.3 Test Reports
7.  **CONCLUSION OF THE PROJECT**
    *   7.1 Results
    *   7.2 Conclusion
    *   7.3 Limitations
    *   7.4 Future Work
    *   7.5 Lessons Learned
*   **REFERENCES**

---

## **ABSTRACT**

The **Placement and Internship Management Portal** is a comprehensive web-based application designed to bridge the gap between students and the placement cell of the institution. In the current educational landscape, managing student resumes, job applications, and placement records manually is labor-intensive and prone to errors. This project provides a digital solution to streamline these processes.

The proposed system allows students to register, manage their professional profiles, upload resumes, and view successful placement stories from seniors. A unique feature of this system is the integration of an AI-powered chatbot (using Google Gemini API) to assist students with immediate queries regarding placements. The backend is built using **Node.js** and **Express.js**, ensuring a robust and scalable architecture, while **SQLite** is used for efficient data management. Key features include secure user authentication with email verification, dynamic profile management, and an interactive user interface. This application aims to enhance the efficiency of the placement department and provide a seamless experience for students.

---

# **CHAPTER 1: INTRODUCTION**

## **1.1 Background**
Placement and training are integral parts of any educational institution. Traditionally, the management of placement activities involves manual collection of student data, maintaining physical files for resumes, and communicating via notice boards or bulk emails. This "manual system" often results in data redundancy, loss of information, and delayed communication. Students often miss out on opportunities due to a lack of centralized information, and administrators struggle to filter candidates based on criteria efficiently.

## **1.2 Purpose of the Project**
The primary purpose of this project is to develop a centralized web portal that automates the core functions of the placement cell. It serves as a platform where:
*   Students can showcase their skills and academic records.
*   The system manages data securely and efficiently.
*   Communication is streamlined through digital channels and AI assistance.

## **1.3 Project Scope**
The scope of the **Placement and Internship Management Portal** includes:
*   **User Management:** Secure registration and login for students.
*   **Profile Management:** Facilities for students to update their personal details and upload resumes.
*   **Information Dissemination:** Displaying success stories and placement drives.
*   **AI Assistance:** An intelligent chatbot to answer student queries 24/7.
*   **Data Security:** Implementation of password hashing and session management.

## **1.4 Project Objectives**
1.  **To Digitalize Data:** Convert manual student records into a structured database format.
2.  **To Enhance Accessibility:** Ensure information about drives and success stories is available to students anytime.
3.  **To Provide Instant Support:** Implement an AI chatbot to handle FAQs, reducing the burden on staff.
4.  **To Ensure Security:** Implement robust authentication mechanisms including Email Verification and Password Encryption.

---

# **CHAPTER 2: PROJECT PLANNING AND SCHEDULING**

## **2.1 Project Plan**
The project was planned in four major phases:
1.  **Requirement Gathering:** Understanding the needs of the placement cell and students.
2.  **Design:** Creating the database schema and UI wireframes.
3.  **Development:** Coding the backend logic and frontend interfaces.
4.  **Testing & Deployment:** Verifying features and fixing bugs.

## **2.2 Work Breakdown Structure (WBS)**
*   **1. Project Initiation**
    *   Define Scope
    *   Select Tools
*   **2. Database Design**
    *   Design Tables (Users, Profiles, etc.)
    *   Implement SQLite Schema
*   **3. Backend Development**
    *   Setup Express Server
    *   Implement Auth API
    *   Implement Profile API
    *   Integrate Gemini AI
*   **4. Frontend Development**
    *   Design HTML Pages
    *   Style with CSS
    *   Connect to Backend via Fetch API
*   **5. Testing**
    *   Unit Testing
    *   Integration Testing

## **2.3 Gantt Chart**
*(Description for Diagram creation)*
To create the Gantt Chart:
*   **Y-Axis:** List the tasks (Requirements, Design, Coding, Testing).
*   **X-Axis:** Time (Weeks 1-4).
*   **Bars:**
    *   Week 1: Requirements & Database Design.
    *   Week 2: Backend Development (Auth, APIs).
    *   Week 3: Frontend Development & Integration.
    *   Week 4: Testing & Documentation.

## **2.4 PERT Chart / CPM**
*(Description for Diagram creation)*
Create a network diagram with nodes representing events:
*   Start -> Requirements Analysis -> System Design -> Coding -> Testing -> End.
*   Show "Critical Path" as the longest path (Design -> Coding -> Testing) which determines the project duration.

## **2.5 Team Structure and Responsibilities**
*   **Developer:** Responsible for full-stack development (Node.js, HTML/CSS).
*   **Tester:** Responsible for verifying email flows, file uploads, and database integrity.
*   **Guide:** Provides supervision and requirement clarification.

## **2.6 Project Development Methodology**
The **Agile Methodology** was adopted for this project. This allowed for:
*   **Iterative Development:** Features were built and tested in small cycles (sprints).
*   **Flexibility:** Changes in requirements (e.g., adding email verification) were accommodated easily during development.
*   **Continuous Feedback:** Regular testing ensured bugs were caught early.

## **2.7 Hardware and Software Requirements**
**Hardware:**
*   **Processor:** Intel Core i3 or higher / AMD equivalent.
*   **RAM:** 4GB or higher.
*   **Storage:** 256GB SSD/HDD.
*   **Internet Connection:** Required for installing packages and Gemini AI API calls.

**Software:**
*   **Operating System:** Windows 10/11, Linux, or macOS.
*   **Runtime Environment:** Node.js (v14+).
*   **Code Editor:** Visual Studio Code.
*   **Database:** SQLite3.
*   **Version Control:** Git.
*   **Browser:** Google Chrome / Mozilla Firefox.

---

# **CHAPTER 3: SYSTEM ANALYSIS**

## **3.1 Problem Description**
### **3.1.1 Problem Definition**
The existing manual system makes it difficult to track student eligibility, collect resumes in a standardized format, and share success stories effectively. Students often lack immediate answers to common queries when staff are unavailable.

### **3.1.2 Proposed Solution**
The proposed "Placement and Internship Management Portal" solves these issues by automating data collection, providing a central repository for success stories, and utilizing AI for instant query resolution.

## **3.2 Requirements**
### **3.2.1 Functional Requirements**
1.  **User Authentication:** Users must be able to sign up, verify their email via OTP, and log in securely.
2.  **Profile Management:** Users can update contact info and upload resumes (PDF/Doc).
3.  **Success Stories:** Users can read stories from seniors and post their own.
4.  **Drive Application:** Users can view companies and click to apply.
5.  **AI Chatbot:** Users can chat with an AI bot for placement advice.

### **3.2.2 Non-Functional Requirements**
1.  **Performance:** The system should respond to requests within 2 seconds.
2.  **Reliability:** The database should ensure data consistency (ACID properties).
3.  **Security:** Passwords must be hashed (Bcrypt). Sessions must be secure.
4.  **Scalability:** The architecture should support adding more features easily.

## **3.3 Analysis Diagrams**

### **3.3.1 Data Flow Diagram (DFD)**
*(Description for Diagram creation)*
**Level 0 DFD:**
*   **Circle:** System (Placement Portal).
*   **External Entity:** Student.
*   **Flows:**
    *   Student -> (Login/Details) -> System.
    *   System -> (Profile/Stories/Response) -> Student.

**Level 1 DFD:**
*   Break down "System" into processes: "Auth Process", "Profile Manager", "Chatbot Service".
*   Data Store: "User DB", "Stories DB".

### **3.3.2 Use Case Diagram**
*(Description for Diagram creation)*
*   **Actor:** Student.
*   **Use Cases (Ovals):**
    *   Register (Include "Verify Email").
    *   Login.
    *   Upload Resume.
    *   View Success Stories.
    *   Chat with AI.
    *   Apply for Drive.
*   **Relationships:** Student connects to all these Use Cases. "Verify Email" extends "Register".

## **3.4 Database Schema**
The system uses a Relational Database (SQLite). Key tables:

1.  **Table: `users`**
    *   `id` (PK, Integer, Auto-increment)
    *   `username` (Text)
    *   `email` (Text)
    *   `password` (Text, Hashed)
    *   `is_verified` (Integer)
    *   `verification_code` (Text)

2.  **Table: `profiles`**
    *   `id` (PK)
    *   `user_id` (FK to users)
    *   `full_name` (Text)
    *   `phone` (Text)
    *   `resume_path` (Text)

3.  **Table: `success_stories`**
    *   `id` (PK)
    *   `user_id` (FK)
    *   `company_name` (Text)
    *   `story` (Text)

---

# **CHAPTER 4: SYSTEM DESIGN**

## **4.1 System Architecture**
The system follows a **Model-View-Controller (MVC)** inspired architecture:
*   **Model:** `database.js` defines the data structure and interaction with SQLite.
*   **View:** HTML/CSS files (`index.html`, `profile.html`) serve as the frontend interface.
*   **Controller:** `server.js` handles HTTP requests, processes logic (like calling Gemini API or hashing passwords), and sends responses.

## **4.2 Physical Design**

### **4.2.1 Structure Chart**
*(Description)*
*   Root Node: Main System
*   Children: Auth Module, Profile Module, Story Module, AI Module.
*   Auth Module -> Login, Signup, Verify.

### **4.2.2 Entity-Relationship (ER) Diagram**
*(Description for Diagram creation)*
*   **Entity: User** (Attributes: ID, Name, Email, Password)
*   **Entity: Profile** (Attributes: ID, Resume, Phone)
*   **Entity: SuccessStory** (Attributes: ID, Company, Story)
*   **Relationships:**
    *   User **1 --- 1** Profile (One-to-One).
    *   User **1 --- N** SuccessStory (One-to-Many).

### **4.2.3 Class Diagram**
*(Description for Diagram creation)*
*   Since this is not a strict OOP application (JS/Functional), classes represent Modules.
*   **Class: Server** (Methods: `start()`, `handleRequests()`)
*   **Class: Database** (Methods: `run()`, `get()`, `all()`)
*   **Class: User** (Properties: `username`, `email`)

## **4.3 Input and Output Design**
*   **Input Design:** Forms are designed with validation. E.g., The Signup form checks for email format and password length. Resume upload accepts file inputs.
*   **Output Design:**
    *   **Profile Page:** Displays user details in a card layout.
    *   **Success Stories:** Displayed as a grid of cards with company names and testimonials.
    *   **Chatbot:** Chat bubble interface for conversation.

## **4.4 Algorithmic Design**
**Algorithm: User Signup & Verification**
1.  Start
2.  Receive Username, Email, Password.
3.  Validate inputs.
4.  Check if User exists in DB.
    *   If Yes -> Return Error.
5.  Hash Password.
6.  Generate Random 6-digit Code.
7.  Insert User into DB (is_verified = 0).
8.  Send Email with Code.
9.  Redirect to Verification Page.
10. Stop.

---

# **CHAPTER 5: IMPLEMENTATION**

## **5.1 Source Code**
*(Abstracted Module Code)*

**Database Connection (database.js):**
```javascript
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./placements.db', ...);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (...)`);
  // ... other tables
});
module.exports = db;
```

**Server Route - Chatbot (server.js):**
```javascript
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chatbot', async (req, res) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp"});
  const result = await model.generateContent(req.body.message);
  res.json({ response: result.response.text() });
});
```

## **5.2 Integration of Modules**
The `server.js` file acts as the central hub.
1.  **Frontend Integration:** `app.use(express.static(__dirname))` serves the HTML/CSS/JS files to the client.
2.  **Database Integration:** `const db = require('./database.js')` allows the server to query the SQLite database.
3.  **External API:** The Google Gemini API is integrated using the `@google/generative-ai` library for the chatbot feature.

## **5.3 Screenshots**
*(Placeholders for the report)*
*   [Figure 5.1: Home Page]
*   [Figure 5.2: Signup Page]
*   [Figure 5.3: Profile Dashboard]
*   [Figure 5.4: Chatbot Interface]

---

# **CHAPTER 6: SYSTEM TESTING**

## **6.1 Test Case Design**

### **6.1.1 Unit Testing**
*   **Test:** Generate Verification Code.
    *   **Input:** Call function.
    *   **Expected:** Returns 6 digit string.
    *   **Status:** Pass.
*   **Test:** Password Hashing.
    *   **Input:** "password123".
    *   **Expected:** Encrypted string.
    *   **Status:** Pass.

### **6.1.2 Integration Testing**
*   **Test:** Signup Flow.
    *   **Action:** Submit Signup Form -> Check DB for new user -> Check Email for code.
    *   **Status:** Pass.

## **6.2 Specific System Testing**
*   **Usability Testing:** The interface was tested for responsiveness. The "Service Card" layout ensures it looks good on different screen sizes.
*   **Security Testing:** Attempted SQL Injection (prevented by parameterized queries in `db.run`). Attempted direct access to `/profile.html` without login (prevented by middleware).

## **6.3 Test Reports**
All critical modules (Auth, Upload, Chat) function as expected. Edge cases like "Duplicate Email" or "Invalid File Type" are handled with error messages.

---

# **CHAPTER 7: CONCLUSION OF THE PROJECT**

## **7.1 Results**
The project successfully delivered a functional Placement Portal. Students can create accounts, verify emails, manage profiles, and interact with the AI assistant. The system effectively manages data using SQLite.

## **7.2 Conclusion**
The "Placement and Internship Management Portal" fulfills the objective of modernizing the placement process. By integrating features like Resume Uploads and AI Chatbots, it provides a superior experience compared to the manual system. The project demonstrates the power of the Node.js ecosystem in building rapid, scalable web applications.

## **7.3 Limitations of the project**
*   The current deployment is local (localhost).
*   Limited admin features (no dedicated admin dashboard to manage users).
*   Chatbot context is limited to single interactions (no long-term memory of conversation).

## **7.4 Future Work**
*   Deploying the application to a cloud server (AWS/Heroku).
*   Adding a Resume Builder tool.
*   Implementing an Admin Dashboard for approval of stories and drives.
*   Adding real-time notifications via WebSockets.

## **7.5 Lessons Learned**
*   Importance of asynchronous programming in Node.js.
*   Handling file uploads securely with Multer.
*   Integrating third-party APIs (Google Gemini).
*   Managing state with Sessions.

---

# **REFERENCES**
1.  Node.js Documentation. https://nodejs.org/en/docs/
2.  Express.js Guide. https://expressjs.com/
3.  SQLite3 NPM Documentation. https://www.npmjs.com/package/sqlite3
4.  Google AI Studio (Gemini API). https://ai.google.dev/
5.  MDN Web Docs (HTML/CSS/JS). https://developer.mozilla.org/

---

# **APPENDICES**
*   **A:** Code Repository Link (GitHub)
*   **B:** User Manual / Installation Instructions
