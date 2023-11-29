<?php

if ( ! defined( 'WPINC' ) ) {
	die;
}

$body = $_POST;
$status = 500;

$wallet = $body['wallet'];
$is_wallet_valid = VerifyService::verify_wallet($wallet);
$res_cast = array();

if($is_wallet_valid) {
    $sig = $body['signature'];
    $body_data = json_decode($body['data']);
    $tokenId = $body['token_id'];
    
    // get msg out of db
    $msg = AuthService::get_auth_token($wallet);
    $is_sig_valid = VerifyService::verify_req($msg, $sig, $wallet);
    
    if($is_sig_valid['status'] === 'Success') {
        // verify products and address inputs
        $is_data_valid = VerifyCloneService::verify_data($wallet, $body_data->token, $tokenId);
        $res_cast = $is_data_valid['cast'];
        $res_message = $is_data_valid['msg'];

        if($is_data_valid['is_valid']) {
            $status = 201;
            // get msg out of db
            $name = property_exists($body_data, "name") ? $body_data->name : "";
            $data = CloneService::update_clone(intval($tokenId), $body_data->token, $name);
            
            if($data !== FALSE) {
                $status = 200;
                $res_message = 'Success. Your Dolly got changed';
            }
        }
    } else {
        $res_message = 'Signature is not correct.';
    }
} else {
    $res_message = 'Wallet is not correct.';
}

wp_send_json(
    array(
        "status" => $status,
        "message" => $res_message,
        "cast" => $res_cast
    )
);

exit();




