<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

try {
    $rawInput = file_get_contents("php://input");
    error_log("Received data: " . $rawInput);

    $data = json_decode($rawInput, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Invalid JSON: ' . json_last_error_msg());
    }

    if (!isset($data['transactions']) || !is_array($data['transactions'])) {
        throw new Exception('No transactions provided');
    }

    // Use your existing db.php
    require_once 'db.php';
    if ($conn->connect_error) {
        throw new Exception('Database connection failed: ' . $conn->connect_error);
    }

    $conn->begin_transaction();

    // Updated to match your exact table structure
    $stmt = $conn->prepare("INSERT INTO transactions (name, date, amount, category, type, necessity) VALUES (?, ?, ?, ?, ?, ?)");
    if (!$stmt) {
        throw new Exception('Prepare failed: ' . $conn->error);
    }

    foreach ($data['transactions'] as $tx) {
        // Set default category if empty
        if (empty($tx['category'])) {
            $tx['category'] = $tx['type'] === 'income' ? 'Income' : 'Uncategorized';
        }

        // Set default necessity for expenses
        if ($tx['type'] === 'expense' && empty($tx['necessity'])) {
            $tx['necessity'] = 'necessary';
        }

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

    $conn->commit();

    echo json_encode([
        'success' => true,
        'message' => 'Imported ' . count($data['transactions']) . ' transactions'
    ]);

} catch (Exception $e) {
    if (isset($conn) && !$conn->connect_error) {
        $conn->rollback();
    }

    error_log("Import error: " . $e->getMessage());
    error_log("Stack trace: " . $e->getTraceAsString());

    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'details' => [
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ]
    ]);
}