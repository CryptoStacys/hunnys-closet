<?php

class ValidationService {

    static function validate_inputs($input_validation, $body_input_data, $wallet) {

        // validate address
        if(property_exists($body_input_data, 'address')) {
            $address = self::validate_address($body_input_data->address);
            $input_validation['is_address_valid'] = $address['is_valid'];
            $input_validation['data']['address'] = $address['address'];
        }

        //validate products
        if(property_exists($body_input_data, 'products')) {
            $products = self::validate_products($body_input_data->products, $wallet);
            $input_validation['are_products_valid'] = $products['is_valid'];
            $input_validation['data']['products'] = $products['data'];
        }

        return $input_validation;
    }

    static function validate_address($data) {
        $is_valid = true;
        $address = array(
            'first_name' => '',
            'last_name'  => '',
            'email'      => '',
            'phone'      => '',
            'address_1'  => '',
            'address_2'  => '', 
            'city'       => '',
            'state'      => '',
            'postcode'   => '',
            'country'    => ''
        );

        // check  first_name
        if(property_exists($data, 'first_name')) {
            if (self::is_string_valid('string', $data->first_name)) {
                $address['first_name'] = $data->first_name;
            } else {
                $is_valid = false;
            }
        } else {
            $is_valid = false;
        }

        // check  last_name
        if(property_exists($data, 'last_name')) {
            if (self::is_string_valid('string', $data->last_name)) {
                $address['last_name'] = $data->last_name;
            } else {
                $is_valid = false;
            }
        } else {
            $is_valid = false;
        }

        // check  email
        if(property_exists($data, 'email')) {
            if (filter_var($data->email, FILTER_VALIDATE_EMAIL)) {
                $address['email'] = $data->email;
            } else {
                $is_valid = false;
            }
        } else {
            $is_valid = false;
        }

        // check  phone
        if(property_exists($data, 'phone')) {
            $justNums = preg_replace("/[^0-9]/", '', $data->phone);

            //eliminate leading 0 if its there
            // if (strlen($justNums) == 11) $justNums = preg_replace("/^0/", '',$justNums);

            //if we have 10 digits left, it's probably valid.
            // if (strlen($justNums) == 10) {
                $address['phone'] = $justNums;
            // } else {
            //     $is_valid = false;
            // }
        }

        // check  street
        if(property_exists($data, 'street')) {
            if (self::is_string_valid('string', $data->street)) {
                $address['address_1'] = $data->street;
            } else {
                $is_valid = false;
            }
        } else {
            $is_valid = false;
        }

        // check  city
        if(property_exists($data, 'city')) {
            if (self::is_string_valid('string', $data->city)) {
                $address['city'] = $data->city;
            } else {
                $is_valid = false;
            }
        } else {
            $is_valid = false;
        }

        // check  postcode
        if(property_exists($data, 'postcode')) {
            if (self::is_string_valid('string', $data->postcode)) {
                $address['postcode'] = $data->postcode;
            } else {
                $is_valid = false;
            }
        } else {
            $is_valid = false;
        }

        // check  country
        if(property_exists($data, 'country')) {
            if (self::is_string_valid('string', $data->country)) {
                $address['country'] = $data->country;
            } else {
                $is_valid = false;
            }
        } else {
            $is_valid = false;
        }

        // check  state
        if(property_exists($data, 'state')) {
            if (self::is_string_valid('string', $data->state)) {
                $address['state'] = $data->state;
            } else {
                $is_valid = false;
            }
        } else {
            $is_valid = false;
        }

        return array( 'is_valid' => $is_valid, 'address' => $address );

    }

    static function is_string_valid($type, $string) {
        $result = false;
        $regex = '';

        switch ($type) {
            case 'string':
                $regex = '/[\'^£$%&*()}!;{@#~?><>,|=_+¬-]/';
                break;
        }

        if($regex !== '') {
            $result = preg_match($regex, $string) ? false : true;
        }

        return $result;
    }


    static function validate_products($data, $wallet) {
        $is_valid = true;
        $result = array();

        $owned_tokens = CheckTokenService::get_all_tokens_by_addr($wallet);
        
        // loop through each token
        for ($i=0; $i < count($data); $i++) { 
            $is_claimed = false;
            $is_placed_in_order = false;
            $is_owner = false;
            $is_meta_match = false;

            // check if token id is alreday claimed or in a already created order
            $is_claimed = CheckTokenService::check_claimed_by_token_id($data[$i]->token_id);
            $is_placed_in_order = OrderService::check_oders_for_token($data[$i]->token_id);

            // check if wallet is owner of token id
            $token_meta = '';
            for ($k=0; $k < count($owned_tokens); $k++) { 
                if($owned_tokens[$k]->token_id === $data[$i]->token_id) {
                    $is_owner = true;
                    $token_meta = $owned_tokens[$k]->token_uri;
                    break;
                }
            }
    
            // check if prodId to got same metaPath as token
            if($is_owner) {
                $slug = array();
                preg_match('/\/hunnys-merch.s3.amazonaws.com\/(.*?)\//', $token_meta, $slug);
                $prods = ProductService::get_products_by_slugs([$slug[1]]);

                for ($m=0; $m < count($prods[0]['products']); $m++) { 
                    if($prods[0]['products'][$m]['productID'] === $data[$i]->prod_id) {
                        $is_meta_match = true;
                        break;
                    }
                }
            }
    

            if(!$is_claimed && !$is_placed_in_order && $is_owner && $is_meta_match) {
                // find prod variant by color and size 
                $variant_prod_id = ProductService::get_product_by_props($data[$i]->prod_id, $data[$i]->size, $data[$i]->color, $token_meta);

                if($variant_prod_id !== '') {
                    $valid_prod = array(
                        "token_id" => $data[$i]->token_id,
                        "prod_id" => $variant_prod_id
                    );

                    array_push($result, $valid_prod);

                } else {
                    $is_valid = false;
                }
            } else {
                $is_valid = false;
            }

            if(!$is_valid) {
                break;
            }
        }

        return array( "is_valid" => $is_valid, "data" => $result);

    }

    
}