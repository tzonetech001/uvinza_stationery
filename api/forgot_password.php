<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Invalid JSON data']);
    exit;
}

$email = trim($data['email'] ?? '');
$phone = trim($data['phone'] ?? '');

if (empty($email) || empty($phone)) {
    echo json_encode(['success' => false, 'message' => 'Email and phone are required']);
    exit;
}

$conn = getDBConnection();
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ? AND phone = ?");
$stmt->bind_param("ss", $email, $phone);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'No user found with this email and phone']);
    $stmt->close();
    $conn->close();
    exit;
}

$user = $result->fetch_assoc();

// Generate a reset token (simple random string, in production use proper token)
$reset_token = bin2hex(random_bytes(32));

// Store token in session or database (for simplicity, use session)
session_start();
$_SESSION['reset_token'] = $reset_token;
$_SESSION['reset_user_id'] = $user['id'];

echo json_encode([
    'success' => true,
    'message' => 'Verification successful. You can now reset your password.',
    'token' => $reset_token
]);

$stmt->close();
$conn->close();
?>