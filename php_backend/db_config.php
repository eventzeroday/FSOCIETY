<?php
// db_config.php

$host = 'localhost';
$dbname = 'wefarm_db';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // If database doesn't exist, try to create it
    if ($e->getCode() == 1049) {
        try {
            $pdo = new PDO("mysql:host=$host", $username, $password);
            $pdo->exec("CREATE DATABASE IF NOT EXISTS $dbname");
            $pdo->exec("USE $dbname");
            
            // Create Users Table
            $pdo->exec("CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )");

            // Create Diagnosis History Table
            $pdo->exec("CREATE TABLE IF NOT EXISTS diagnoses (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                crop VARCHAR(50),
                symptoms TEXT,
                disease VARCHAR(100),
                risk VARCHAR(20),
                confidence FLOAT,
                date VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )");
            
        } catch (PDOException $ex) {
            die(json_encode(["error" => "Database creation failed: " . $ex->getMessage()]));
        }
    } else {
        die(json_encode(["error" => "Connection failed: " . $e->getMessage()]));
    }
}
?>
