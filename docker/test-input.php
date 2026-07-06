<?php
$body = file_get_contents("php://input");
echo json_encode([
    "method" => $_SERVER["REQUEST_METHOD"] ?? "CLI",
    "content_type" => $_SERVER["CONTENT_TYPE"] ?? "none",
    "content_length" => $_SERVER["CONTENT_LENGTH"] ?? "none",
    "body_length" => strlen($body),
    "body" => $body,
    "post" => $_POST,
]);
