<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => 'Viewer',
                'description' => 'Basic view-only access',
                'active' => '1',
            ],
            [
                'name' => 'User',
                'description' => 'Standard user access',
                'active' => '1',
            ],
            [
                'name' => 'Editor',
                'description' => 'Edit access to records',
                'active' => '1',
            ],
            [
                'name' => 'Admin',
                'description' => 'Administrative access',
                'active' => '1',
            ],
            [
                'name' => 'System Admin',
                'description' => 'System-level administrative access',
                'active' => '1',
            ],
            [
                'name' => 'super_admin',
                'description' => 'Super administrator with full access',
                'active' => '1',
            ],
        ];

        foreach ($roles as $role) {
            \App\Models\Role::create($role);
        }
    }
}
