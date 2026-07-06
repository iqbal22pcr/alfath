<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KategoriSiswa extends Model
{
    protected $table = 'kategori_siswa';

    protected $fillable = [
        'nama',
        'persentase_diskon',
    ];

    public function kuotaKategori(): HasMany
    {
        return $this->hasMany(KuotaKategori::class);
    }

    public function pendaftaranPpdb(): HasMany
    {
        return $this->hasMany(PendaftaranPpdb::class);
    }

    public function penetapanSpp(): HasMany
    {
        return $this->hasMany(PenetapanSpp::class);
    }
}
