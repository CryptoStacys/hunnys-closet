<?php

if ( ! defined( 'WPINC' ) ) {
	die;
}

$countries = OrderService::get_shipping_countries();

wp_send_json(
    array(
        "data" => $countries
    )
);

exit();

