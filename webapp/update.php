<?php
$authorization_key = "changeme";

$headers = apache_request_headers();

if ($headers["Authorization"] == $authorization_key) {
	file_put_contents("info.json", file_get_contents("php://input"));
	http_response_code(200);
} else {
	http_response_code(401);
}
?>
