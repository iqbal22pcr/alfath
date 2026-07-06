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
        Schema::create('dokumen_ppdb', function (Blueprint $table) {
            $table->id();

            $table->foreignId('pendaftaran_ppdb_id')->constrained('pendaftaran_ppdb');

            // Jenis dokumen sesuai daftar wajib/kondisional di CLAUDE.md.
            // "KTP kedua orang tua" diperlakukan sebagai satu jenis dokumen
            // (sesuai penyebutan literalnya sebagai satu item dalam daftar) —
            // kalau ternyata ayah & ibu perlu 2 slot upload terpisah, enum ini
            // perlu direvisi.
            $table->enum('jenis_dokumen', [
                'akta_kelahiran',
                'kk',
                'ktp_orang_tua',
                'pas_foto',
                'surat_kematian_ayah',
                'sktm',
            ]);

            $table->string('path');

            $table->timestamps();

            $table->unique(['pendaftaran_ppdb_id', 'jenis_dokumen']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dokumen_ppdb');
    }
};
