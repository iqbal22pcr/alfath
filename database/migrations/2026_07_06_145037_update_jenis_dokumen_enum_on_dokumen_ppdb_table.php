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
        Schema::table('dokumen_ppdb', function (Blueprint $table) {
            // Selaraskan penamaan jenis dokumen dengan istilah yang dipakai
            // di form pendaftaran wali_murid (task berikutnya): kk -> kartu_keluarga,
            // ktp_orang_tua -> ktp_orangtua, sktm -> surat_kematian_tidak_mampu.
            $table->enum('jenis_dokumen', [
                'akta_kelahiran',
                'kartu_keluarga',
                'ktp_orangtua',
                'pas_foto',
                'surat_kematian_ayah',
                'surat_kematian_tidak_mampu',
            ])->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('dokumen_ppdb', function (Blueprint $table) {
            $table->enum('jenis_dokumen', [
                'akta_kelahiran',
                'kk',
                'ktp_orang_tua',
                'pas_foto',
                'surat_kematian_ayah',
                'sktm',
            ])->change();
        });
    }
};
