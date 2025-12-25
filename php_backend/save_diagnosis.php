<?php
// save_diagnosis.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require 'db_config.php';

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->user_id) || !isset($data->crop) || !isset($data->prediction)) {
    echo json_encode(["success" => false, "message" => "Missing data"]);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO diagnoses (user_id, crop, symptoms, disease, risk, confidence, date) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $data->user_id,
        $data->crop,
        $data->symptoms,
        $data->prediction,
        $data->risk,
        $data->confidence,
        date("Y-m-d H:i:s")
    ]);
    
    echo json_encode(["success" => true, "message" => "Diagnosis saved successfully"]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Failed to save: " . $e->getMessage()]);
}
?>
