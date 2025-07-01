<?php
include 'db.php';
$data = json_decode(file_get_contents("php://input"), true);

$stmt = $conn->prepare("UPDATE transactions SET name=?, date=?, amount=?, category=?, type=?, necessity=? WHERE id=?");
$stmt->bind_param("ssdsssi", $data['name'], $data['date'], $data['amount'], $data['category'], $data['type'], $data['necessity'], $data['id']);
$stmt->execute();
echo json_encode(['success' => true]);
?>