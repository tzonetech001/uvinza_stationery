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

$token = trim($data['token'] ?? '');
$new_password = $data['new_password'] ?? '';
$confirm_password = $data['confirm_password'] ?? '';

if (empty($token) || empty($new_password) || strlen($new_password) < 6 || $new_password !== $confirm_password) {
    echo json_encode(['success' => false, 'message' => 'Invalid token or password']);
    exit;
}

session_start();
if (!isset($_SESSION['reset_token']) || $_SESSION['reset_token'] !== $token || !isset($_SESSION['reset_user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid or expired token']);
    exit;
}

$user_id = $_SESSION['reset_user_id'];

$hashed_password = password_hash($new_password, PASSWORD_BCRYPT);

$conn = getDBConnection();
$stmt = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
$stmt->bind_param("si", $hashed_password, $user_id);

if ($stmt->execute()) {
    // Clear session
    unset($_SESSION['reset_token']);
    unset($_SESSION['reset_user_id']);
    echo json_encode(['success' => true, 'message' => 'Password reset successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Password reset failed']);
}

$stmt->close();
$conn->close();
?>