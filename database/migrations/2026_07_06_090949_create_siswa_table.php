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
        Schema::create('siswa', function (Blueprint $table) {
            $table->id();

            // Nullable sesuai spesifikasi task ini.
            $table->foreignId('pendaftaran_ppdb_id')->nullable()->constrained('pendaftaran_ppdb');

            // NOTE: field data diri (nama, NIS, dll) SENGAJA belum dibuat —
            // menunggu finalisasi formulir PPDB. Jangan ditebak strukturnya.
            $table->enum('status', ['calon', 'aktif']);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('siswa');
    }
};
