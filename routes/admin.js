const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all users
router.get('/users', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, username FROM users');
        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving users' });
    }
});

// Delete a user
router.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM users WHERE id = ?', [id]);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting user' });
    }
});

// Get all reviews
router.get('/reviews', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT reviews.id, reviews.title, reviews.format, reviews.releaseYear, 
                   reviews.releaseMonth, reviews.releaseDate, reviews.review, users.username 
            FROM reviews 
            JOIN users ON reviews.user_id = users.id
        `);
        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving reviews' });
    }
});

// Delete a review
router.delete('/reviews/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM reviews WHERE id = ?', [id]);
        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting review' });
    }
});

module.exports = router;
