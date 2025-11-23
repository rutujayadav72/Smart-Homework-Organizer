
import express from 'express';
import db from '../database.js';
const router = express.Router();

// Get classmates for current user
// Get classmates for current user (all users except current)
router.get('/classmates', (req, res) => {
  const userId = req.query.userId;
  const sql = `
    SELECT id, name 
    FROM users
    WHERE id != ?
  `;
  db.query(sql, [userId], (err, results) => {
    if(err) return res.status(500).send(err);
    res.send(results);
  });
});

// Get single user
router.get('/:id', (req, res) => {
  const sql = "SELECT id, name, email FROM users WHERE id = ?";
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).send(err);
    if (!results.length) return res.status(404).send({ error: "User not found" });
    res.send(results[0]);
  });
});

export default router;
