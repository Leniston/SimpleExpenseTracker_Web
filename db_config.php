<?php
// db_config.php

// Database credentials
define('DB_SERVER', 'localhost');
define('DB_USERNAME', 'root'); // Default XAMPP username
define('DB_PASSWORD', '');     // Default XAMPP password (empty)
define('DB_NAME', 'expense_tracker_db');

// Attempt to connect to MySQL database
$conn = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Set character set to UTF-8 for proper handling of special characters
$conn->set_charset("utf8");

// You can uncomment the line below for debugging purposes to confirm connection
// echo "Connected successfully to the database!";
?>
