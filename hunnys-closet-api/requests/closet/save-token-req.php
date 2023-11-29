<?php

if ( ! defined( 'WPINC' ) ) {
	die;
}

$body = $_POST;
$status = 500;
$res_message = 'Error. Something went wrong';

$key = $body['key'];
$body_data = json_decode($body['data']);
$token_id = $body['token_id'];

if($key === "auSZ873hsa2kasOsD27u") {
    $status = 204;
    // get msg out of db
    $name = property_exists($body_data, "name") ? $body_data->name : "";
    $result = CloneDbService::save_clone_data_by_id(intval($token_id), $body_data->token, $name);
    
    if($result !== FALSE) {
        $status = 200;
        $res_message = 'Success. Your Dolly got saved';
    }
}

wp_send_json(
    array(
        "status" => $status,
        "message" => $res_message
    )
);

exit();