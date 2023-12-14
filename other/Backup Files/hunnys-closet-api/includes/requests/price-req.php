<?php

if ( ! defined( 'WPINC' ) ) {
	die;
}

$scale = PriceService::get_price_scale();

wp_send_json(
    array(
        "scale" => $scale
    )
);

exit();



