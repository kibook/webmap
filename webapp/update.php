<?php
/* Replace "changeme" with the authorization key you set in config.lua. */
$authorization_key = "changeme";

/* You don't have to change anything below this line. */
$headers = apache_request_headers();

if ($headers["Authorization"] == $authorization_key) {
	file_put_contents("info.json", file_get_contents("php://input"));
	http_response_code(200);
} else {
	http_response_code(401);
}
?>
