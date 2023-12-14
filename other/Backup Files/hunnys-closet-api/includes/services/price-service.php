<?php

class PriceService {
    // const VERSION = '1.0.3';
    // const TABLE_NAME = 'merch_api_auth';

    static function get_price_scale() {
        // global $wpdb;
        $result = array(
            'scaleDown' => get_option('mwc-web3-price-scale-check-box') === 'true' ? true : false,
            'percent' => get_option('mwc-web3-price-percent')
        );

        // $existing_token = $wpdb->get_results("SELECT id, wallet, token, date_created FROM `" . $wpdb->prefix . "merch_api_auth` WHERE wallet LIKE '" . $wallet . "'");
        
        // if(count($existing_token) > 0) {
        //     //TODO: check for date
        //     $result = $existing_token[0]->token;
        // } else {
        //     $msg = substr(str_shuffle('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 1, 20);
        //     $result = $msg;
        //     $timestamp = date('Y-m-d H:i:s');

        //     $row = array(
        //         'wallet' => $wallet, 
        //         'token' => $msg, 
        //         'date_created' => $timestamp
        //     );

        //     $successful = $wpdb->insert($wpdb->prefix . self::TABLE_NAME, $row, ['%s', '%s', '%s']);
        // }

        return $result;
    }

    
}