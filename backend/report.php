<?php
include 'db.php';

$sql = "
    SELECT 
        SUM(CASE WHEN type='income' THEN amount ELSE 0 END) AS total_income,
        SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) AS total_expense,
        SUM(CASE WHEN type='income' THEN amount ELSE 0 END) -
        SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) AS balance,
        SUM(CASE WHEN type='expense' AND necessity='necessary' THEN amount ELSE 0 END) AS necessary_expense,
        SUM(CASE WHEN type='expense' AND necessity='unnecessary' THEN amount ELSE 0 END) AS unnecessary_expense
    FROM transactions
";
$result = $conn->query($sql);
$data = $result->fetch_assoc();

header('Content-Type: application/json');
echo json_encode($data);
?>