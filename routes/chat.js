import express from 'express';
import db from '../database.js';
const router = express.Router();

// Send message
router.post('/', (req, res) => {
  const { sender_id, receiver_id, message } = req.body;
  const sql = "INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)";
  db.query(sql, [sender_id, receiver_id, message], err => {
    if(err) return res.status(500).send(err);
    res.send({ message: "Message sent" });
  });
});

// Get chat history between two users
router.get('/:user1/:user2', (req, res) => {
  const { user1, user2 } = req.params;
  const sql = `
    SELECT * FROM messages
    WHERE (sender_id = ? AND receiver_id = ?) 
       OR (sender_id = ? AND receiver_id = ?)
    ORDER BY created_at ASC
  `;
  db.query(sql, [user1, user2, user2, user1], (err, results) => {
    if (err) return res.status(500).send(err);
    res.send(results);
  });
});

export default router;

