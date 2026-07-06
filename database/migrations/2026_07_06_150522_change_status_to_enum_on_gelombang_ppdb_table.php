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
        Schema::table('gelombang_ppdb', function (Blueprint $table) {
            // Nilai 'buka'/'tutup' sudah dipakai nyata sejak fitur formulir
            // PPDB wali_murid (cek gelombangBuka() di FormulirPpdbController),
            // jadi dikunci jadi enum native — konsisten dengan kolom status
            // lain di proyek ini.
            $table->enum('status', ['buka', 'tutup'])->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('gelombang_ppdb', function (Blueprint $table) {
            $table->string('status')->change();
        });
    }
};
