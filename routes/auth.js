import express from 'express';
import db from '../database.js';
import bcrypt from 'bcrypt';

const router = express.Router();

// ---------------------- REGISTER ----------------------
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Check duplicate email
  db.query("SELECT id FROM users WHERE email = ?", [email], async (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (rows.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Insert user
    const hash = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    db.query(sql, [name, email, hash], (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });

      res.json({ message: "User registered", userId: result.insertId });
    });
  });
});


// ------------------------ LOGIN ------------------------
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (!results.length)
      return res.status(400).json({ error: "User not found" });

    const user = results[0];

    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(400).json({ error: "Incorrect password" });

    res.json({
      message: "Login successful",
      userId: user.id,
      name: user.name
    });
  });
});

export default router;
