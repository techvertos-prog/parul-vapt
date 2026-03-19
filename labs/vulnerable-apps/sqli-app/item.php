<?php
// Simple Vulnerable API Endpoint for SQLMap
$servername = "sqli-db";
$username = "dbuser";
$password = "dbpass";
$dbname = "app_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// Ensure ID exists
if(isset($_GET['id'])) {
    $id = $_GET['id'];
    
    // VULNERABLE SQL QUERY expected to be dumped by SQLMap
    $sql = "SELECT id, username FROM users WHERE id=" . $id;
    $result = $conn->query($sql);
    
    if (!$result) {
        // Blind indicator (we don't show the error so SQLMap has to work harder)
        echo json_encode(["status" => "error", "message" => "Item not found."]);
    } else if ($result->num_rows > 0) {
        $data = array();
        while($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode(["status" => "success", "data" => $data]);
    } else {
        echo json_encode(["status" => "success", "data" => []]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Please provide an ?id= parameter."]);
}
$conn->close();
?>
