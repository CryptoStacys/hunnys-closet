<?php

class ProductService {
    const VERSION = '1.0.3';
    const TABLE_NAME = 'merch_api_tokons';

    static function get_products_by_slugs($params) {
        $arregatedProducts = self::get_all_products();
        $result = self::arregate_products_by_slugs($arregatedProducts, $params);

        return $result;
    }

    static function get_all_products() {
        $products = self::get_products();
        $result = self::arregate_products_for_shop($products);
            
        return $result;
    }

    static function arregate_products_by_slugs($allProducts, $params) {
        $result = array();

        for ($i=0; $i < count($params); $i++) { 

            $item = array(
                'slug' => $params[$i],
                'products' => array()
            );
            for ($k=0; $k < count($allProducts); $k++) { 
                if($allProducts[$k]['uriString'] === $params[$i]) {
                    array_push($item['products'], $allProducts[$k]);
                }
            }

            array_push($result, $item);
        }

        return $result;
    }

    public static function get_products() {
        global $wpdb;

        $all_product_data = $wpdb->get_results("SELECT p.ID, p.post_title, p.post_content FROM `" . $wpdb->prefix . "posts` p LEFT JOIN `" . $wpdb->prefix . "postmeta` pm ON p.ID = pm.post_id  WHERE pm.meta_value NOT LIKE '' AND pm.meta_key = '_web3_contract_product_id' AND p.post_type = 'product' AND p.post_status = 'publish' GROUP BY p.ID");

        return $all_product_data;
    }

    // loop through each product get variants and format product w/ variants and templates w/ pd template & side data 
    public static function arregate_products_for_shop($products) {
        global $wpdb;

        $result =  array();
        if(!empty($products)) {
            for ($i=0; $i < count($products); $i++) { 

                $contract_product_id = $wpdb->get_results("SELECT meta_value FROM `" . $wpdb->prefix . "postmeta` WHERE post_id = " . $products[$i]->ID . " AND meta_key = '_web3_contract_product_id'");
                $contract_product = $wpdb->get_results("SELECT * FROM `wp_merch_api_products` WHERE `id` = " . $contract_product_id[0]->meta_value, ARRAY_A);
                $size_table = $wpdb->get_results("SELECT meta_value FROM `" . $wpdb->prefix . "postmeta` WHERE post_id = " . $products[$i]->ID . " AND meta_key = 'pf_advanced_size_chart'");
                $prod_attr = $wpdb->get_results("SELECT meta_value FROM `" . $wpdb->prefix . "postmeta` WHERE post_id = " . $products[$i]->ID . " AND meta_key = '_product_attributes'");
                $prod_cats = $wpdb->get_results("SELECT t.name FROM `" . $wpdb->prefix . "terms` t RIGHT JOIN `" . $wpdb->prefix . "term_relationships` tr ON tr.object_id = " . $products[$i]->ID . " LEFT JOIN `" . $wpdb->prefix . "term_taxonomy` tt ON tr.term_taxonomy_id = tt.term_taxonomy_id WHERE tt.taxonomy = 'product_cat' AND t.term_id = tt.term_id");

                $prod_attr = unserialize($prod_attr[0]->meta_value);

                $formattedAttr = self::formatProductAttributes($products[$i]->ID, $prod_attr);

                $result[] = array(
                    'productID' => $products[$i]->ID,
                    'contractID' => $contract_product[0]['contract_id'],
                    'tokenName' => stripslashes($contract_product[0]['token_name']),
                    'title' => $products[$i]->post_title,
                    'description' => $products[$i]->post_content,
                    'colors' => $formattedAttr['colors'],
                    'sizes' => $formattedAttr['sizes'],
                    'uriString' => $contract_product[0]['meta_path'],
                    'isLimited' => $contract_product[0]['is_limited'] === '0' ? false : true,
                    'countSelected' => 1,
                    'sizeTable' => json_decode($size_table[0]->meta_value),
                    'priceScale' => self::getPriceScaling(),
                    'contractPrice' => $contract_product[0]['price'],
                    'rarity' => $contract_product[0]['rarity'],
                    'redeemable' => $contract_product[0]['is_redeemable'] === '0' ? false : true,
                    'isHolder' => $contract_product[0]['is_holder'] === '0' ? false : true,
                    'isSoldOut' => $contract_product[0]['is_sold_out'] === '0' ? false : true,
                    'productCats' => $prod_cats,
                    'variations' => $formattedAttr['images'],
                    'displayVariationId' => rand(0, (count($formattedAttr['images']) -1))
                );
            }
        }

        return $result;
    }

