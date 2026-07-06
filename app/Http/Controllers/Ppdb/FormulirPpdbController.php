<?php

namespace App\Http\Controllers\Ppdb;

use App\Http\Controllers\Controller;
use App\Http\Requests\Ppdb\StorePendaftaranPpdbRequest;
use App\Models\DokumenPpdb;
use App\Models\GelombangPpdb;
use App\Models\PendaftaranPpdb;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class FormulirPpdbController extends Controller
{
    private const DOKUMEN_WAJIB = ['akta_kelahiran', 'kartu_keluarga', 'ktp_orangtua', 'pas_foto'];

    private const DOKUMEN_KONDISIONAL = ['surat_kematian_ayah', 'surat_kematian_tidak_mampu'];

    /**
     * Form pendaftaran PPDB. Redirect ke halaman status kalau user ini
     * sudah pernah mengisi (satu akun = satu anak).
     */
    public function create(Request $request): RedirectResponse|Response
    {
        if (PendaftaranPpdb::where('user_id', $request->user()->id)->exists()) {
            return redirect()->route('ppdb.formulir.status');
        }

        return Inertia::render('ppdb/formulir', [
            'gelombangTersedia' => $this->gelombangBuka() !== null,
        ]);
    }

    /**
     * Simpan formulir pendaftaran + dokumen yang diunggah.
     */
    public function store(StorePendaftaranPpdbRequest $request): RedirectResponse
    {
        $user = $request->user();

        // Guard pertahanan kedua (selain unique constraint di DB & redirect
        // di create()) — mis. submit ulang lewat tombol back browser.
        if (PendaftaranPpdb::where('user_id', $user->id)->exists()) {
            return redirect()->route('ppdb.formulir.status')
                ->with('success', 'Anda sudah pernah mengisi formulir pendaftaran.');
        }

        $gelombang = $this->gelombangBuka();

        if (! $gelombang) {
            throw ValidationException::withMessages([
                'gelombang' => 'Pendaftaran belum/tidak sedang dibuka saat ini.',
            ]);
        }

        $validated = $request->validated();

        DB::transaction(function () use ($request, $user, $gelombang, $validated) {
            $pendaftaran = PendaftaranPpdb::create([
                'user_id' => $user->id,
                'gelombang_ppdb_id' => $gelombang->id,
                'status_ayah' => $validated['status_ayah'],
                'kondisi_ekonomi' => $validated['kondisi_ekonomi'] ?? null,
                'punya_saudara_sekolah' => $validated['punya_saudara_sekolah'],
                'nama_saudara' => $validated['nama_saudara'] ?? null,
                // kategori_siswa_id tetap null — diisi staf PPDB saat verifikasi.
                // status default 'diajukan' dari kolom DB.
            ]);

            foreach ([...self::DOKUMEN_WAJIB, ...self::DOKUMEN_KONDISIONAL] as $jenis) {
                if (! $request->hasFile($jenis)) {
                    continue;
                }

                $path = $request->file($jenis)->store("dokumen-ppdb/{$pendaftaran->id}", 'public');

                DokumenPpdb::create([
                    'pendaftaran_ppdb_id' => $pendaftaran->id,
                    'jenis_dokumen' => $jenis,
                    'path' => $path,
                ]);
            }
        });

        return redirect()->route('ppdb.formulir.status')->with('success', 'Formulir pendaftaran berhasil dikirim.');
    }

    /**
     * Halaman status sederhana: data yang sudah disubmit + status verifikasi.
     */
    public function status(Request $request): RedirectResponse|Response
    {
        $pendaftaran = PendaftaranPpdb::with(['gelombangPpdb', 'dokumenPpdb'])
            ->where('user_id', $request->user()->id)
            ->first();

        if (! $pendaftaran) {
            return redirect()->route('ppdb.formulir.create');
        }

        return Inertia::render('ppdb/status', [
            'pendaftaran' => [
                'id' => $pendaftaran->id,
                'status' => $pendaftaran->status,
                'status_ayah' => $pendaftaran->status_ayah,
                'kondisi_ekonomi' => $pendaftaran->kondisi_ekonomi,
                'punya_saudara_sekolah' => $pendaftaran->punya_saudara_sekolah,
                'nama_saudara' => $pendaftaran->nama_saudara,
                'gelombang' => 'Gelombang '.$pendaftaran->gelombangPpdb->nomor_gelombang.' — '.$pendaftaran->gelombangPpdb->tahun_ajaran_id,
                'dokumen' => $pendaftaran->dokumenPpdb->pluck('jenis_dokumen'),
            ],
        ]);
    }

    private function gelombangBuka(): ?GelombangPpdb
    {
        return GelombangPpdb::where('status', 'buka')
            ->whereDate('tanggal_mulai', '<=', now())
            ->whereDate('tanggal_selesai', '>=', now())
            ->first();
    }
}
