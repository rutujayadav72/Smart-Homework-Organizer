import express from 'express';
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './database.js';

dotenv.config();

// Routes
import assignmentRoutes from './routes/assignments.js';
import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';
import userRoutes from './routes/users.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(bodyParser.json());

// Static files
app.use(express.static(path.join(__dirname, "public")));

// API routes
app.use('/api', authRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/users', userRoutes);

// Online users map
const onlineUsers = new Map();   

io.on('connection', socket => {
  console.log("User connected:", socket.id);

  socket.on("join", ({ userId }) => {
    onlineUsers.set(userId, socket.id);
    io.emit("update_online", Array.from(onlineUsers.keys()));
  });

  socket.on("private_message", ({ senderId, receiverId, message }) => {
    // Save message in DB
    db.query(
      "INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)",
      [senderId, receiverId, message],
      err => { if (err) console.error(err); }
    );

    const messageData = { senderId, receiverId, message };

    socket.emit("new_message", messageData);

    const receiverSocket = onlineUsers.get(receiverId);
    if (receiverSocket) io.to(receiverSocket).emit("new_message", messageData);
  });

  socket.on("disconnect", () => {
    for (let [userId, sId] of onlineUsers.entries()) {
      if (sId === socket.id) {
        onlineUsers.delete(userId);
        io.emit("update_online", Array.from(onlineUsers.keys()));
        break;
      }
    }
  });
});

// Use server.listen() for Socket.IO
server.listen(3000, () =>
  console.log("🔥 Server & Socket.IO running on http://localhost:3000")
);
