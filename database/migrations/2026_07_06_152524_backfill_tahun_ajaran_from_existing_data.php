<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Kumpulkan semua nilai tahun_ajaran_id unik yang sudah dipakai (longgar,
     * tanpa FK) di gelombang_ppdb, kuota_kategori, penetapan_spp, lalu buat
     * baris tahun_ajaran untuk tiap nilai — dengan id yang SAMA PERSIS
     * dengan nilai lama itu, supaya FK constraint di migration berikutnya
     * langsung valid tanpa perlu remapping data di 3 tabel tersebut.
     */
    public function up(): void
    {
        $tahunIds = collect()
            ->merge(DB::table('gelombang_ppdb')->whereNotNull('tahun_ajaran_id')->distinct()->pluck('tahun_ajaran_id'))
            ->merge(DB::table('kuota_kategori')->whereNotNull('tahun_ajaran_id')->distinct()->pluck('tahun_ajaran_id'))
            ->merge(DB::table('penetapan_spp')->whereNotNull('tahun_ajaran_id')->distinct()->pluck('tahun_ajaran_id'))
            ->unique()
            ->values();

        foreach ($tahunIds as $tahun) {
            if (DB::table('tahun_ajaran')->where('id', $tahun)->exists()) {
                continue;
            }

            DB::table('tahun_ajaran')->insert([
                'id' => $tahun,
                'nama' => $tahun.'/'.($tahun + 1),
                'tanggal_mulai' => $tahun.'-07-01',
                'tanggal_selesai' => ($tahun + 1).'-06-30',
                'aktif' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Sengaja tidak menghapus baris tahun_ajaran hasil backfill di sini —
        // migration berikutnya (FK constraint) akan gagal rollback kalau baris
        // ini dihapus duluan sementara FK masih menunjuk ke situ. Rollback FK
        // dulu (migration berikutnya), baru baris ini aman dihapus manual bila
        // memang diperlukan.
    }
};
