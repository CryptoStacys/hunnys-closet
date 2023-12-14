<?php

use Elliptic\EC;
use kornrunner\Keccak;


class VerifyService {
    const VERSION = '1.0.3';
    const TABLE_NAME = 'merch_api_tokons';

    static function verify_req($message, $signature, $address) {
        $result = array(
            'status' => "Fail",
            'message' => $message,
            'signature'=> $signature,
            'address' => $address
        );

        if (self::verify_signature($message, $signature, $address)) {
            $result['status'] = "Success";
        }

        return $result;
    }

    static function verify_wallet($wallet) {
        if (preg_match('/^(0x)?[0-9a-f]{40}$/i', $wallet)) {
            return self::is_all_same_caps($wallet) ?: self::is_valid_checksum($wallet);
        }

        return false;
    }

    static function pub_key_to_address($pubkey) {
        return "0x" . substr(Keccak::hash(substr(hex2bin($pubkey->encode("hex")), 1), 256), 24);
    }

    static function is_all_same_caps(string $address): bool {
        return preg_match('/^(0x)?[0-9a-f]{40}$/', $address) || preg_match('/^(0x)?[0-9A-F]{40}$/', $address);
    }

    static function is_valid_checksum($address) {
        $address = str_replace('0x', '', $address);
        $hash = Keccak::hash(strtolower($address), 256);

        // See: https://github.com/web3j/web3j/pull/134/files#diff-db8702981afff54d3de6a913f13b7be4R42
        for ($i = 0; $i < 40; $i++ ) {
            if (ctype_alpha($address{$i})) {
                // Each uppercase letter should correlate with a first bit of 1 in the hash char with the same index,
                // and each lowercase letter with a 0 bit.
                $charInt = intval($hash{$i}, 16);

                if ((ctype_upper($address{$i}) && $charInt <= 7) || (ctype_lower($address{$i}) && $charInt > 7)) {
                    return false;
                }
            }
        }

        return true;
    }
    
    static function verify_signature($message, $signature, $address) {
        $msglen = strlen($message);
        $hash   = Keccak::hash("\x19Ethereum Signed Message:\n{$msglen}{$message}", 256);
        $sign   = ["r" => substr($signature, 2, 64), 
                   "s" => substr($signature, 66, 64)];
        $recid  = ord(hex2bin(substr($signature, 130, 2))) - 27; 
        if ($recid != ($recid & 1)) 
            return false;
    
        $ec = new EC('secp256k1');
        $pubkey = $ec->recoverPubKey($hash, $sign, $recid);
    
        return strtolower($address) === strtolower(self::pub_key_to_address($pubkey));
    }

}