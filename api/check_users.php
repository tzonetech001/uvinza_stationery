<?php
require_once 'config.php';

$conn = getDBConnection();
$result = $conn->query('SELECT id, first_name, last_name, email, role FROM users LIMIT 5');

if ($result->num_rows > 0) {
    echo 'Users in database:' . PHP_EOL;
    while ($user = $result->fetch_assoc()) {
        echo 'ID: ' . $user['id'] . ', Name: ' . $user['first_name'] . ' ' . $user['last_name'] . ', Email: ' . $user['email'] . ', Role: ' . $user['role'] . PHP_EOL;
    }
} else {
    echo 'No users found in database' . PHP_EOL;
}

$conn->close();
?>