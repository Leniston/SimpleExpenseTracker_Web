<?php
include 'db.php';
$id = intval($_GET['id']);

$stmt = $conn->prepare("DELETE FROM transactions WHERE id=?");
$stmt->bind_param("i", $id);
$stmt->execute();
echo json_encode(['success' => true]);
?>