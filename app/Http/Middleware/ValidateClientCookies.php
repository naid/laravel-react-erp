<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Client;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use App\Services\CookieSecurityService;

class ValidateClientCookies
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Skip API routes entirely
        if ($request->is('api/*')) {
            return $next($request);
        }
        
        // Only validate for authenticated users
        if (Auth::check()) {
            $user = Auth::user();
            $clientDataCookie = $request->cookie('client_data');
            
            // If secure client cookie exists, validate it
            if ($clientDataCookie) {
                $clientData = CookieSecurityService::verifyClientData($clientDataCookie);
                
                if (!$clientData) {
                    // Invalid or tampered cookie - clear and redirect
                    return $this->clearInvalidCookies($request);
                }
                
                // Verify the client exists and is active
                $client = Client::where('id', $clientData['id'])
                    ->where('name', $clientData['name'])
                    ->where('active', '1')
                    ->first();
                
                if (!$client) {
                    // Invalid client data - clear cookies and redirect
                    return $this->clearInvalidCookies($request);
                }
                
                // Verify the user belongs to this client
                if ($user->client_id != $clientData['id'] || $user->id != $clientData['user_id']) {
                    // User doesn't belong to this client - clear cookies and redirect
                    return $this->clearInvalidCookies($request);
                }
                
                // Add validated client info to request
                $request->attributes->add(['validated_client' => $client]);
            } else {
                // No client cookies - this might be a fresh login
                // Load client from database and don't redirect
                if ($user->client_id) {
                    $client = Client::find($user->client_id);
                    if ($client) {
                        $request->attributes->add(['validated_client' => $client]);
                    }
                }
            }
        }
        
        return $next($request);
    }
    
    /**
     * Clear invalid cookies and redirect to login
     */
    private function clearInvalidCookies(Request $request): Response
    {
        // For API requests, return JSON error instead of redirect
        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json([
                'error' => 'Invalid client cookies',
                'message' => 'Please login again'
            ], 401);
        }
        
        // For web requests, redirect to home page (which will show login)
        $response = redirect('/');
        
        // Clear all client cookies (both old and new format)
        $response->cookie('client_id', '', -1, '/');
        $response->cookie('client_name', '', -1, '/');
        $response->cookie('client_email', '', -1, '/');
        $response->cookie('client_data', '', -1, '/');
        
        // Log the security event
        \Log::warning('Invalid client cookies detected', [
            'user_id' => Auth::id(),
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'client_data' => $request->cookie('client_data'),
        ]);
        
        return $response;
    }
}