<?php
// get_history.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

require 'db_config.php';

if (!isset($_GET['user_id'])) {
    echo json_encode(["success" => false, "message" => "User ID required"]);
    exit;
}

$user_id = $_GET['user_id'];

try {
    $stmt = $pdo->prepare("SELECT * FROM diagnoses WHERE user_id = ? ORDER BY created_at DESC");
    $stmt->execute([$user_id]);
    $history = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode(["success" => true, "history" => $history]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Failed to fetch history: " . $e->getMessage()]);
}
?>
