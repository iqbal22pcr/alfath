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
        Schema::create('penetapan_spp', function (Blueprint $table) {
            $table->id();

            $table->foreignId('siswa_id')->constrained('siswa');
            $table->foreignId('kategori_siswa_id')->constrained('kategori_siswa');

            // NOTE: sama seperti gelombang_ppdb & kuota_kategori — tabel
            // tahun_ajaran belum ada, jadi kolom ini disimpan longgar dulu
            // tanpa FK constraint.
            $table->unsignedBigInteger('tahun_ajaran_id');

            $table->timestamps();

            $table->unique(['siswa_id', 'tahun_ajaran_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('penetapan_spp');
    }
};
