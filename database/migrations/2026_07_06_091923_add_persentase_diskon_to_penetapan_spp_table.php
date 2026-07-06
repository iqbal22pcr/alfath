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
        Schema::table('penetapan_spp', function (Blueprint $table) {
            // Snapshot persentase diskon PADA SAAT penetapan dibuat — bukan
            // referensi live ke kategori_siswa.persentase_diskon. Kalkulasi
            // tagihan harus selalu pakai kolom ini, bukan join ke kategori_siswa,
            // supaya perubahan diskon kategori di kemudian hari tidak mengubah
            // penetapan siswa yang sudah ada.
            $table->unsignedTinyInteger('persentase_diskon')->after('kategori_siswa_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('penetapan_spp', function (Blueprint $table) {
            $table->dropColumn('persentase_diskon');
        });
    }
};
