<?php
require_once 'config.php';
$conn = getDBConnection();
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

if ($method === 'GET') {
    $sales = [];
    $result = $conn->query("SELECT id, item_name, quantity, price, total, DATE_FORMAT(sale_date, '%Y-%m-%d') AS sale_date FROM sales ORDER BY sale_date DESC");
    while ($row = $result->fetch_assoc()) {
        $row['quantity'] = (int) $row['quantity'];
        $row['price'] = (float) $row['price'];
        $row['total'] = (float) $row['total'];
        $sales[] = $row;
    }
    echo json_encode(['success' => true, 'data' => $sales]);
    $conn->close();
    exit;
}

if ($method === 'POST') {
    $itemName = $conn->real_escape_string($input['item_name'] ?? '');
    $quantity = intval($input['quantity'] ?? 0);
    $price = floatval($input['price'] ?? 0);
    $total = floatval($input['total'] ?? ($quantity * $price));
    $saleDate = $conn->real_escape_string($input['sale_date'] ?? date('Y-m-d'));

    $conn->query("INSERT INTO sales (item_name, quantity, price, total, sale_date) VALUES ('$itemName', $quantity, $price, $total, '$saleDate')");
    echo json_encode(['success' => true, 'id' => $conn->insert_id]);
    $conn->close();
    exit;
}

if ($method === 'PUT') {
    $id = intval($input['id'] ?? 0);
    $itemName = $conn->real_escape_string($input['item_name'] ?? '');
    $quantity = intval($input['quantity'] ?? 0);
    $price = floatval($input['price'] ?? 0);
    $total = floatval($input['total'] ?? ($quantity * $price));
    $saleDate = $conn->real_escape_string($input['sale_date'] ?? date('Y-m-d'));

    $conn->query("UPDATE sales SET item_name = '$itemName', quantity = $quantity, price = $price, total = $total, sale_date = '$saleDate' WHERE id = $id");
    echo json_encode(['success' => true]);
    $conn->close();
    exit;
}

if ($method === 'DELETE') {
    $id = intval($input['id'] ?? 0);
    $conn->query("DELETE FROM sales WHERE id = $id");
    echo json_encode(['success' => true]);
    $conn->close();
    exit;
}

echo json_encode(['success' => false, 'message' => 'Method not allowed']);
$conn->close();
