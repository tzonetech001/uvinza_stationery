<?php
require_once 'config.php';
$conn = getDBConnection();
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

if ($method === 'GET') {
    $accounts = [];
    $sql = "SELECT d.id, d.name, d.amount_due, DATE_FORMAT(d.due_date, '%Y-%m-%d') AS due_date, d.status, IFNULL(SUM(p.amount_paid), 0) AS total_paid FROM daiwa d LEFT JOIN daiwa_payments p ON p.daiwa_id = d.id GROUP BY d.id ORDER BY d.due_date DESC";
    $result = $conn->query($sql);
    while ($row = $result->fetch_assoc()) {
        $row['amount_due'] = (float) $row['amount_due'];
        $row['total_paid'] = (float) $row['total_paid'];
        $accounts[] = $row;
    }

    $payments = [];
    $result = $conn->query("SELECT id, daiwa_id, amount_paid, DATE_FORMAT(payment_date, '%Y-%m-%d') AS payment_date FROM daiwa_payments ORDER BY payment_date DESC");
    while ($row = $result->fetch_assoc()) {
        $row['amount_paid'] = (float) $row['amount_paid'];
        $payments[] = $row;
    }

    echo json_encode(['success' => true, 'data' => $accounts, 'payments' => $payments]);
    $conn->close();
    exit;
}

if ($method === 'POST') {
    $action = $input['action'] ?? 'add';

    if ($action === 'payment') {
        $daiwaId = intval($input['daiwa_id'] ?? 0);
        $amountPaid = floatval($input['amount_paid'] ?? 0);
        $paymentDate = $conn->real_escape_string($input['payment_date'] ?? date('Y-m-d'));

        if ($daiwaId <= 0 || $amountPaid <= 0) {
            echo json_encode(['success' => false, 'message' => 'Kiasi au daiwa haina thamani.']);
            $conn->close();
            exit;
        }

        $conn->query("INSERT INTO daiwa_payments (daiwa_id, amount_paid, payment_date) VALUES ($daiwaId, $amountPaid, '$paymentDate')");
        $conn->query("UPDATE daiwa SET amount_due = GREATEST(amount_due - $amountPaid, 0), status = CASE WHEN amount_due - $amountPaid <= 0 THEN 'Imelipwa' ELSE 'Inalipwa' END WHERE id = $daiwaId");

        echo json_encode(['success' => true]);
        $conn->close();
        exit;
    }

    $name = $conn->real_escape_string($input['name'] ?? '');
    $amountDue = floatval($input['amount_due'] ?? 0);
    $dueDate = $conn->real_escape_string($input['due_date'] ?? date('Y-m-d'));
    $status = $conn->real_escape_string($input['status'] ?? 'Inasubiri');

    $conn->query("INSERT INTO daiwa (name, amount_due, due_date, status) VALUES ('$name', $amountDue, '$dueDate', '$status')");
    echo json_encode(['success' => true, 'id' => $conn->insert_id]);
    $conn->close();
    exit;
}

if ($method === 'PUT') {
    $id = intval($input['id'] ?? 0);
    $name = $conn->real_escape_string($input['name'] ?? '');
    $amountDue = floatval($input['amount_due'] ?? 0);
    $dueDate = $conn->real_escape_string($input['due_date'] ?? date('Y-m-d'));
    $status = $conn->real_escape_string($input['status'] ?? 'Inasubiri');

    $conn->query("UPDATE daiwa SET name = '$name', amount_due = $amountDue, due_date = '$dueDate', status = '$status' WHERE id = $id");
    echo json_encode(['success' => true]);
    $conn->close();
    exit;
}

if ($method === 'DELETE') {
    $id = intval($input['id'] ?? 0);
    $conn->query("DELETE FROM daiwa_payments WHERE daiwa_id = $id");
    $conn->query("DELETE FROM daiwa WHERE id = $id");
    echo json_encode(['success' => true]);
    $conn->close();
    exit;
}

echo json_encode(['success' => false, 'message' => 'Method not allowed']);
$conn->close();
