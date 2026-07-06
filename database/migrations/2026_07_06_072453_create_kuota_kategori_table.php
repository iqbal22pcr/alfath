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
        Schema::create('kuota_kategori', function (Blueprint $table) {
            $table->id();

            $table->foreignId('kategori_siswa_id')->constrained('kategori_siswa');

            // NOTE: sama seperti di gelombang_ppdb, tabel tahun_ajaran belum ada.
            // Kolom disimpan longgar dulu tanpa FK constraint.
            $table->unsignedBigInteger('tahun_ajaran_id');

            $table->unsignedInteger('kuota');

            $table->timestamps();

            $table->unique(['kategori_siswa_id', 'tahun_ajaran_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kuota_kategori');
    }
};
