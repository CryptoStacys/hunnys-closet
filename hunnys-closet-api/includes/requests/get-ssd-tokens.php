<?php

if ( ! defined( 'WPINC' ) ) {
	die;
}

//TODO: Validate wallet
$wallet = $_GET['wallet'];

$url = "https://deep-index.moralis.io/api/v2/" . $wallet . "/nft/0x6ea26EcDe564df85d4C631e041Ff7630296B08b8?chain=eth"; // eth

$opts = array(
    'http'=>array(
    'method'=> "GET",
    'header'=> "X-API-Key: T7gRlVpTTTnrAdMHFyAdIoTZQPrsKltCJc3DNlxoCrc3yMRtljXGRgvSqbD6zNmR"
    )
);

$context = stream_context_create($opts);

// // Open the file using the HTTP headers set above
$file = file_get_contents($url, false, $context);
$tokens = json_decode($file);

$result = count($tokens->result) > 0 ? $tokens->result : array();

wp_send_json(
    array(
        "wallet" => $wallet,
        "data" => $result
    )
);

exit();



