<?php

if ( ! defined( 'WPINC' ) ) {
	die;
}

$tokenId = $_GET['tokenId'];
$result = 'undefinied';

if(gettype($tokenId) === 'string') {
    $tokenId = intval($tokenId);
    if(gettype($tokenId) === 'integer') {
        $result = CheckTokenService::check_claimed_by_token_id($tokenId);
    }
}

wp_send_json(
    array(
        "data" => $result
    )
);

exit();