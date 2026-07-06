<?php

namespace App\Http\Controllers\Keuangan;

use App\Http\Controllers\Controller;
use App\Models\Siswa;
use Inertia\Inertia;
use Inertia\Response;

class SiswaController extends Controller
{
    /**
     * Daftar semua siswa untuk staf keuangan.
     */
    public function index(): Response
    {
        $siswa = Siswa::with('pendaftaranPpdb.user')
            ->latest()
            ->get()
            ->map(fn (Siswa $s) => [
                'id' => $s->id,
                // Belum ada nama siswa di skema manapun — yang ditampilkan
                // adalah nama WALI MURID (akun yang membuat pendaftaran),
                // diberi label eksplisit supaya tidak disalahpahami sebagai
                // nama anak.
                'nama_wali' => $s->pendaftaranPpdb?->user?->name,
                'status' => $s->status,
            ]);

        return Inertia::render('keuangan/siswa/index', [
            'siswa' => $siswa,
        ]);
    }

    /**
     * Detail tagihan satu siswa untuk staf keuangan mencatat pembayaran.
     */
    public function show(Siswa $siswa): Response
    {
        $siswa->load('pendaftaranPpdb.user', 'tagihan.pembayaran');

        $tagihan = $siswa->tagihan->map(function ($t) {
            $totalDibayar = $t->pembayaran->sum('nominal_dibayar');

            return [
                'id' => $t->id,
                'jenis_biaya' => $t->jenis_biaya,
                'nominal' => (float) $t->nominal,
                'total_dibayar' => (float) $totalDibayar,
                'sisa' => (float) $t->nominal - $totalDibayar,
            ];
        });

        return Inertia::render('keuangan/siswa/tagihan', [
            'siswa' => [
                'id' => $siswa->id,
                'nama_wali' => $siswa->pendaftaranPpdb?->user?->name,
                'status' => $siswa->status,
            ],
            'tagihan' => $tagihan,
        ]);
    }
}
