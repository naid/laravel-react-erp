<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Client;
use App\Models\User;

class DefaultClientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create default client with ID 1
        $client = Client::updateOrCreate(
            ['id' => 1],
            [
                'name' => 'NaidSystems',
                'email' => 'admin@naidsystems.com',
                'phone' => '+1-555-0123',
                'address' => '123 Business Street, Suite 100',
                'city' => 'Business City',
                'state' => 'State',
                'postal_code' => '12345',
                'country' => 'United States',
                'contact_person' => 'Admin User',
                'active' => '1',
                'created_by' => 1,
                'updated_by' => 1,
            ]
        );

        // Update admin@erp.com user to have client_id = 1
        User::where('email', 'admin@erp.com')->update([
            'client_id' => 1,
        ]);

        // Also update any other users with client_id = 0 to have client_id = 1
        User::where('client_id', 0)->update([
            'client_id' => 1,
        ]);

        $this->command->info('Default client "NaidSystems" created with ID 1');
        $this->command->info('Admin user updated to client_id = 1');
    }
}