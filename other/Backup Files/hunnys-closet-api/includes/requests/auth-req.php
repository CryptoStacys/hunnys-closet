<?php

if ( ! defined( 'WPINC' ) ) {
	die;
}

//TODO: vallidate wallet
$wallet = $_GET['wallet'];

$is_wallet_valid = VerifyService::verify_wallet($wallet);

$token = '';
if($is_wallet_valid) {
    $token = AuthService::get_auth_token($wallet);
}

wp_send_json(
    array(
        "wallet" => $_GET['wallet'],
        "authToken" => $token
    )
);

exit();

