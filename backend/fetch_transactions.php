<?php
include 'db.php';
$sql = "SELECT * FROM transactions ORDER BY date DESC";
$result = $conn->query($sql);

$transactions = [];
while($row = $result->fetch_assoc()) {
    $transactions[] = $row;
}
header('Content-Type: application/json');
echo json_encode($transactions);
?>