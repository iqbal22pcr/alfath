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
        Schema::create('tagihan', function (Blueprint $table) {
            $table->id();

            $table->foreignId('siswa_id')->constrained('siswa');
            $table->enum('jenis_biaya', ['spp', 'uang_masuk_pembangunan', 'seragam', 'buku']);
            $table->unsignedTinyInteger('billing_month')->nullable();
            $table->unsignedSmallInteger('billing_year')->nullable();
            $table->decimal('nominal', 12, 2);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tagihan');
    }
};
