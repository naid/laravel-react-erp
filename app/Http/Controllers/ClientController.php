<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Client;
use Illuminate\Support\Facades\Auth;

class ClientController extends Controller
{
    /**
     * Get all clients for the authenticated user's client
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            
            // Get all active clients (since clients table doesn't have client_id)
            // In a multi-tenant system, you might want to filter by user's organization
            $clients = Client::where('active', '1')
                ->orderBy('created_on', 'desc')
                ->get();
            
            // Transform the data to match frontend expectations
            $transformedClients = $clients->map(function ($client) {
                return [
                    'id' => $client->id,
                    'company_name' => $client->name,
                    'contact_person' => $client->contact_person ?? 'N/A',
                    'email' => $client->email ?? 'N/A',
                    'phone' => $client->phone ?? 'N/A',
                    'address' => $client->address ?? 'N/A',
                    'city' => $client->city ?? 'N/A',
                    'state' => $client->state ?? 'N/A',
                    'postal_code' => $client->postal_code ?? 'N/A',
                    'country' => $client->country ?? 'N/A',
                    'industry' => 'General', // Default since we don't have industry field
                    'status' => $client->active === '1' ? 'active' : 'inactive',
                    'created_date' => $client->created_on ? $client->created_on->format('Y-m-d') : 'N/A',
                    'last_contact' => $client->updated_on ? $client->updated_on->format('Y-m-d') : 'N/A',
                    'total_projects' => 0, // We'll add this later when we have projects
                    'total_revenue' => 0, // We'll add this later when we have revenue tracking
                ];
            });
            
            return response()->json([
                'clients' => $transformedClients,
                'total' => $transformedClients->count(),
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch clients',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Create a new client
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            
            $request->validate([
                'company_name' => 'required|string|max:255',
                'contact_person' => 'nullable|string|max:150',
                'email' => 'nullable|email|max:255',
                'phone' => 'nullable|string|max:25',
                'address' => 'nullable|string',
                'city' => 'nullable|string|max:150',
                'state' => 'nullable|string|max:100',
                'postal_code' => 'nullable|string|max:25',
                'country' => 'nullable|string|max:150',
            ]);
            
            $client = Client::create([
                'name' => $request->company_name,
                'contact_person' => $request->contact_person,
                'email' => $request->email,
                'phone' => $request->phone,
                'address' => $request->address,
                'city' => $request->city,
                'state' => $request->state,
                'postal_code' => $request->postal_code,
                'country' => $request->country,
                'active' => '1',
                'created_by' => $user->id,
                'updated_by' => $user->id,
            ]);
            
            return response()->json([
                'message' => 'Client created successfully',
                'client' => [
                    'id' => $client->id,
                    'company_name' => $client->name,
                    'contact_person' => $client->contact_person,
                    'email' => $client->email,
                    'phone' => $client->phone,
                    'address' => $client->address,
                    'city' => $client->city,
                    'state' => $client->state,
                    'postal_code' => $client->postal_code,
                    'country' => $client->country,
                    'status' => 'active',
                    'created_date' => $client->created_on->format('Y-m-d'),
                ]
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to create client',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Update a client
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $user = Auth::user();
            
            $client = Client::where('id', $id)
                ->where('active', '1')
                ->first();
                
            if (!$client) {
                return response()->json([
                    'error' => 'Client not found'
                ], 404);
            }
            
            $request->validate([
                'company_name' => 'required|string|max:255',
                'contact_person' => 'nullable|string|max:150',
                'email' => 'nullable|email|max:255',
                'phone' => 'nullable|string|max:25',
                'address' => 'nullable|string',
                'city' => 'nullable|string|max:150',
                'state' => 'nullable|string|max:100',
                'postal_code' => 'nullable|string|max:25',
                'country' => 'nullable|string|max:150',
            ]);
            
            $client->update([
                'name' => $request->company_name,
                'contact_person' => $request->contact_person,
                'email' => $request->email,
                'phone' => $request->phone,
                'address' => $request->address,
                'city' => $request->city,
                'state' => $request->state,
                'postal_code' => $request->postal_code,
                'country' => $request->country,
                'updated_by' => $user->id,
            ]);
            
            return response()->json([
                'message' => 'Client updated successfully',
                'client' => [
                    'id' => $client->id,
                    'company_name' => $client->name,
                    'contact_person' => $client->contact_person,
                    'email' => $client->email,
                    'phone' => $client->phone,
                    'address' => $client->address,
                    'city' => $client->city,
                    'state' => $client->state,
                    'postal_code' => $client->postal_code,
                    'country' => $client->country,
                    'status' => $client->active === '1' ? 'active' : 'inactive',
                    'created_date' => $client->created_on->format('Y-m-d'),
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to update client',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Delete a client
     */
    public function destroy($id): JsonResponse
    {
        try {
            $user = Auth::user();
            
            $client = Client::where('id', $id)
                ->where('active', '1')
                ->first();
                
            if (!$client) {
                return response()->json([
                    'error' => 'Client not found'
                ], 404);
            }
            
            // Soft delete by setting active to 0
            $client->update([
                'active' => '0',
                'updated_by' => $user->id,
            ]);
            
            return response()->json([
                'message' => 'Client deleted successfully'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to delete client',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}