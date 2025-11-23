import express from 'express';
import db from '../database.js';
const router = express.Router();

// GET assignments for a user
router.get('/:userId', (req, res) => {
    const sql = "SELECT * FROM assignments WHERE user_id = ? ORDER BY due_date ASC";
    db.query(sql, [req.params.userId], (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

// POST new assignment
router.post('/', (req, res) => {
    const { user_id, title, subject, due_date, notes } = req.body;
    const sql = "INSERT INTO assignments (user_id, title, subject, due_date, notes) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [user_id, title, subject, due_date, notes], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ message: "Assignment added!", id: result.insertId });
    });
});

// UPDATE status
router.put('/:id', (req, res) => {
    const { status } = req.body;
    const sql = "UPDATE assignments SET status = ? WHERE id = ?";
    db.query(sql, [status, req.params.id], err => {
        if (err) return res.status(500).send(err);
        res.send({ message: "Updated!" });
    });
});

// DELETE
router.delete('/:id', (req, res) => {
    const sql = "DELETE FROM assignments WHERE id = ?";
    db.query(sql, [req.params.id], err => {
        if (err) return res.status(500).send(err);
        res.send({ message: "Deleted!" });
    });
});

export default router;
