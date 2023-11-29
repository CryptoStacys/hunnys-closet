<?php

if ( ! defined( 'WPINC' ) ) {
	die;
}


$data = ClosetService::request_node_all_traits();

wp_send_json(
    $data
);

exit();