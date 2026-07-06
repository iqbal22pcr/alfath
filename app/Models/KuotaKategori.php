<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KuotaKategori extends Model
{
    protected $table = 'kuota_kategori';

    protected $fillable = [
        'kategori_siswa_id',
        'tahun_ajaran_id',
        'kuota',
    ];

    public function kategoriSiswa(): BelongsTo
    {
        return $this->belongsTo(KategoriSiswa::class);
    }
}
