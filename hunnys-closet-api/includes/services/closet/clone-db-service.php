<?php

class CloneDbService {
    const VERSION = '1.0.3';
    const TABLE_NAME = 'merch_api_orders';

    static function save_clone_data_by_id($token_id, $data, $name) {
        global $wpdb;

        $row = array(
            'token_id' => $token_id, 
            'name' => $name,
            'data' => json_encode($data)

        );

        $result = $wpdb->update($wpdb->prefix . "merch_api_closet_clones", $row, array('token_id' => $row["token_id"]));

        if ($result === FALSE || $result < 1) {
            $result = $wpdb->insert($wpdb->prefix . "merch_api_closet_clones", $row, ['%d', '%s', '%s']);
        }

        return $result;
    }

    static function get_clone_data_by_id($token_id) {
        global $wpdb;
        $result = '';

        $data = $wpdb->get_results("SELECT id, `token_id`, `data` FROM `" . $wpdb->prefix . "merch_api_closet_clones` WHERE `token_id` = '" . $token_id . "'");

        if(count($data) > 0) {
            $result = json_decode($data[0]->data);
        }

        return $result;
    }

    
}