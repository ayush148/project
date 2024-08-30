// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db'); // Import database connection

// Register route
router.post('/register', async (req, res) => {
    const { username, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error registering user' });
    }

});



router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        }

        const user = rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: 'Incorrect password' });
        }

        req.session.user = { id: user.id, username: user.username };
        req.session.save(err => {
            if (err) {
                console.error('Session save error:', err);
                return res.status(500).json({ message: 'Error saving session' });
            }
            console.log('Session after save:', req.session); // Debug log
            res.status(200).json({ message: 'Login successful' });
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Error logging in', error: err.message });
    }
});

router.get('/check', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

module.exports = router;


// Logout route
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Error logging out' });
        }
        res.status(200).json({ message: 'Logout successful' });
    });
});


module.exports = router;