    public static function getPriceScaling() {
        $scale = array(
            'scaleDown' => get_option('mwc-web3-price-scale-check-box') === 'true' ? true : false,
            'percent' => get_option('mwc-web3-price-percent')
        );

        return $scale;
    }

    public static function get_product_cat($prodID) {
        global $wpdb;
        $prod_cats = $wpdb->get_results("SELECT t.name FROM `" . $wpdb->prefix . "terms` t RIGHT JOIN `" . $wpdb->prefix . "term_relationships` tr ON tr.object_id = " . $prodID . " LEFT JOIN `" . $wpdb->prefix . "term_taxonomy` tt ON tr.term_taxonomy_id = tt.term_taxonomy_id WHERE tt.taxonomy = 'product_cat' AND t.term_id = tt.term_id");
        
        return $prod_cats;

    }

    public static function formatProductAttributes($prodID, $attr) {
        global $wpdb;

        $color_codes_lookup = array(
            'black' => '#000000',
            'white' => '#ffffff',
            'khaki' => '#ad9273',
            'pink' => '#FFC0CB',
            'light-blue' => '#ADD8E6',
            'black-heather' => '#24252A',
            'red' => '#ff0000',
            'true-royal' => '#4169e1',
            'kelly' => '#4CBB17',
            'yellow'  => '#FFFF00',
            'sky-blue' => '#87ceeb',
            'dusty-rose' => '#e89082',
            'team-royal' => '#174885'
        );

        $colorArrNames = array();
        $colorArrSlugs = array();
        $sizeArr = array();
        // $isPrintfulProduct = array_key_exists('pa_color', $attr) ? true : false;
        $isPrintfulProduct = true;

        if($isPrintfulProduct) {
            // get pa arrays

            // size
            $prod_attr = $wpdb->get_results("SELECT meta_value FROM `" . $wpdb->prefix . "postmeta` WHERE post_id = " . $prodID . " AND meta_key = 'pf_advanced_size_chart'");
            $meta_val = json_decode($prod_attr[0]->meta_value);
            $sizeArr = $meta_val->availableSizes;
            
            // color
            $prod_attr_color = $wpdb->get_results("SELECT DISTINCT `term_id` FROM `" . $wpdb->prefix . "wc_product_attributes_lookup` WHERE product_or_parent_id = " . $prodID . " AND taxonomy = 'pa_color'");
          
            for ($i=0; $i < count($prod_attr_color); $i++) { 
                
                $color = $wpdb->get_results("SELECT `name`, `slug` FROM `" . $wpdb->prefix . "terms` WHERE term_id = " . $prod_attr_color[$i]->term_id );
                array_push($colorArrNames, $color[0]->name);
                array_push($colorArrSlugs, $color[0]->slug);
            }

        } else {
            $colorArrSlugs = explode("|", str_replace(' ', '', $attr['color']['value']));
            $sizeArr = explode("|", str_replace(' ', '', $attr['size']['value']));
            $colorArrNames = $colorArrSlugs;
        }

        $colorAttrName = array_key_exists('pa_color', $attr) ? 'pa_color' : 'color';
        $sizeAttrName = array_key_exists('pa_size', $attr) ? 'pa_size' : 'size';

        $result =  array(
            'colors' => $colorArrNames,
            'sizes' => $sizeArr,
            'images' => array()
        );

        // get all product
        $image_gallery_post_ids = $wpdb->get_results("SELECT meta_value FROM `" . $wpdb->prefix . "postmeta` WHERE post_id = " . $prodID . " AND meta_key = '_product_image_gallery'");
        $prod_gallery_paths = $wpdb->get_results("SELECT meta_value FROM `" . $wpdb->prefix . "postmeta` WHERE post_id IN (" . $image_gallery_post_ids[0]->meta_value . ") AND meta_key = '_wp_attached_file'");

        for ($i=0; $i < count($colorArrSlugs); $i++) { 
            // get variant prod and get the color image
            $colorArrtName = $isPrintfulProduct ? 'attribute_pa_color' : 'attribute_color';
            $product_variations_id_by_color = $wpdb->get_results("SELECT p.ID FROM wp_posts p LEFT JOIN wp_postmeta pm ON pm.post_id = p.ID WHERE p.post_parent = '" . $prodID . "' AND pm.meta_key = '" . $colorArrtName . "' AND pm.meta_value = '" . $colorArrSlugs[$i] . "' AND p.post_type = 'product_variation' AND p.post_status = 'publish'");
            $variant_image = $wpdb->get_results("SELECT p.ID, am.meta_value FROM wp_posts p LEFT JOIN wp_postmeta pm ON pm.post_id = p.ID AND pm.meta_key = '_thumbnail_id' LEFT JOIN wp_postmeta am ON am.post_id = pm.meta_value AND am.meta_key = '_wp_attached_file' WHERE p.ID = '" . $product_variations_id_by_color[0]->ID . "' ");

            $prod_image = self::filter_image_gallery_after_color($prod_gallery_paths, $colorArrSlugs[$i], $variant_image[0]->meta_value);

            $result['images'][] = array(
                'color' => $colorArrSlugs[$i],
                'images' => $prod_image,
                'hexCode' => $color_codes_lookup[$colorArrSlugs[$i]],
            );
        }

        if(count($colorArrSlugs) === 0) {
            $result['images'][] = array(
                'color' => 'One Color',
                'images' => [$prod_gallery_paths[0]->meta_value],
                'hexCode' => ''
            );
        }

        return $result;
    }

