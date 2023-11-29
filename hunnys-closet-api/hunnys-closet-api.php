<?php
/**
 * Plugin Name: Hunnys Closet API
 * Description: Custom Request Handler for Hunnys Closet
 * Author: Rat Benetar
 * Version: 1.0
 */

$urlPath = parse_url($_SERVER['REQUEST_URI']);

header("Access-Control-Allow-Origin: *");

// Define the WordPress "DOING_AJAX" constant.
if ( ! defined( 'DOING_AJAX' ) ) {
    define( 'DOING_AJAX', true );
}

if ( is_readable( plugin_dir_path( dirname( __FILE__ ) ) . 'hunnys-closet-api/vendor/autoload.php' ) ) {
    require plugin_dir_path( dirname( __FILE__ ) ) . 'hunnys-closet-api/vendor/autoload.php';
}

// Auth req - Get Auth Token to a wallet address 
if($urlPath['path'] === '/auth') {
    require_once plugin_dir_path( dirname( __FILE__ ) ) . 'hunnys-closet-api/includes/services/verify-service.php';
    require_once plugin_dir_path( dirname( __FILE__ ) ) . 'hunnys-closet-api/includes/services/auth-service.php';
    require_once plugin_dir_path( dirname( __FILE__ ) ) . 'hunnys-closet-api/includes/requests/auth-req.php';
}

// Auth req - Post Req Token to a wallet address 
if($urlPath['path'] === '/placeOrder') {
    require_once plugin_dir_path( dirname( __FILE__ ) ) . 'hunnys-closet-api/includes/services/verify-service.php';
    require_once plugin_dir_path( dirname( __FILE__ ) ) . 'hunnys-closet-api/includes/services/auth-service.php';
    require_once plugin_dir_path( dirname( __FILE__ ) ) . 'hunnys-closet-api/includes/services/product-service.php';
    require_once plugin_dir_path( dirname( __FILE__ ) ) . 'hunnys-closet-api/includes/services/check-token-service.php';
    require_once plugin_dir_path( dirname( __FILE__ ) ) . 'hunnys-closet-api/includes/services/order-service.php';
    require_once plugin_dir_path( dirname( __FILE__ ) ) . 'hunnys-closet-api/includes/services/validation-service.php';
    require_once plugin_dir_path( dirname( __FILE__ ) ) . 'hunnys-closet-api/includes/requests/place-order-req.php';
}

// Products req - Return all products for shop in JSON
if($urlPath['path'] === '/checkTokens') {
    require_once plugin_dir_path( dirname( __FILE__ ) ) . 'hunnys-closet-api/includes/services/verify-service.php';
    require_once plugin_dir_path( dirname( __FILE__ ) ) . 'hunnys-closet-api/includes/services/product-service.php';
    require_once plugin_dir_path( dirname( __FILE__ ) ) . 'hunnys-closet-api/includes/services/check-token-service.php';
    require_once plugin_dir_path( dirname( __FILE__ ) ) . 'hunnys-closet-api/includes/requests/check-token-req.php';
}

// Get req - Return all shipping countries for shop in JSON
if($urlPath['path'] === '/shippingCountries') {
    require_once plugin_dir_path( dirname( __FILE__ ) ) . 'hunnys-closet-api/includes/services/order-service.php';
    require_once plugin_dir_path( dirname( __FILE__ ) ) . 'hunnys-closet-api/includes/requests/shipping-countries-req.php';
}

// Products req - Return all products for shop in JSON
if($urlPath['path'] === '/products') {
    require_once plugin_dir_path( dirname( __FILE__ ) ) . 'hunnys-closet-api/includes/services/product-service.php';
    require_once plugin_dir_path( dirname( __FILE__ ) ) . 'hunnys-closet-api/includes/requests/products-req.php';
}

// Products req - Return all products for shop in JSON
if($urlPath['path'] === '/priceScale') {
    require_once plugin_dir_path( dirname( __FILE__ ) ) . 'hunnys-closet-api/includes/services/price-service.php';
    require_once plugin_dir_path( dirname( __FILE__ ) ) . 'hunnys-closet-api/includes/requests/price-req.php';
}

