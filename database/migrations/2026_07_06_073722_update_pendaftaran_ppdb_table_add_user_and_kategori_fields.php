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
        Schema::table('pendaftaran_ppdb', function (Blueprint $table) {
            $table->foreignId('user_id')->after('id')->constrained('users');

            // Kolom penentu kategori, diisi pendaftar saat mengisi formulir
            // ("Cara A" — kolom tetap, bukan form builder dinamis).
            $table->enum('status_ayah', ['hidup', 'meninggal'])->nullable()->after('kategori_siswa_id');
            $table->text('kondisi_ekonomi')->nullable()->after('status_ayah');
            $table->boolean('punya_saudara_sekolah')->nullable()->default(false)->after('kondisi_ekonomi');
            $table->string('nama_saudara')->nullable()->after('punya_saudara_sekolah');
        });

        Schema::table('pendaftaran_ppdb', function (Blueprint $table) {
            $table->enum('status', ['diajukan', 'diterima', 'ditolak'])->default('diajukan')->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pendaftaran_ppdb', function (Blueprint $table) {
            $table->enum('status', ['diterima', 'ditolak'])->nullable()->default(null)->change();
        });

        Schema::table('pendaftaran_ppdb', function (Blueprint $table) {
            $table->dropColumn([
                'nama_saudara',
                'punya_saudara_sekolah',
                'kondisi_ekonomi',
                'status_ayah',
            ]);
            $table->dropConstrainedForeignId('user_id');
        });
    }
};
