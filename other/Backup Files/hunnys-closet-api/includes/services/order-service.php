<?php

class OrderService {
    const VERSION = '1.0.3';
    const TABLE_NAME = 'merch_api_orders';

    static function create_order($wallet, $valid_data) {
        global $wpdb;

        // set tokens to claimed
        for ($i=0; $i < count($valid_data['products']); $i++) { 
            CheckTokenService::set_token_to_claimed(intval($valid_data['products'][$i]['token_id']));
        }

        $row = array(
            'wallet' => $wallet, 
            'address' => json_encode($valid_data['address']), 
            'data' => json_encode($valid_data['products']),
            'is_woo_created' => 0, 
            'order_id' => NULL
        );

        // insert order
        $successful = $wpdb->insert($wpdb->prefix . self::TABLE_NAME, $row, ['%s', '%s', '%s', '%d', '%d']);

        return $successful;
    }

    static function check_oders_for_token($token_id) {
        global $wpdb;
        $is_in_order = false;

        $not_created_orders = $wpdb->get_results("SELECT id, `data` FROM `" . $wpdb->prefix . "merch_api_orders` WHERE is_woo_created = '0'");

        if(count($not_created_orders) > 0) {
            for ($i=0; $i < count($not_created_orders); $i++) { 
                $data_string = json_decode($not_created_orders[$i]->data);

                for ($k=0; $k < count($data_string); $k++) { 
                    if($data_string[$k]->token_id === $token_id) {
                        $is_in_order = true;
                    }
                }
            }
            
        } 

        return $is_in_order;
    }

    static function get_shipping_countries() {
        $url = "https://api.printful.com/countries/";

        $opts = array(
            'http'=>array(
            'method'=> "GET"
            )
        );
        
        // 'header'=> "X-API-Key: RfCgLZpe17T5jaYuqOvvodTvpU9I8YSY4QTc23NxnAm8D87CnFv5KbV7WKijhEL6"
        $context = stream_context_create($opts);
        
        // Open the file using the HTTP headers set above
        $file = file_get_contents($url, false, $context);
        $tokens = json_decode($file);
        
        $result = count($tokens->result) > 0 ? $tokens->result : array();

        return $result;
    }

    
}