// Check Token ID req - Return if Token ID was already redeemed
if($urlPath['path'] === '/redeemed') {
    require_once plugin_dir_path( dirname( __FILE__ ) ) . 'hunnys-closet-api/includes/services/check-token-service.php';
    require_once plugin_dir_path( dirname( __FILE__ ) ) . 'hunnys-closet-api/includes/requests/redeemed-req.php';
}


// Closet url

// get closet data
if($urlPath['path'] === '/verifyCloset') {
    require_once plugin_dir_path( dirname( __FILE__ ) ) . 'hunnys-closet-api/includes/services/closet/closet-service.php';
    require_once plugin_dir_path( dirname( __FILE__ ) ) . 'hunnys-closet-api/includes/requests/closet/verify-closet-req.php';
}

// get closet image as base64
if($urlPath['path'] === '/getImage') {
    require_once plugin_dir_path( dirname( __FILE__ ) ) . 'hunnys-closet-api/includes/services/closet/image-service.php';
    require_once plugin_dir_path( dirname( __FILE__ ) ) . 'hunnys-closet-api/includes/requests/closet/image-req.php';
}

// get clone data as base64
if($urlPath['path'] === '/getCloneData') {
    require_once plugin_dir_path( dirname( __FILE__ ) ) . 'hunnys-closet-api/includes/services/closet/clone-db-service.php';
    require_once plugin_dir_path( dirname( __FILE__ ) ) . 'hunnys-closet-api/includes/services/closet/clone-service.php';
    require_once plugin_dir_path( dirname( __FILE__ ) ) . 'hunnys-closet-api/includes/requests/closet/clone-req.php';
}

// get clone data as base64
if($urlPath['path'] === '/updateClone') {
    require_once plugin_dir_path( dirname( __FILE__ ) ) . 'hunnys-closet-api/includes/services/verify-service.php';
    require_once plugin_dir_path( dirname( __FILE__ ) ) . 'hunnys-closet-api/includes/services/auth-service.php';
    require_once plugin_dir_path( dirname( __FILE__ ) ) . 'hunnys-closet-api/includes/services/closet/closet-service.php';
    require_once plugin_dir_path( dirname( __FILE__ ) ) . 'hunnys-closet-api/includes/services/closet/verify-clone-service.php';
    require_once plugin_dir_path( dirname( __FILE__ ) ) . 'hunnys-closet-api/includes/services/closet/clone-db-service.php';
    require_once plugin_dir_path( dirname( __FILE__ ) ) . 'hunnys-closet-api/includes/services/closet/clone-service.php';
    require_once plugin_dir_path( dirname( __FILE__ ) ) . 'hunnys-closet-api/includes/requests/closet/update-clone-req.php';
}

// get clone data as base64
if($urlPath['path'] === '/saveToken') {
    require_once plugin_dir_path( dirname( __FILE__ ) ) . 'hunnys-closet-api/includes/services/closet/clone-db-service.php';
    require_once plugin_dir_path( dirname( __FILE__ ) ) . 'hunnys-closet-api/includes/requests/closet/save-token-req.php';
}

// get all traits data 
if($urlPath['path'] === '/traits') {
    require_once plugin_dir_path( dirname( __FILE__ ) ) . 'hunnys-closet-api/includes/services/closet/closet-service.php';
    require_once plugin_dir_path( dirname( __FILE__ ) ) . 'hunnys-closet-api/includes/requests/closet/all-traits-req.php';
}



require_once plugin_dir_path( dirname( __FILE__ ) ) . 'hunnys-closet-api/includes/services/closet/cron-job-service.php';
/**
 * The code that runs during plugin activation.
 */
function hunnys_dollys_activate_plugins() {
    CronJobService::activate();
}

/**
 * The code that runs during plugin deactivation.
 */
function hunnys_dollys_deactivate_mokka_plugins() {
	CronJobService::deactivate();
}

register_activation_hook( __FILE__, 'hunnys_dollys_activate_plugins' );
register_deactivation_hook( __FILE__, 'hunnys_dollys_deactivate_mokka_plugins' );



