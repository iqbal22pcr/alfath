<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GelombangPpdb extends Model
{
    protected $table = 'gelombang_ppdb';

    protected $fillable = [
        'tahun_ajaran_id',
        'nomor_gelombang',
        'tanggal_mulai',
        'tanggal_selesai',
        'tarif_uang_masuk',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_mulai' => 'date',
            'tanggal_selesai' => 'date',
            'tarif_uang_masuk' => 'decimal:2',
        ];
    }

    public function pendaftaranPpdb(): HasMany
    {
        return $this->hasMany(PendaftaranPpdb::class);
    }
}
