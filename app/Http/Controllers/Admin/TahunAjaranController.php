<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTahunAjaranRequest;
use App\Models\TahunAjaran;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TahunAjaranController extends Controller
{
    /**
     * Daftar semua tahun ajaran.
     */
    public function index(): Response
    {
        $tahunAjaran = TahunAjaran::orderByDesc('tanggal_mulai')
            ->get()
            ->map(fn (TahunAjaran $t) => [
                'id' => $t->id,
                'nama' => $t->nama,
                'tanggal_mulai' => $t->tanggal_mulai->format('d/m/Y'),
                'tanggal_selesai' => $t->tanggal_selesai->format('d/m/Y'),
                'aktif' => $t->aktif,
            ]);

        return Inertia::render('admin/tahun-ajaran/index', [
            'tahunAjaran' => $tahunAjaran,
        ]);
    }

    /**
     * Form tambah tahun ajaran baru.
     */
    public function create(): Response
    {
        return Inertia::render('admin/tahun-ajaran/create');
    }

    /**
     * Simpan tahun ajaran baru. Selalu dibuat tidak aktif — mengaktifkan
     * dilakukan lewat aksi terpisah "Jadikan Aktif".
     */
    public function store(StoreTahunAjaranRequest $request): RedirectResponse
    {
        TahunAjaran::create([
            ...$request->validated(),
            'aktif' => false,
        ]);

        return redirect()->route('admin.tahun-ajaran.index')->with('success', 'Tahun ajaran berhasil ditambahkan.');
    }

    /**
     * Jadikan satu tahun ajaran aktif. Guard "hanya satu yang aktif" ada
     * di model event TahunAjaran::booted(), bukan di sini.
     */
    public function aktifkan(TahunAjaran $tahunAjaran): RedirectResponse
    {
        $tahunAjaran->update(['aktif' => true]);

        return redirect()->route('admin.tahun-ajaran.index')
            ->with('success', "Tahun ajaran {$tahunAjaran->nama} sekarang aktif.");
    }
}
