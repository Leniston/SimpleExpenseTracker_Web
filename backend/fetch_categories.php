<?php
header('Content-Type: application/json');
require_once 'db.php';

try {
    $categories = [];

    $result = $conn->query("
        SELECT id, name, description, created_by, created_at 
        FROM categories 
        ORDER BY name
    ");

    while ($row = $result->fetch_assoc()) {
        $categoryId = $row['id'];

        // Get subcategories for this category
        $subQuery = $conn->prepare("
            SELECT id, name, description, created_by, created_at 
            FROM subcategories 
            WHERE category_id = ?
            ORDER BY name
        ");

        $subQuery->bind_param('i', $categoryId);
        $subQuery->execute();
        $subResult = $subQuery->get_result();

        $subcategories = [];
        while ($subRow = $subResult->fetch_assoc()) {
            $subcategories[] = $subRow;
        }

        $row['subcategories'] = $subcategories;
        $categories[] = $row;
    }

    echo json_encode($categories);

} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}