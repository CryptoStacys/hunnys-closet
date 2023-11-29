<?php

if ( ! defined( 'WPINC' ) ) {
	die;
}

$products = ProductService::get_all_products();

wp_send_json(
    array(
        "data" => $products
    )
);

exit();



