<?php
// register.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require 'db_config.php';

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->username) || !isset($data->password)) {
    echo json_encode(["success" => false, "message" => "Missing credentials"]);
    exit;
}

$username = $data->username;
$password = password_hash($data->password, PASSWORD_DEFAULT);

try {
    $stmt = $pdo->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    $stmt->execute([$username, $password]);
    echo json_encode(["success" => true, "message" => "User registered successfully"]);
} catch (PDOException $e) {
    if ($e->getCode() == 23000) {
        echo json_encode(["success" => false, "message" => "Username already exists"]);
    } else {
        echo json_encode(["success" => false, "message" => "Registration failed: " . $e->getMessage()]);
    }
}
?>
