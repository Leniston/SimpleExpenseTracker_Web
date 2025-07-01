<?php
header('Content-Type: application/json');
require_once 'db.php';

try {
    $id = $_GET['id'];

    $stmt = $conn->prepare("DELETE FROM subcategories WHERE id = ?");
    $stmt->bind_param('i', $id);

    if (!$stmt->execute()) {
        throw new Exception($stmt->error);
    }

    echo json_encode(['success' => true]);

} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}