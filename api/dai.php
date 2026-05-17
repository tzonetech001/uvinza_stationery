<?php
require_once 'config.php';
$conn = getDBConnection();
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

if ($method === 'GET') {
    $loans = [];
    $sql = "SELECT d.id, d.customer_name, d.amount_due, DATE_FORMAT(d.due_date, '%Y-%m-%d') AS due_date, d.status, IFNULL(SUM(p.amount_paid), 0) AS total_paid FROM dai d LEFT JOIN dai_payments p ON p.dai_id = d.id GROUP BY d.id ORDER BY d.due_date DESC";
    $result = $conn->query($sql);
    while ($row = $result->fetch_assoc()) {
        $row['amount_due'] = (float) $row['amount_due'];
        $row['total_paid'] = (float) $row['total_paid'];
        $loans[] = $row;
    }

    $payments = [];
    $result = $conn->query("SELECT id, dai_id, amount_paid, DATE_FORMAT(payment_date, '%Y-%m-%d') AS payment_date FROM dai_payments ORDER BY payment_date DESC");
    while ($row = $result->fetch_assoc()) {
        $row['amount_paid'] = (float) $row['amount_paid'];
        $payments[] = $row;
    }

    echo json_encode(['success' => true, 'data' => $loans, 'payments' => $payments]);
    $conn->close();
    exit;
}

if ($method === 'POST') {
    $action = $input['action'] ?? 'add';

    if ($action === 'payment') {
        $daiId = intval($input['dai_id'] ?? 0);
        $amountPaid = floatval($input['amount_paid'] ?? 0);
        $paymentDate = $conn->real_escape_string($input['payment_date'] ?? date('Y-m-d'));

        if ($daiId <= 0 || $amountPaid <= 0) {
            echo json_encode(['success' => false, 'message' => 'Kiasi au dai haina thamani.']);
            $conn->close();
            exit;
        }

        $insert = "INSERT INTO dai_payments (dai_id, amount_paid, payment_date) VALUES ($daiId, $amountPaid, '$paymentDate')";
        $conn->query($insert);

        $update = "UPDATE dai SET amount_due = GREATEST(amount_due - $amountPaid, 0), status = CASE WHEN amount_due - $amountPaid <= 0 THEN 'Imelipwa' ELSE 'Inalipwa' END WHERE id = $daiId";
        $conn->query($update);

        echo json_encode(['success' => true]);
        $conn->close();
        exit;
    }

    $customerName = $conn->real_escape_string($input['customer_name'] ?? '');
    $amountDue = floatval($input['amount_due'] ?? 0);
    $dueDate = $conn->real_escape_string($input['due_date'] ?? date('Y-m-d'));
    $status = $conn->real_escape_string($input['status'] ?? 'Inasubiri');

    $sql = "INSERT INTO dai (customer_name, amount_due, due_date, status) VALUES ('$customerName', $amountDue, '$dueDate', '$status')";
    $conn->query($sql);
    echo json_encode(['success' => true, 'id' => $conn->insert_id]);
    $conn->close();
    exit;
}

if ($method === 'PUT') {
    $id = intval($input['id'] ?? 0);
    $customerName = $conn->real_escape_string($input['customer_name'] ?? '');
    $amountDue = floatval($input['amount_due'] ?? 0);
    $dueDate = $conn->real_escape_string($input['due_date'] ?? date('Y-m-d'));
    $status = $conn->real_escape_string($input['status'] ?? 'Inasubiri');

    $sql = "UPDATE dai SET customer_name = '$customerName', amount_due = $amountDue, due_date = '$dueDate', status = '$status' WHERE id = $id";
    $conn->query($sql);
    echo json_encode(['success' => true]);
    $conn->close();
    exit;
}

if ($method === 'DELETE') {
    $id = intval($input['id'] ?? 0);
    $conn->query("DELETE FROM dai_payments WHERE dai_id = $id");
    $conn->query("DELETE FROM dai WHERE id = $id");
    echo json_encode(['success' => true]);
    $conn->close();
    exit;
}

echo json_encode(['success' => false, 'message' => 'Method not allowed']);
$conn->close();
