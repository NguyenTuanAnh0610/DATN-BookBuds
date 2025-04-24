<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('promotions', function (Blueprint $table) {
            $table->id('promotion_id');
            $table->text('description')->nullable();
            $table->enum('discount_type', ['FIXED_AMOUNT', 'PERCENT'])->nullable();
            $table->double('discount_value')->nullable();
            $table->date('end_date')->nullable();
            $table->string('promotion_name');
            $table->date('start_date')->nullable();
            $table->enum('status', ['ACTIVE', 'INACTIVE'])->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('promotions');
    }
}; 