<?php
include 'db.php';
$data = json_decode(file_get_contents("php://input"), true);

$stmt = $conn->prepare("INSERT INTO transactions (name, date, amount, category, type, necessity) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssdsss", $data['name'], $data['date'], $data['amount'], $data['category'], $data['type'], $data['necessity']);
$stmt->execute();
echo json_encode(['success' => true, 'id' => $stmt->insert_id]);
?>