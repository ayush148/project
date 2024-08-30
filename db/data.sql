CREATE DATABASE IF NOT EXISTS movie_review_db;
USE movie_review_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title VARCHAR(255),
    format VARCHAR(255),
    releaseYear INT,
    releaseMonth INT,
    releaseDate INT,
    review TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