    public static function filter_image_gallery_after_color($path_arr, $color, $thumbnail) {
        $result = array();
        $result[] = $thumbnail;
        for ($i=0; $i < count($path_arr); $i++) { 
            if(strpos($path_arr[$i]->meta_value, $color) && $path_arr[$i]->meta_value !== $thumbnail) {
                $result[] = $path_arr[$i]->meta_value;
            }
        }

        return $result;
    }


    public static function get_product_by_props($prod_id, $size, $color, $token_meta) {
        global $wpdb;
        
        // check prod meta if limited edition
        $result = '';
        $parent_post_id = $prod_id;
        // $is_limited = $wpdb->get_results("SELECT meta_value FROM `" . $wpdb->prefix . "postmeta` WHERE post_id = " . $prod_id . " AND meta_key = '_web3_is_limited_edition'");
        $contract_product_id = $wpdb->get_results("SELECT meta_value FROM `" . $wpdb->prefix . "postmeta` WHERE post_id = " . $prod_id . " AND meta_key = '_web3_contract_product_id'");
        $contract_product = $wpdb->get_results("SELECT * FROM `wp_merch_api_products` WHERE `id` = " . $contract_product_id[0]->meta_value, ARRAY_A);

        if($contract_product[0]['is_limited'] === '1') {
            $meta = explode('/', $token_meta);
            $limited_token_id = $meta[count($meta) -1];

            $parent_prod = $wpdb->get_results("SELECT post_title FROM `" . $wpdb->prefix . "posts` WHERE ID = " . $prod_id );
            $prod_name = $parent_prod[0]->post_title . ' #' . $limited_token_id;

            $limited_parent_prod_id = $wpdb->get_results("SELECT ID FROM `" . $wpdb->prefix . "posts` WHERE post_title LIKE '" . addslashes($prod_name) . "'");

            if(count($limited_parent_prod_id) > 0) {
                $parent_post_id = $limited_parent_prod_id[0]->ID;
            }
        }

        $size_name = 'attribute_pa_size';
        $color_name = 'attribute_pa_color';

        if($size === 'One size') {
            $variant = $wpdb->get_results("SELECT DISTINCT p.ID, p.post_parent FROM wp_posts p LEFT JOIN wp_postmeta pm ON pm.post_id = p.ID LEFT JOIN wp_postmeta am ON am.post_id = p.ID WHERE p.post_parent = " . $parent_post_id . " AND am.meta_value = '". str_replace(' ', '-', strtolower($color)) . "' AND am.meta_key = '". $color_name . "' ");
        } else if ($color === 'One Color') {
            $variant = $wpdb->get_results("SELECT DISTINCT p.ID, p.post_parent FROM wp_posts p LEFT JOIN wp_postmeta pm ON pm.post_id = p.ID LEFT JOIN wp_postmeta am ON am.post_id = p.ID WHERE p.post_parent = " . $parent_post_id . " AND am.meta_value = '". strtolower($size) . "' AND am.meta_key = '". $size_name . "' ");
        } else {
            $variant = $wpdb->get_results("SELECT DISTINCT p.ID, p.post_parent FROM wp_posts p LEFT JOIN wp_postmeta pm ON pm.post_id = p.ID LEFT JOIN wp_postmeta am ON am.post_id = p.ID LEFT JOIN wp_postmeta bm ON bm.post_id = p.ID WHERE p.post_parent = " . $parent_post_id . " AND am.meta_value = '". str_replace(' ', '-', strtolower($color)) . "' AND am.meta_key = '". $color_name . "' AND bm.meta_value = '". strtolower($size) . "' AND bm.meta_key = '". $size_name . "' ");
        }


        if(count($variant) > 0) {
            $result = $variant[0]->ID;
        }

        return $result;
    }
}