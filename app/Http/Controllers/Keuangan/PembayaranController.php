<?php

namespace App\Http\Controllers\Keuangan;

use App\Http\Controllers\Controller;
use App\Http\Requests\Keuangan\StorePembayaranRequest;
use App\Models\Pembayaran;
use App\Models\Siswa;
use App\Models\Tagihan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PembayaranController extends Controller
{
    /**
     * Catat satu pembayaran untuk satu tagihan.
     */
    public function store(StorePembayaranRequest $request, Tagihan $tagihan): RedirectResponse
    {
        $validated = $request->validated();

        $totalDibayarSaatIni = $tagihan->pembayaran()->sum('nominal_dibayar');
        $sisa = (float) $tagihan->nominal - (float) $totalDibayarSaatIni;

        // Validasi umum (semua jenis_biaya): jangan sampai overpay/double-catat.
        if ($validated['nominal_dibayar'] > $sisa) {
            throw ValidationException::withMessages([
                'nominal_dibayar' => 'Nominal melebihi sisa tagihan (sisa: Rp'.number_format($sisa, 0, ',', '.').').',
            ]);
        }

        // Validasi khusus Seragam & Buku: harus lunas penuh sekali input,
        // tidak boleh dicicil (beda dari Uang Masuk/Pembangunan & SPP).
        if (in_array($tagihan->jenis_biaya, ['seragam', 'buku'], true) && abs($validated['nominal_dibayar'] - $sisa) > 0.0001) {
            throw ValidationException::withMessages([
                'nominal_dibayar' => ucfirst($tagihan->jenis_biaya).' harus dibayar penuh sekali input (sisa: Rp'.number_format($sisa, 0, ',', '.').'), tidak bisa dicicil.',
            ]);
        }

        DB::transaction(function () use ($request, $validated, $tagihan) {
            Pembayaran::create([
                'tagihan_id' => $tagihan->id,
                'nominal_dibayar' => $validated['nominal_dibayar'],
                'tanggal_bayar' => $validated['tanggal_bayar'],
                'metode' => $validated['metode'],
                'dicatat_oleh' => $request->user()->id,
            ]);

            $siswa = $tagihan->siswa;

            if ($siswa->status === 'calon' && $this->seragamDanBukuLunas($siswa)) {
                $siswa->update(['status' => 'aktif']);
            }
        });

        return back()->with('success', 'Pembayaran berhasil dicatat.');
    }

    /**
     * Trigger otomatis calon -> aktif: cek SEMUA tagihan Seragam DAN Buku
     * milik siswa ini sudah lunas penuh (Uang Masuk boleh masih berjalan).
     *
     * Sengaja mensyaratkan minimal satu tagihan per jenis harus ADA — kalau
     * tidak, siswa tanpa tagihan seragam/buku sama sekali akan lolos begitu
     * saja lewat "every()" pada koleksi kosong (vacuous truth).
     */
    private function seragamDanBukuLunas(Siswa $siswa): bool
    {
        foreach (['seragam', 'buku'] as $jenis) {
            $tagihanJenis = $siswa->tagihan()->where('jenis_biaya', $jenis)->get();

            if ($tagihanJenis->isEmpty()) {
                return false;
            }

            if (! $tagihanJenis->every(fn (Tagihan $t) => $t->pembayaran()->sum('nominal_dibayar') >= $t->nominal)) {
                return false;
            }
        }

        return true;
    }
}
