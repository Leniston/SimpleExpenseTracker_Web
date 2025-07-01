<?php
header('Content-Type: application/json');
require_once 'db.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);

    $stmt = $conn->prepare("
        INSERT INTO categories (name, description) 
        VALUES (?, ?)
    ");

    $stmt->bind_param('ss', $data['name'], $data['description']);

    if (!$stmt->execute()) {
        throw new Exception($stmt->error);
    }

    echo json_encode(['success' => true, 'id' => $conn->insert_id]);

} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}