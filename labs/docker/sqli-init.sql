-- Init SQL Script for SQLi Lab Database
CREATE DATABASE IF NOT EXISTS app_db;
USE app_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user'
);

INSERT INTO users (username, password, role) VALUES 
('admin', 'SuperSecretAdminPassword123!', 'admin'),
('john', 'password123', 'user'),
('alice', 'qwerty', 'user'),
('bob', 'letmein1', 'user');
