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
        Schema::create('pendaftaran_ppdb', function (Blueprint $table) {
            $table->id();

            $table->foreignId('gelombang_ppdb_id')->constrained('gelombang_ppdb');

            // Nullable: diisi staf PPDB saat verifikasi, bukan oleh pendaftar.
            $table->foreignId('kategori_siswa_id')->nullable()->constrained('kategori_siswa');

            // Nullable, default NULL = belum diputuskan (belum ada label eksplisit
            // di CLAUDE.md untuk status "menunggu"). Hanya 'diterima' dan 'ditolak'
            // yang eksplisit disebutkan.
            $table->enum('status', ['diterima', 'ditolak'])->nullable();

            // NOTE: kolom-kolom isian formulir (nama siswa, data orang tua, alamat,
            // dll.) SENGAJA belum dibuat di sini. CLAUDE.md sendiri menyebutkan
            // "Daftar pertanyaan formulir PPDB final" masih termasuk hal yang
            // belum dikonfirmasi ke sekolah — jangan ditebak strukturnya.

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pendaftaran_ppdb');
    }
};
