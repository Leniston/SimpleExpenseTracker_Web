<?php
header('Content-Type: application/json');

try {
    // Get JSON data
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (!isset($data['transactions']) || !is_array($data['transactions'])) {
        throw new Exception('No transactions provided');
    }

    // Connect to your database
    require_once 'db_connect.php';

    // Begin transaction
    $conn->begin_transaction();

    // Prepare insert statement
    $stmt = $conn->prepare("INSERT INTO transactions (name, date, amount, category, type, necessity) VALUES (?, ?, ?, ?, ?, ?)");

    // Insert each transaction
    foreach ($data['transactions'] as $tx) {
        $stmt->bind_param(
            'ssdsss',
            $tx['name'],
            $tx['date'],
            $tx['amount'],
            $tx['category'],
            $tx['type'],
            $tx['necessity']
        );

        if (!$stmt->execute()) {
            throw new Exception('Failed to insert transaction: ' . $stmt->error);
        }
    }

    // Commit transaction
    $conn->commit();

    echo json_encode([
        'success' => true,
        'message' => 'Imported ' . count($data['transactions']) . ' transactions'
    ]);

} catch (Exception $e) {
    // Rollback on error
    if (isset($conn) && $conn->connect_error === false) {
        $conn->rollback();
    }

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}