<?php

if ( ! defined( 'WPINC' ) ) {
	die;
}

$wallet = $_GET['wallet'];

$data = ClosetService::request_node_api($wallet);

wp_send_json(
    $data
);

exit();



