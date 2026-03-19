<?php
// Simple Vulnerable Application
$servername = "sqli-db";
$username = "dbuser";
$password = "dbpass";
$dbname = "app_db";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$message = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $user = $_POST['user'];
    $pass = $_POST['pass'];

    // VULNERABLE SQL QUERY (No Prepared Statements)
    $sql = "SELECT * FROM users WHERE username='$user' AND password='$pass'";
    
    // We purposefully print the query on the screen so students can see their syntax errors for Error-based SQLi
    $result = $conn->query($sql);

    if (!$result) {
        $message = "<div style='color:red;'>SQL Error: " . $conn->error . "<br>Query was: " . $sql . "</div>";
    } else if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $message = "<div style='color:green;'><h3>Login Successful!</h3><p>Welcome, " . htmlspecialchars($row["username"]) . " (Role: " . htmlspecialchars($row["role"]) . ")</p></div>";
    } else {
        $message = "<div style='color:red;'>Invalid username or password.</div>";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Vulnerable Login</title>
    <style>
        body { font-family: sans-serif; background: #f4f4f4; padding: 50px; }
        .login-box { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); max-width: 400px; margin: auto; }
        input[type="text"], input[type="password"] { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
        button { background: #3b82f6; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; width: 100%; }
        button:hover { background: #2563eb; }
    </style>
</head>
<body>
    <div class="login-box">
        <h2>Admin Authentication</h2>
        <form method="POST" action="">
            <label>Username:</label>
            <input type="text" name="user" placeholder="Enter username">
            <label>Password:</label>
            <input type="password" name="pass" placeholder="Enter password">
            <button type="submit">Login</button>
        </form>
        <br>
        <?php echo $message; ?>
        
        <hr style="margin-top: 30px; border-top: 1px solid #eee;">
        <p style="font-size: 0.8em; color: gray;">Want to test SQLMap? Use the API endpoint:<br> <code><a href="/item.php?id=1">/item.php?id=1</a></code></p>
    </div>
</body>
</html>
