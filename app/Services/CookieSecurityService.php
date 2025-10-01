<?php

namespace App\Services;

use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;

class CookieSecurityService
{
    /**
     * Sign client data with HMAC for tamper detection
     */
    public static function signClientData(array $clientData): string
    {
        $data = json_encode($clientData);
        $signature = hash_hmac('sha256', $data, config('app.key'));
        return base64_encode($data . '|' . $signature);
    }
    
    /**
     * Verify and extract client data from signed cookie
     */
    public static function verifyClientData(string $signedData): ?array
    {
        try {
            $decoded = base64_decode($signedData);
            if (!$decoded) {
                return null;
            }
            
            $parts = explode('|', $decoded, 2);
            if (count($parts) !== 2) {
                return null;
            }
            
            [$data, $signature] = $parts;
            
            // Verify signature
            $expectedSignature = hash_hmac('sha256', $data, config('app.key'));
            if (!hash_equals($expectedSignature, $signature)) {
                return null;
            }
            
            return json_decode($data, true);
        } catch (\Exception $e) {
            return null;
        }
    }
    
    /**
     * Create a secure client cookie with signed data
     */
    public static function createSecureClientCookie(array $clientData): array
    {
        $signedData = self::signClientData($clientData);
        
        return [
            'client_data' => $signedData,
            'expires' => now()->addDays(7)->timestamp,
        ];
    }
    
    /**
     * Generate a nonce for additional security
     */
    public static function generateNonce(): string
    {
        return bin2hex(random_bytes(16));
    }
    
    /**
     * Validate nonce (you can store these in cache/database for validation)
     */
    public static function validateNonce(string $nonce): bool
    {
        // For now, we'll just check format - in production, store in cache
        return strlen($nonce) === 32 && ctype_xdigit($nonce);
    }
}
