<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TahunAjaran extends Model
{
    protected $table = 'tahun_ajaran';

    protected $fillable = [
        'nama',
        'tanggal_mulai',
        'tanggal_selesai',
        'aktif',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_mulai' => 'date',
            'tanggal_selesai' => 'date',
            'aktif' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        // Guard di level aplikasi (bukan DB constraint): hanya boleh satu
        // tahun_ajaran aktif dalam satu waktu. Pakai query builder ->update()
        // (bukan Eloquent) supaya tidak memicu event ini lagi secara berantai
        // untuk baris-baris yang di-nonaktifkan.
        static::saved(function (TahunAjaran $tahunAjaran) {
            if ($tahunAjaran->aktif) {
                static::where('id', '!=', $tahunAjaran->id)
                    ->where('aktif', true)
                    ->update(['aktif' => false]);
            }
        });
    }

    public function gelombangPpdb(): HasMany
    {
        return $this->hasMany(GelombangPpdb::class);
    }

    public function kuotaKategori(): HasMany
    {
        return $this->hasMany(KuotaKategori::class);
    }

    public function penetapanSpp(): HasMany
    {
        return $this->hasMany(PenetapanSpp::class);
    }
}
