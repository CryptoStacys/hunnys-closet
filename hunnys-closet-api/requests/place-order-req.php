<?php

if ( ! defined( 'WPINC' ) ) {
	die;
}

$body = $_POST;
$status = 200;
$res_message = 'Success. Your Order got created';
$input_validation = array( "are_products_valid" => false, "is_address_valid" => false, "data" => array() );

//TODO: Validate wallet
$wallet = $body['wallet'];
$is_wallet_valid = VerifyService::verify_wallet($wallet);

if($is_wallet_valid) {
    $sig = $body['signature'];
    $body_input_data = json_decode($body['data']);
    
    // get msg out of db
    $msg = AuthService::get_auth_token($wallet);
    $is_sig_valid = VerifyService::verify_req($msg, $sig, $wallet);
    
    if($is_sig_valid['status'] === 'Success') {
        // verify products and address inputs
        $input_validation = ValidationService::validate_inputs($input_validation, $body_input_data, $wallet);
    
        // // if success create order
        if($input_validation['are_products_valid'] && $input_validation['is_address_valid']) {
            $order_success = OrderService::create_order($wallet, $input_validation['data']);
        }
    }
}


if(!$input_validation['are_products_valid']) {
    $status = 303;
    $res_message = "Invalid products inputs.";
}

if(!$input_validation['is_address_valid']) {
    $status = 302;
    $res_message = "Invalid address inputs.";
}

if($is_sig_valid['status'] === 'Fail') {
    $status = 301;
    $res_message = "Invalid signature.";
}

wp_send_json(
    array(
        "status" => $status,
        "message" => $res_message
    )
);

exit();

