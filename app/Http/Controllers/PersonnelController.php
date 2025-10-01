<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Personnel;
use Illuminate\Support\Facades\Auth;

class PersonnelController extends Controller
{
    /**
     * Get all personnel for the authenticated user's client
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            
            // Get personnel for the user's client_id
            $personnel = Personnel::where('client_id', $user->client_id)
                ->where('active', '1')
                ->orderBy('created_on', 'desc')
                ->get();
            
            // Transform the data to match frontend expectations
            $transformedPersonnel = $personnel->map(function ($person) {
                return [
                    'id' => $person->id,
                    'first_name' => $person->first_name,
                    'last_name' => $person->last_name,
                    'email' => $person->email ?? 'N/A',
                    'position' => $person->position ?? 'N/A',
                    'department' => $person->department ?? 'General',
                    'hire_date' => $person->hire_date ? $person->hire_date->format('Y-m-d') : 'N/A',
                    'salary' => $person->salary ?? 0,
                    'status' => $person->active === '1' ? 'active' : 'inactive',
                    'phone' => $person->phone ?? 'N/A',
                    'address' => $person->address ?? 'N/A',
                ];
            });
            
            return response()->json([
                'personnel' => $transformedPersonnel,
                'total' => $transformedPersonnel->count(),
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch personnel',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Create a new personnel
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            
            $request->validate([
                'first_name' => 'required|string|max:100',
                'last_name' => 'required|string|max:100',
                'email' => 'nullable|email|max:255',
                'position' => 'nullable|string|max:100',
                'department' => 'nullable|string|max:100',
                'hire_date' => 'nullable|date',
                'salary' => 'nullable|numeric|min:0',
                'phone' => 'nullable|string|max:25',
                'address' => 'nullable|string',
            ]);
            
            $personnel = Personnel::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'position' => $request->position,
                'department' => $request->department,
                'hire_date' => $request->hire_date,
                'salary' => $request->salary,
                'phone' => $request->phone,
                'address' => $request->address,
                'client_id' => $user->client_id,
                'active' => '1',
                'created_by' => $user->id,
                'updated_by' => $user->id,
            ]);
            
            return response()->json([
                'message' => 'Personnel created successfully',
                'personnel' => [
                    'id' => $personnel->id,
                    'first_name' => $personnel->first_name,
                    'last_name' => $personnel->last_name,
                    'email' => $personnel->email,
                    'position' => $personnel->position,
                    'department' => $personnel->department,
                    'hire_date' => $personnel->hire_date ? $personnel->hire_date->format('Y-m-d') : null,
                    'salary' => $personnel->salary,
                    'status' => 'active',
                ]
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to create personnel',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Update personnel
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $user = Auth::user();
            
            $personnel = Personnel::where('id', $id)
                ->where('client_id', $user->client_id)
                ->where('active', '1')
                ->first();
                
            if (!$personnel) {
                return response()->json([
                    'error' => 'Personnel not found'
                ], 404);
            }
            
            $request->validate([
                'first_name' => 'required|string|max:100',
                'last_name' => 'required|string|max:100',
                'email' => 'nullable|email|max:255',
                'position' => 'nullable|string|max:100',
                'department' => 'nullable|string|max:100',
                'hire_date' => 'nullable|date',
                'salary' => 'nullable|numeric|min:0',
                'phone' => 'nullable|string|max:25',
                'address' => 'nullable|string',
            ]);
            
            $personnel->update([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'position' => $request->position,
                'department' => $request->department,
                'hire_date' => $request->hire_date,
                'salary' => $request->salary,
                'phone' => $request->phone,
                'address' => $request->address,
                'updated_by' => $user->id,
            ]);
            
            return response()->json([
                'message' => 'Personnel updated successfully',
                'personnel' => [
                    'id' => $personnel->id,
                    'first_name' => $personnel->first_name,
                    'last_name' => $personnel->last_name,
                    'email' => $personnel->email,
                    'position' => $personnel->position,
                    'department' => $personnel->department,
                    'hire_date' => $personnel->hire_date ? $personnel->hire_date->format('Y-m-d') : null,
                    'salary' => $personnel->salary,
                    'status' => $personnel->active === '1' ? 'active' : 'inactive',
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to update personnel',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Delete personnel
     */
    public function destroy($id): JsonResponse
    {
        try {
            $user = Auth::user();
            
            $personnel = Personnel::where('id', $id)
                ->where('client_id', $user->client_id)
                ->where('active', '1')
                ->first();
                
            if (!$personnel) {
                return response()->json([
                    'error' => 'Personnel not found'
                ], 404);
            }
            
            // Soft delete by setting active to 0
            $personnel->update([
                'active' => '0',
                'updated_by' => $user->id,
            ]);
            
            return response()->json([
                'message' => 'Personnel deleted successfully'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to delete personnel',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}