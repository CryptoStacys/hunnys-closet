<?php

class ImageService {
    const VERSION = '1.0.3';
    const TABLE_NAME = 'merch_api_orders';

    static function get_image($path) {
        $base64 = '';
        $fullPath = plugin_dir_path( dirname( __FILE__ ) ) . 'closet/layers/' . $path . '.png';
        $file_exists = self::fileExists($fullPath);
        
        if($file_exists !== false) {
            $data = file_get_contents($file_exists); 
            // $data = file_get_contents(plugin_dir_path( dirname( __FILE__ ) ) . 'closet/layers/' . $path . '.png'); 
            $base64 = base64_encode($data);
        }


        if($base64 !== ''){
            $base64 = 'data:image/png;base64,' . $base64;
        }

        return $base64;

    }

    static function fileExists($fileName) {

        if(file_exists($fileName)) {
            return $fileName;
        }
    
        // Handle case insensitive requests            
        $directoryName = dirname($fileName);
        $fileArray = glob($directoryName . '/*', GLOB_NOSORT);
        $fileNameLowerCase = strtolower($fileName);
        foreach($fileArray as $file) {
            if(strtolower($file) == $fileNameLowerCase) {
                return $file;
            }
        }
        return false;
    }
    
}