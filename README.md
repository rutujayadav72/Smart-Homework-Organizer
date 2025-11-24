## 🧠 Smart Homework Organizer — Project Story

### 📌 Inspiration
Managing homework, deadlines, and class communication is a challenge for students. The idea behind **Smart Homework Organizer (SHO)** was to create an all-in-one digital helper that allows students to track assignments, stay organized, and communicate with classmates—all from a simple dashboard.

### 🛠️ How I Built It
This project includes both a backend and a frontend.

**Backend**
- Node.js + Express
- MySQL database
- REST APIs for assignments, users, and chat

**Frontend**
- HTML, CSS, Vanilla JavaScript
- Clean and simple UI

**Major Features**
- 📅 Assignment Dashboard  
- 🔔 Smart Deadline Reminders  
- 🗂️ Calendar View  
- 👤 User Profiles  
- 👥 Classmates Management  
- 💬 Live Chat (in progress)

### 📚 What I Learned
- Designing REST APIs using Express  
- Structuring relational data with MySQL  
- Real-time communication using Socket.IO  
- Creating multi-page dashboards with Vanilla JS  
- Handling user state and UI updates  

### 🚧 Challenges
- Smooth backend–frontend communication  
- Managing user-specific secure data  
- Building scalable chat architecture  
- Debugging Socket.IO connection issues  
- Maintaining UI state without frameworks  

### ⚠️ Important Note
The **live chat feature is not fully completed** and is **still in progress**.

### 🏗️ Built With
- Node.js  
- Express.js  
- MySQL  
- Socket.IO  
- HTML5  
- CSS3  
- JavaScript (Vanilla)

---
```sql

CREATE DATABASE homework_app;

USE homework_app;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255)
);

CREATE TABLE assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  title VARCHAR(255),
  subject VARCHAR(100),
  due_date DATETIME,
  notes TEXT,
  status ENUM('pending','completed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE connections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  classmate_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (classmate_id) REFERENCES users(id)
);

CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender_id INT,
  receiver_id INT,
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (receiver_id) REFERENCES users(id)
);
```
---
### 3. Set Up Environment Variables

```dotenv.

MYSQL_HOST=your host
MYSQL_USER= your username
MYSQL_PASSWORD=Your password
MYSQL_DB=homework_app
PORT=your port


```