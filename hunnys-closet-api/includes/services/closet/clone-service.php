<?php

class CloneService {
    const VERSION = '1.0.3';
    const TABLE_NAME = 'merch_api_orders';

    static function update_clone($tokenId, $data, $name) {
        $result = CloneDbService::save_clone_data_by_id($tokenId, $data, $name);

        if($result !== FALSE){
            self::update_aws($tokenId);
        }

        return $result;
    }

    static function get_clone_data($tokenIds) {
        $result = array();

        for ($i=0; $i < count($tokenIds); $i++) { 

            array_push($result, array(
                "token_id" => $tokenIds[$i],
                "attributes" => CloneDbService::get_clone_data_by_id(intval($tokenIds[$i]))
            ));
        }

        return $result;
    }

    static function update_aws($tokenId) {
        $url = "https://staging-hunnys-closet-2-548f5ed67a1b.herokuapp.com/update?ids[]=" . $tokenId;
        // $url = "http://217.160.247.57/hunnys-aws-closet-service/update?ids[]=" . $tokenId;

        $opts = array(
            'http'=>array(
            'method'=> "GET",
            'header'=> "X-API-Key: abc123"
            )
        );

        $context = stream_context_create($opts);
        
        // // Open the file using the HTTP headers set above
        $file = file_get_contents($url, false, $context);
        $result = json_decode($file);
        
        return $result;
    }

    
}