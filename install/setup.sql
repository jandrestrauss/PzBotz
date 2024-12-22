CREATE DATABASE IF NOT EXISTS pzbot_db;
USE pzbot_db;

CREATE USER IF NOT EXISTS 'pzbot'@'localhost' IDENTIFIED BY 'your_password_here';
GRANT ALL PRIVILEGES ON pzbot_db.* TO 'pzbot'@'localhost';
FLUSH PRIVILEGES;

-- Create migrations table if it doesn't exist
CREATE TABLE IF NOT EXISTS migrations (
    version INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
