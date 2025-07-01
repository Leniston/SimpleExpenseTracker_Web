<?php
header('Content-Type: application/json');
require_once 'db.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);

    $stmt = $conn->prepare("UPDATE categories SET name = ? WHERE id = ?");
    $stmt->bind_param('si', $data['name'], $data['id']);

    if (!$stmt->execute()) {
        throw new Exception($stmt->error);
    }

    echo json_encode(['success' => true]);

} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}