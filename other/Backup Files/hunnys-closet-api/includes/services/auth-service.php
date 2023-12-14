<?php

class AuthService {
    const VERSION = '1.0.3';
    const TABLE_NAME = 'merch_api_auth';

    static function get_auth_token($wallet) {
        global $wpdb;
        $result = '';

        $existing_token = $wpdb->get_results("SELECT id, wallet, token, date_created FROM `" . $wpdb->prefix . "merch_api_auth` WHERE wallet LIKE '" . $wallet . "'");
        
        if(count($existing_token) > 0) {
            //TODO: check for date
            $result = $existing_token[0]->token;
        } else {
            $msg = substr(str_shuffle('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 1, 20);
            $result = $msg;

            $row = array(
                'wallet' => $wallet, 
                'token' => $msg
            );

            $successful = $wpdb->insert($wpdb->prefix . self::TABLE_NAME, $row, ['%s', '%s']);
        }

        return $result;
    }

    
}