<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PendaftaranPpdb extends Model
{
    protected $table = 'pendaftaran_ppdb';

    protected $fillable = [
        'user_id',
        'gelombang_ppdb_id',
        'kategori_siswa_id',
        'status_ayah',
        'kondisi_ekonomi',
        'punya_saudara_sekolah',
        'nama_saudara',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'punya_saudara_sekolah' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function gelombangPpdb(): BelongsTo
    {
        return $this->belongsTo(GelombangPpdb::class);
    }

    public function kategoriSiswa(): BelongsTo
    {
        return $this->belongsTo(KategoriSiswa::class);
    }

    public function dokumenPpdb(): HasMany
    {
        return $this->hasMany(DokumenPpdb::class);
    }
}
