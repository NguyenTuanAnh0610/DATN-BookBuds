<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up() {
        Schema::table('bookbuds', function (Blueprint $table) {
            $table->string('preview_pdf')->nullable()->after('image'); // Thêm sau cột image
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookbuds', function (Blueprint $table) {
            //
        });
    }
};
