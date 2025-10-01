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
        // Add client_id to roles table
        Schema::table('roles', function (Blueprint $table) {
            $table->integer('client_id')->default(0)->after('id');
            $table->index('client_id');
        });

        // Add client_id to time_logs table
        Schema::table('time_logs', function (Blueprint $table) {
            $table->integer('client_id')->default(0)->after('id');
            $table->index('client_id');
        });

        // Add client_id to user_roles table
        Schema::table('user_roles', function (Blueprint $table) {
            $table->integer('client_id')->default(0)->after('id');
            $table->index('client_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove client_id from roles table
        Schema::table('roles', function (Blueprint $table) {
            $table->dropIndex(['client_id']);
            $table->dropColumn('client_id');
        });

        // Remove client_id from time_logs table
        Schema::table('time_logs', function (Blueprint $table) {
            $table->dropIndex(['client_id']);
            $table->dropColumn('client_id');
        });

        // Remove client_id from user_roles table
        Schema::table('user_roles', function (Blueprint $table) {
            $table->dropIndex(['client_id']);
            $table->dropColumn('client_id');
        });
    }
};