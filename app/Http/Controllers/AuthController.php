<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\User;
use App\Models\Role;
use App\Services\CookieSecurityService;

class AuthController extends Controller
{
    /**
     * Handle user login
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($request->only('email', 'password'))) {
            $user = Auth::user();
            $token = $user->createToken('auth-token')->plainTextToken;
            
            // Get client information
            $client = $user->client_id ? \App\Models\Client::find($user->client_id) : null;
            
            $response = response()->json([
                'message' => 'Login successful',
                'user' => [
                    'id' => $user->id,
                    'email' => $user->email,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'client_id' => $user->client_id,
                    'roles' => $user->roles,
                ],
                'client' => $client ? [
                    'id' => $client->id,
                    'name' => $client->name,
                    'email' => $client->email,
                ] : null,
                'token' => $token,
            ]);
            
            // Set secure client cookies if client exists
            if ($client) {
                $secureClientData = CookieSecurityService::createSecureClientCookie([
                    'id' => $client->id,
                    'name' => $client->name,
                    'email' => $client->email,
                    'user_id' => $user->id,
                    'nonce' => CookieSecurityService::generateNonce(),
                ]);
                
                $response->cookie(
                    'client_data',
                    $secureClientData['client_data'],
                    60 * 24 * 7, // 7 days
                    '/',
                    null,
                    true, // secure
                    true, // httpOnly
                    false,
                    'Lax'
                );
            }
            
            return $response;
        }

        throw ValidationException::withMessages([
            'email' => ['The provided credentials are incorrect.'],
        ]);
    }

    /**
     * Handle user logout
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout successful',
        ]);
    }

    /**
     * Get the authenticated user
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();
        
        // Get client information
        $client = $user->client_id ? \App\Models\Client::find($user->client_id) : null;
        
        return response()->json([
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'client_id' => $user->client_id,
                'roles' => $user->roles,
            ],
            'client' => $client ? [
                'id' => $client->id,
                'name' => $client->name,
                'email' => $client->email,
            ] : null,
        ]);
    }

    /**
     * Get client information from secure cookie
     */
    public function getClientInfo(Request $request): JsonResponse
    {
        // First try to get from middleware (if available)
        $client = $request->attributes->get('validated_client');
        
        // If not available, get from authenticated user
        if (!$client && Auth::check()) {
            $user = Auth::user();
            if ($user->client_id) {
                $client = \App\Models\Client::find($user->client_id);
            }
        }
        
        if (!$client) {
            return response()->json([
                'error' => 'No valid client found'
            ], 404);
        }
        
        return response()->json([
            'client' => [
                'id' => $client->id,
                'name' => $client->name,
                'email' => $client->email,
            ]
        ]);
    }

    /**
     * Create a new user (for testing purposes)
     */
    public function register(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8',
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
        ]);

        $user = User::create([
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'client_id' => 0,
            'active' => '1',
        ]);

        // Assign default role (Viewer)
        $viewerRole = Role::where('name', 'Viewer')->first();
        if ($viewerRole) {
            $user->roles()->attach($viewerRole->id);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'User created successfully',
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'roles' => $user->roles,
            ],
            'token' => $token,
        ], 201);
    }
}
