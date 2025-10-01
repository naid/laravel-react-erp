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
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->text('description')->nullable();
            $table->timestamp('created_on')->useCurrent();
            $table->unsignedInteger('created_by')->default(1);
            $table->timestamp('updated_on')->useCurrent()->useCurrentOnUpdate();
            $table->unsignedInteger('updated_by')->nullable();
            $table->string('active', 12)->default('1');
            
            $table->unique('name');
            $table->index('active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('roles');
    }
};
