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
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->integer('qapi_client_id')->nullable();
            $table->string('name');
            $table->text('address')->nullable();
            $table->string('city', 150)->nullable();
            $table->string('state', 100)->nullable();
            $table->string('postal_code', 25)->nullable();
            $table->string('country', 150)->nullable();
            $table->string('phone', 25)->nullable();
            $table->string('email')->nullable();
            $table->string('contact_person', 150)->nullable();
            $table->timestamp('created_on')->useCurrent();
            $table->unsignedInteger('created_by')->default(1);
            $table->timestamp('updated_on')->useCurrent()->useCurrentOnUpdate();
            $table->unsignedInteger('updated_by')->nullable();
            $table->string('active', 12)->default('1');
            
            $table->index('qapi_client_id');
            $table->index('active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
