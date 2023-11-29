<?php

if ( ! defined( 'WPINC' ) ) {
	die;
}

$tokenIds = $_GET['tokenIds'];
$data = CloneService::get_clone_data($tokenIds);


wp_send_json(
    $data
);

exit();



