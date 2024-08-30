// routes/review.js
const express = require('express');
const router = express.Router();
const db = require('../db'); // Import database connection

// Add review route
router.post('/add', async (req, res) => {
    console.log('Session on review add:', req.session); // Debug log to check session
    const { title, format, releaseYear, releaseMonth, releaseDate, review } = req.body;

    if (!req.session.user) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    const userId = req.session.user.id;
    try {
        await db.execute(
            'INSERT INTO reviews (user_id, title, format, releaseYear, releaseMonth, releaseDate, review) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, title, format, releaseYear, releaseMonth, releaseDate, review]
        );
        res.status(201).json({ message: 'Review added successfully' });
    } catch (err) {
        console.error('Error adding review:', err);
        res.status(500).json({ message: 'Error adding review', error: err.message });
    }
});



// Get all reviews route
router.get('/all', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT reviews.*, users.username FROM reviews JOIN users ON reviews.user_id = users.id');
        res.status(200).json(rows);
    } catch (err) {
        console.error('Error fetching reviews:', err);
        res.status(500).json({ message: 'Error fetching reviews', error: err.message });
    }
});
module.exports = router;
