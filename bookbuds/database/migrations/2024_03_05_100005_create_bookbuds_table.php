<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('bookbuds', function (Blueprint $table) {
            $table->id();
            $table->string('author');
            $table->enum('book_type', ['PRINT']);
            $table->text('description')->nullable();
            $table->string('genre')->nullable();
            $table->string('image')->nullable();
            $table->string('language')->nullable();
            $table->double('price')->nullable();
            $table->integer('publication_year')->nullable();
            $table->string('publisher')->nullable();
            $table->string('status')->nullable();
            $table->integer('stock_quantity')->nullable();
            $table->string('title');
            $table->integer('page_count')->nullable();
            $table->double('book_weight')->nullable();
            $table->string('dimensions', 50)->nullable();
            $table->enum('cover_type', ['HARDCOVER', 'PAPERBACK'])->nullable();
            $table->string('isbn', 13)->nullable();
            $table->string('paper_type', 100)->nullable();
            $table->foreignId('categories_id')->constrained('product_category');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('bookbuds');
    }
};