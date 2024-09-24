// CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY,username VARCHAR(50) NOT NULL UNIQUE,password VARCHAR(255) NOT NULL);

// CREATE TABLE movie_reviews (id INT AUTO_INCREMENT PRIMARY KEY,movie_name VARCHAR(100) NOT NULL,movie_release_date DATE NOT NULL,review TEXT NOT NULL);

// DELETE FROM movie_reviews WHERE id = 2;


const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();
const path = require('path');
require('dotenv').config();

app.use(cors());
app.use(express.json());


// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


// MySQL Connection
const db = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
});

db.connect((err) => {
    if (err) {
        console.error('Database connection error:', err);
        return;
    }
    console.log('Successfully Connected to MySQL database');
});

// Register API
app.post('/register', async (req, res) => {
    const { username, password } = req.body;


    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).send('Username already exists');
                }
                return res.status(500).send('Error registering user');
            }

            res.status(201).send('User registered successfully');
        });
    } catch (error) {
        res.status(500).send('Server error');
    }
});


// Get all usernames API
app.get('/users', (req, res) => {
    db.query('SELECT username FROM users', (err, results) => {
        if (err) {
            return res.status(500).send('Error fetching users');
        }

        const usernames = results.map(user => user.username);
        res.status(200).json(usernames);
    });
});

// Login API
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).send('Error logging in');
        }

        if (results.length === 0) {
            return res.status(400).send('Invalid username or password');
        }

        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(400).send('Invalid username or password');
        }

        res.status(200).send('Login successful');
    });
});



// Add Movie Review API
app.post('/movie/review', (req, res) => {
    const { movie_name, movie_release_date, review } = req.body;


    // Insert review into the database
    db.query('INSERT INTO movie_reviews (movie_name, movie_release_date, review) VALUES (?, ?, ?)', 
    [movie_name, movie_release_date, review], 
    (err, result) => {
        if (err) {
            return res.status(500).send('Error adding review');
        }

        res.status(201).send('Review added successfully');
    });
});


// Get All Movie Reviews API
app.get('/movie/reviews', (req, res) => {
    db.query('SELECT * FROM movie_reviews', (err, results) => {
        if (err) {
            return res.status(500).send('Error fetching reviews');
        }

        // Format the date for each review
        const formattedResults = results.map(review => ({
            ...review,
            movie_release_date: formatDate(review.movie_release_date)
        }));

        res.status(200).json(formattedResults);
    });
});

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() returns 0-11
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}


// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
