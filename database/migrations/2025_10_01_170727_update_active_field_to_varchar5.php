<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update active field to varchar(5) with default '1' for all tables
        $tables = ['users', 'clients', 'personnel', 'roles', 'time_logs', 'user_roles'];
        
        foreach ($tables as $table) {
            Schema::table($table, function (Blueprint $table) {
                $table->string('active', 5)->default('1')->change();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert active field back to varchar(12) with default '1'
        $tables = ['users', 'clients', 'personnel', 'roles', 'time_logs', 'user_roles'];
        
        foreach ($tables as $table) {
            Schema::table($table, function (Blueprint $table) {
                $table->string('active', 12)->default('1')->change();
            });
        }
    }
};