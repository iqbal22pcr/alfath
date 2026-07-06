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
        Schema::create('gelombang_ppdb', function (Blueprint $table) {
            $table->id();

            // NOTE: belum ada FK constraint ke tabel tahun_ajaran karena tabel
            // tersebut belum dibuat (domain Akademik belum dibahas di CLAUDE.md).
            // Kolom ini disimpan sebagai referensi longgar dulu — tambahkan
            // ->constrained() setelah tabel tahun_ajaran ada.
            $table->unsignedBigInteger('tahun_ajaran_id');

            $table->unsignedTinyInteger('nomor_gelombang');
            $table->date('tanggal_mulai');
            $table->date('tanggal_selesai');
            $table->decimal('tarif_uang_masuk', 12, 2);

            // NOTE: nilai yang valid untuk status belum dikonfirmasi di CLAUDE.md
            // (mis. 'buka'/'tutup' atau 'aktif'/'nonaktif') — sengaja dibuat
            // string bebas dulu, bukan enum, supaya tidak menebak nilai pastinya.
            $table->string('status');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gelombang_ppdb');
    }
};
