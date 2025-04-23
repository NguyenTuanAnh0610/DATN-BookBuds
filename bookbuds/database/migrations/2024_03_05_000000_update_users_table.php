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
        Schema::table('users', function (Blueprint $table) {
            // Drop existing columns
            $table->dropColumn(['name', 'email_verified_at', 'remember_token']);
            
            // Add new columns
            $table->string('username')->unique()->after('id');
            $table->string('phone');
            $table->enum('role', ['USER', 'ADMIN'])->default('USER');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Reverse the changes
            $table->string('name');
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            
            $table->dropColumn(['username', 'phone', 'role']);
        });
    }
}; 