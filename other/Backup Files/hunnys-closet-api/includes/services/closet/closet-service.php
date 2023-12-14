<?php

class ClosetService {
    const VERSION = '1.0.3';
    const TABLE_NAME = 'merch_api_orders';

    ////////////////////////////////////////////////////////////////// Using the node api

    static function request_node_api($wallet) {
        $url = "https://staging-hunnys-closet-2-548f5ed67a1b.herokuapp.com/dollys?wallet=" . $wallet;

        $opts = array(
            'http'=>array(
            'method'=> "GET",
            'header'=> "X-API-KEY: abc123"
            )
        );
        
        $context = stream_context_create($opts);
        
        // // Open the file using the HTTP headers set above
        $file = file_get_contents($url, false, $context);
        $result = json_decode($file);
        
        return $result;
    }

    static function request_node_all_traits() {
        $url = "https://staging-hunnys-closet-2-548f5ed67a1b.herokuapp.com/traits";

        $opts = array(
            'http'=>array(
            'method'=> "GET",
            'header'=> "X-API-KEY: abc123"
            )
        );
        
        $context = stream_context_create($opts);
        
        // // Open the file using the HTTP headers set above
        $file = file_get_contents($url, false, $context);
        $result = json_decode($file);
        
        return $result;
    }

   
    
}