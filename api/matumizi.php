<?php
require_once 'config.php';
$conn = getDBConnection();
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

if ($method === 'GET') {
    $expenses = [];
    $result = $conn->query("SELECT id, name, amount, DATE_FORMAT(expense_date, '%Y-%m-%d') AS expense_date FROM expenses ORDER BY expense_date DESC");
    while ($row = $result->fetch_assoc()) {
        $row['amount'] = (float) $row['amount'];
        $expenses[] = $row;
    }
    echo json_encode(['success' => true, 'data' => $expenses]);
    $conn->close();
    exit;
}

if ($method === 'POST') {
    $name = $conn->real_escape_string($input['name'] ?? '');
    $amount = floatval($input['amount'] ?? 0);
    $expenseDate = $conn->real_escape_string($input['expense_date'] ?? date('Y-m-d'));

    $conn->query("INSERT INTO expenses (name, amount, expense_date) VALUES ('$name', $amount, '$expenseDate')");
    echo json_encode(['success' => true, 'id' => $conn->insert_id]);
    $conn->close();
    exit;
}

if ($method === 'PUT') {
    $id = intval($input['id'] ?? 0);
    $name = $conn->real_escape_string($input['name'] ?? '');
    $amount = floatval($input['amount'] ?? 0);
    $expenseDate = $conn->real_escape_string($input['expense_date'] ?? date('Y-m-d'));

    $conn->query("UPDATE expenses SET name = '$name', amount = $amount, expense_date = '$expenseDate' WHERE id = $id");
    echo json_encode(['success' => true]);
    $conn->close();
    exit;
}

if ($method === 'DELETE') {
    $id = intval($input['id'] ?? 0);
    $conn->query("DELETE FROM expenses WHERE id = $id");
    echo json_encode(['success' => true]);
    $conn->close();
    exit;
}

echo json_encode(['success' => false, 'message' => 'Method not allowed']);
$conn->close();
