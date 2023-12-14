<?php

if ( ! defined( 'WPINC' ) ) {
	die;
}

$path = $_GET['path'];
$data = ImageService::get_image($path);


wp_send_json(
    $data
);

exit();



