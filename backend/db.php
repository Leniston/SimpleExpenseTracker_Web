<?php
$host = 'localhost';
$db = 'expense_tracker';
$user = 'root';
$pass = ''; // Set your MySQL root password if any

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die('Connection failed: ' . $conn->connect_error);
}
?>