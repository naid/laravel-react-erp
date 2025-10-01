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
        // Add client_id to sessions table
        Schema::table('sessions', function (Blueprint $table) {
            $table->integer('client_id')->default(0)->after('id');
            $table->index('client_id');
        });

        // Add client_id to personal_access_tokens table
        Schema::table('personal_access_tokens', function (Blueprint $table) {
            $table->integer('client_id')->default(0)->after('id');
            $table->index('client_id');
        });

        // Add client_id to jobs table
        Schema::table('jobs', function (Blueprint $table) {
            $table->integer('client_id')->default(0)->after('id');
            $table->index('client_id');
        });

        // Add client_id to job_batches table
        Schema::table('job_batches', function (Blueprint $table) {
            $table->integer('client_id')->default(0)->after('id');
            $table->index('client_id');
        });

        // Add client_id to failed_jobs table
        Schema::table('failed_jobs', function (Blueprint $table) {
            $table->integer('client_id')->default(0)->after('id');
            $table->index('client_id');
        });

        // Note: cache and cache_locks tables are system tables and don't need client_id
        // password_reset_tokens table is also a system table and doesn't need client_id
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove client_id from sessions table
        Schema::table('sessions', function (Blueprint $table) {
            $table->dropIndex(['client_id']);
            $table->dropColumn('client_id');
        });

        // Remove client_id from personal_access_tokens table
        Schema::table('personal_access_tokens', function (Blueprint $table) {
            $table->dropIndex(['client_id']);
            $table->dropColumn('client_id');
        });

        // Remove client_id from jobs table
        Schema::table('jobs', function (Blueprint $table) {
            $table->dropIndex(['client_id']);
            $table->dropColumn('client_id');
        });

        // Remove client_id from job_batches table
        Schema::table('job_batches', function (Blueprint $table) {
            $table->dropIndex(['client_id']);
            $table->dropColumn('client_id');
        });

        // Remove client_id from failed_jobs table
        Schema::table('failed_jobs', function (Blueprint $table) {
            $table->dropIndex(['client_id']);
            $table->dropColumn('client_id');
        });
    }
};