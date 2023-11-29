<?php

if ( ! defined( 'WPINC' ) ) {
	die;
}

//TODO: Validate wallet
$wallet = $_GET['wallet'];
$tokens = array();
$is_wallet_valid = VerifyService::verify_wallet($wallet);

if($is_wallet_valid) {
    $tokens = CheckTokenService::get_all_tokens_by_addr($wallet);
    $tokens = CheckTokenService::arregate_claim($tokens);
    $tokens = CheckTokenService::arregate_tokens($tokens);
}
  


wp_send_json(
    array(
        "wallet" => $wallet,
        "data" => $tokens
    )
);

exit();



