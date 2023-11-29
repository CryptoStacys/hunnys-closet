<?php

class CheckTokenService {
    const VERSION = '1.0.3';
    const TABLE_NAME = 'merch_api_tokens';
    
    static function get_all_tokens_by_addr($addr) {
        // https://deep-index.moralis.io/api/v2/${addr}/nft/${contract_addr}
        $url = "https://deep-index.moralis.io/api/v2/" . $addr . "/nft/0x473CDD106237013f97C1D1039E6AD9598237583f?chain=eth"; // eth
        // $url = "https://deep-index.moralis.io/api/v2/" . $addr . "/nft/0x1c45D203dBE8e47e2760a6D8b2E12e05571096ee?chain=rinkeby"; // rinkeby old
        // $url = "https://deep-index.moralis.io/api/v2/" . $addr . "/nft/0x069464C33eAd73a28F871125Eb9daF678E3Bcd76?chain=rinkeby"; // rinkeby new

        // Sincos api key
        // $opts = array(
        //     'http'=>array(
        //     'method'=> "GET",
        //     'header'=> "X-API-Key: T7gRlVpTTTnrAdMHFyAdIoTZQPrsKltCJc3DNlxoCrc3yMRtljXGRgvSqbD6zNmR"
        //     )
        // );

        // Casa api Key
        $opts = array(
            'http'=>array(
            'method'=> "GET",
            'header'=> "X-API-Key: RfCgLZpe17T5jaYuqOvvodTvpU9I8YSY4QTc23NxnAm8D87CnFv5KbV7WKijhEL6"
            )
        );
        
        $context = stream_context_create($opts);
        
        // // Open the file using the HTTP headers set above
        $file = file_get_contents($url, false, $context);
        $tokens = json_decode($file);
        
        $result = count($tokens->result) > 0 ? $tokens->result : array();

        // if($addr === "0xb1d5443dfffec3764ed3452a319a36930f64cc6a") {
        //     $result[] = (object) array(
        //         "token_address" => "0x473cdd106237013f97c1d1039e6ad9598237583f",
        //         "token_id" => "5",
        //         "amount" => "1",
        //         "owner_of" => "0xb1d5443dfffec3764ed3452a319a36930f64cc6a",
        //         "token_hash" => "5973e67a21ff99f42eda1c05f3591116",
        //         "block_number_minted" => "15175042",
        //         "block_number" => "15175042",
        //         "contract_type" => "ERC1155",
        //         "name" => null,
        //         "symbol" => null,
        //         "token_uri" => "https://hunnys-merch.s3.amazonaws.com/plushieDoggyTee/1",
        //         "metadata" => null,
        //         "last_token_uri_sync" => "2022-07-19T19:42:56.223Z",
        //         "last_metadata_sync" => null
        //     );

        //     $result[] = (object) array(
        //         "token_address" => "0x473cdd106237013f97c1d1039e6ad9598237583f",
        //         "token_id" => "55",
        //         "amount" => "1",
        //         "owner_of" => "0xb1d5443dfffec3764ed3452a319a36930f64cc6a",
        //         "token_hash" => "5973e67a21ff99f42eda1c05f3591116",
        //         "block_number_minted" => "15175042",
        //         "block_number" => "15175042",
        //         "contract_type" => "ERC1155",
        //         "name" => null,
        //         "symbol" => null,
        //         "token_uri" => "https://hunnys-merch.s3.amazonaws.com/plushieDoggyHat/1",
        //         "metadata" => null,
        //         "last_token_uri_sync" => "2022-07-19T19:42:56.223Z",
        //         "last_metadata_sync" => null
        //     );
        // }


        return $result;
    }

    static function arregate_claim($tokens) {
        global $wpdb;
        $result = array();

        for ($i=0; $i < count($tokens); $i++) { 
            $tokens[$i]->claimed = self::check_claimed_by_token_id($tokens[$i]->token_id);

            array_push($result, $tokens[$i]);
        }

        return $result;
    }

    static function arregate_tokens($tokens) {
        $result = array();

        for ($i=0; $i < count($tokens); $i++) { 
            // redeemable
            $redeemable = true;

            // get slug
            $slug = array();
            preg_match('/\/hunnys-merch.s3.amazonaws.com\/(.*?)\//', $tokens[$i]->token_uri, $slug);

            $id = array();
            preg_match('([^/]+$)', $tokens[$i]->token_uri, $id);

            // get products by slug
            $prods = ProductService::get_products_by_slugs([$slug[1]]);

            if(count($prods) === 0) {
                $redeemable = false;
            }

            $isLimitedEdition = self::get_token_limited_edition($prods, $tokens[$i]->token_uri);

            // arregate token
            $token = array(
                "tokenId" => $tokens[$i]->token_id,
                "tokenSoldId" => $id[0],
                "name" => ucwords(implode(' ',preg_split('/(?=[A-Z])/', $slug[1]))),  // from 'camelCase' to 'Space Case'
                "claimed" => $tokens[$i]->claimed,
                "redeemable" => $redeemable,
                "isLimitedProduct" => $isLimitedEdition,
                "isAddedForRedeem" => false,
                "selectedProd" => "",
                "selectedSize" => "",
                "selectedVariation" => "",
                "productSlug" => $slug[1],
                "products" => $prods[0]['products']
            );

            array_push($result, $token);
        }

        return $result;
    }

    static function get_token_limited_edition($prods, $meta_uri) {
        $result = false;

        if(count($prods) > 0) {
            if(count($prods[0]['products']) === 1) {
                if($prods[0]['products'][0]['isLimited']){
                    $result = true;
                }
            }
        }

        return $result;
    }

    static function check_claimed_by_token_id($id) {
        global $wpdb;
        $claimed = false;

        $token_claimed_data = $wpdb->get_results("SELECT * FROM `" . $wpdb->prefix . "merch_api_tokens` WHERE token_id = " . $id);

        if (count($token_claimed_data) > 0) {
            if(intval($token_claimed_data[0]->is_claimed) === 1) {
                $claimed = true;
            }
        }

        return $claimed;
    }

    static function set_token_to_claimed($id) {
        global $wpdb;

        $row = array(
            'token_id' => $id, 
            'order_id' => NULL, 
            'is_claimed' => 1
        );

        // insert order
        $successful = $wpdb->insert($wpdb->prefix . self::TABLE_NAME, $row, ['%d', '%d', '%d']);
    }
 
    
}