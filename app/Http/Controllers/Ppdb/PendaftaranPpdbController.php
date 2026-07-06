<?php

namespace App\Http\Controllers\Ppdb;

use App\Http\Controllers\Controller;
use App\Http\Requests\Ppdb\VerifikasiPendaftaranPpdbRequest;
use App\Models\KategoriSiswa;
use App\Models\KuotaKategori;
use App\Models\PendaftaranPpdb;
use App\Models\PenetapanSpp;
use App\Models\Siswa;
use App\Models\Tagihan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PendaftaranPpdbController extends Controller
{
    /**
     * Daftar pendaftaran PPDB yang belum diproses (status masih diajukan).
     */
    public function index(): Response
    {
        $pendaftaran = PendaftaranPpdb::with('gelombangPpdb')
            ->where('status', 'diajukan')
            ->latest()
            ->get()
            ->map(fn (PendaftaranPpdb $p) => [
                'id' => $p->id,
                'gelombang' => 'Gelombang '.$p->gelombangPpdb->nomor_gelombang.' — '.$p->gelombangPpdb->tahun_ajaran_id,
                'tanggal_daftar' => $p->created_at->format('d/m/Y'),
            ]);

        return Inertia::render('ppdb/index', [
            'pendaftaran' => $pendaftaran,
        ]);
    }

    /**
     * Form verifikasi satu pendaftaran.
     */
    public function show(PendaftaranPpdb $pendaftaran): RedirectResponse|Response
    {
        if ($pendaftaran->status !== 'diajukan') {
            return redirect()->route('ppdb.pendaftaran.index')
                ->with('success', "Pendaftaran ini sudah diproses sebelumnya (status: {$pendaftaran->status}).");
        }

        return Inertia::render('ppdb/verifikasi', [
            'pendaftaran' => [
                'id' => $pendaftaran->id,
                'gelombang' => 'Gelombang '.$pendaftaran->gelombangPpdb->nomor_gelombang.' — '.$pendaftaran->gelombangPpdb->tahun_ajaran_id,
                'tanggal_daftar' => $pendaftaran->created_at->format('d/m/Y'),
            ],
            'kategoriSiswa' => KategoriSiswa::orderBy('nama')->get(['id', 'nama']),
        ]);
    }

    /**
     * Verifikasi satu pendaftaran PPDB: staf memilih kategori DAN mengubah
     * status jadi diterima/ditolak dalam satu submission (bukan dua tahap).
     */
    public function verifikasi(VerifikasiPendaftaranPpdbRequest $request, PendaftaranPpdb $pendaftaran): RedirectResponse
    {
        // Guard: cegah proses ulang / data duplikat kalau pendaftaran ini
        // sudah pernah diputuskan sebelumnya.
        if ($pendaftaran->status !== 'diajukan') {
            throw ValidationException::withMessages([
                'status' => "Pendaftaran ini sudah diproses sebelumnya (status saat ini: {$pendaftaran->status}).",
            ]);
        }

        $validated = $request->validated();

        if ($validated['status'] === 'ditolak') {
            $pendaftaran->update(['status' => 'ditolak']);

            return redirect()->route('ppdb.pendaftaran.index')->with('success', 'Pendaftaran ditolak.');
        }

        $kategoriSiswa = KategoriSiswa::findOrFail($validated['kategori_siswa_id']);

        // tahun_ajaran_id disalin dari gelombang_ppdb milik pendaftaran ini —
        // gelombang_ppdb.tahun_ajaran_id sendiri masih kolom longgar tanpa FK
        // (tabel tahun_ajaran belum ada), tapi setidaknya konsisten dengan
        // gelombang tempat pendaftaran ini dibuat, bukan tahun kalender saat
        // verifikasi dilakukan.
        $tahunAjaranId = $pendaftaran->gelombangPpdb->tahun_ajaran_id;

        $siswa = DB::transaction(function () use ($pendaftaran, $kategoriSiswa, $tahunAjaranId) {
            $pendaftaran->update([
                'status' => 'diterima',
                'kategori_siswa_id' => $kategoriSiswa->id,
            ]);

            $siswa = Siswa::create([
                'pendaftaran_ppdb_id' => $pendaftaran->id,
                'status' => 'calon',
            ]);

            PenetapanSpp::create([
                'siswa_id' => $siswa->id,
                'kategori_siswa_id' => $kategoriSiswa->id,
                // Snapshot, bukan referensi live — lihat migration
                // add_persentase_diskon_to_penetapan_spp_table.
                'persentase_diskon' => $kategoriSiswa->persentase_diskon,
                'tahun_ajaran_id' => $tahunAjaranId,
            ]);

            $gelombang = $pendaftaran->gelombangPpdb;
            $nominalUangMasuk = round(
                $gelombang->tarif_uang_masuk * (1 - $kategoriSiswa->persentase_diskon / 100),
                2
            );

            Tagihan::create([
                'siswa_id' => $siswa->id,
                'jenis_biaya' => 'uang_masuk_pembangunan',
                'billing_month' => null,
                'billing_year' => null,
                'nominal' => $nominalUangMasuk,
            ]);

            // TODO: harga dasar Seragam belum dikonfirmasi sekolah (lihat
            // CLAUDE.md bagian "Yang Masih Perlu Dikonfirmasi ke Sekolah").
            // Nominal 0 sementara — WAJIB diganti sebelum production.
            Tagihan::create([
                'siswa_id' => $siswa->id,
                'jenis_biaya' => 'seragam',
                'billing_month' => null,
                'billing_year' => null,
                'nominal' => 0,
            ]);

            // TODO: harga dasar Buku belum dikonfirmasi sekolah. Nominal 0
            // sementara — WAJIB diganti sebelum production.
            Tagihan::create([
                'siswa_id' => $siswa->id,
                'jenis_biaya' => 'buku',
                'billing_month' => null,
                'billing_year' => null,
                'nominal' => 0,
            ]);

            return $siswa;
        });

        return redirect()->route('ppdb.pendaftaran.index')->with([
            'success' => 'Pendaftaran diterima.',
            'kuotaAlert' => $this->buildKuotaAlert($kategoriSiswa, $tahunAjaranId),
        ]);
    }

    /**
     * Alert informasional (bukan validasi/hard-block) dibandingkan
     * kuota_kategori untuk kategori + tahun ajaran terkait.
     *
     * @return array<string, mixed>
     */
    private function buildKuotaAlert(KategoriSiswa $kategoriSiswa, int $tahunAjaranId): array
    {
        $kuota = KuotaKategori::where('kategori_siswa_id', $kategoriSiswa->id)
            ->where('tahun_ajaran_id', $tahunAjaranId)
            ->first();

        $jumlahAktif = Siswa::where('status', 'aktif')
            ->whereHas('penetapanSpp', function ($query) use ($kategoriSiswa, $tahunAjaranId) {
                $query->where('kategori_siswa_id', $kategoriSiswa->id)
                    ->where('tahun_ajaran_id', $tahunAjaranId);
            })
            ->count();

        // status 'calon' == belum lunas Seragam & Buku (itu memang trigger
        // otomatis calon -> aktif), jadi tidak perlu cek pembayaran terpisah.
        $jumlahCalon = Siswa::where('status', 'calon')
            ->whereHas('penetapanSpp', function ($query) use ($kategoriSiswa, $tahunAjaranId) {
                $query->where('kategori_siswa_id', $kategoriSiswa->id)
                    ->where('tahun_ajaran_id', $tahunAjaranId);
            })
            ->count();

        return [
            'kategori' => $kategoriSiswa->nama,
            'kuota' => $kuota?->kuota,
            'aktif' => $jumlahAktif,
            'calon' => $jumlahCalon,
        ];
    }
}
