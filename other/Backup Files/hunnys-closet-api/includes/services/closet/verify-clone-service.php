<?php


class VerifyCloneService {
    const VERSION = '1.0.3';
    const TABLE_NAME = 'merch_api_tokons';

    static function verify_data($wallet, $body_data, $cloneId) {
        $is_valid = false;
        $is_body_valid = false;
        $is_clone_id_valid = false;
        $res_msg = "Something went wrong updating the data.";

        $data = ClosetService::request_node_api($wallet);

        $clones = $data->dollys;

        $casted_data = array();

        $found_clone = array_search($cloneId, array_column($clones, 'token_id'));

        if($found_clone !== false) {
            $is_clone_id_valid = true;
            $temp_body_valid = true;
            $temp_color_valid = true;

            $casted_data = self::cast_data_array($data->traits);

            // check new body traits
            for ($i=0; $i < count($body_data); $i++) { 
                $trait_to_check = $body_data[$i];

                $is_trait_valid = self::check_trait($casted_data, $trait_to_check);
                $is_color_valid = self::check_color($data, $trait_to_check);

                if(!$is_trait_valid || !$is_color_valid) {
                    
                    if(!$is_trait_valid) {
                        $temp_body_valid = false;
                        $res_msg = "Something went wrong. Not owning trait -> name: " . $trait_to_check->name . ", attribute: " . $trait_to_check->attribute . ", token_id: " . strval($trait_to_check->token_id) . ", origin_id: " . $trait_to_check->origin_id;
                    } else {
                        $temp_color_valid = true;
                        $res_msg = "Something went wrong. Not owning color: " . $trait_to_check->colorsApplied . " at trait -> name: ". $trait_to_check->name . " attribute: " . $trait_to_check->attribute . " token_id: " . strval($trait_to_check->token_id) . " origin_id: " . $trait_to_check->origin_id;
                    }
                    break;
                }
            }

            if($temp_body_valid && $temp_color_valid) {
                $is_body_valid = true;
            }

        } else {
            $res_msg = "Wallet does not own Dolly token ID";
        }

        if($is_body_valid && $is_clone_id_valid) {
            $is_valid = true;
        }
        
        return array(
            "is_valid" => $is_valid,
            "msg" => $res_msg,
            "cast" => $casted_data
        );
    }

    static function check_trait($data, $trait_to_check) {
        $is_valid = false;
        if($trait_to_check->name === "Empty") {
            $is_valid = true;
        } else {
            $trait_match = self::multi_array_search($data, array("name" => $trait_to_check->name, "attribute" => $trait_to_check->attribute, "origin_id" => $trait_to_check->origin_id));
            
            if(count($trait_match) > 0) {
                $is_valid = true;
            }
        }

        return $is_valid;
    }
    
    static function check_color($data, $trait_to_check) {
        $is_valid = true;

        if($trait_to_check->attribute === "Skin") {
            // TODO check with Than in frontend if value or colorsApplied
            $key = array_search($trait_to_check->name, $data->skin_colors);
                if($key === false) {
                    $is_valid = false;
                }

        } else {
            for ($i=0; $i < count($trait_to_check->colorsApplied); $i++) { 
                $key = array_search($trait_to_check->colorsApplied[$i], $data->colors);
                if($key === false) {
                    $is_valid = false;
                    break;
                }
            }
        }

        return $is_valid;
    }

    static function cast_data_array($data) {
        $result = array();

        for ($i=0; $i < count($data); $i++) { 
            array_push($result, (array) $data[$i]);
        }

        return $result;
    }

    static function multi_array_search($array, $search) {
  
      // Create the result array
      $result = array();
  
      // Iterate over each array element
      foreach ($array as $key => $value) {

        // Iterate over each search condition
        foreach ($search as $k => $v) {

          // If the array element does not meet the search condition then continue to the next element
          if (!isset($value[$k]) || $value[$k] != $v) {
            continue 2;
          }
  
        }
   
        // Add the array element's key to the result array
        $result[] = $key;
      }
  
      // Return the result array
      return $result;
    }
}