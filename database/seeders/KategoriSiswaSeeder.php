<?php

namespace Database\Seeders;

use App\Models\KategoriSiswa;
use Illuminate\Database\Seeder;

class KategoriSiswaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // PLACEHOLDER: persentase_diskon di bawah ini adalah angka dummy,
        // BUKAN angka final dari sekolah. CLAUDE.md secara eksplisit menyebut
        // persentase diskon aktual per golongan masih menunggu konfirmasi ke
        // sekolah. WAJIB diganti dengan angka asli begitu tersedia.
        $kategori = [
            ['nama' => 'Reguler', 'persentase_diskon' => 0],
            ['nama' => 'Anak Asuh/Kurang Mampu', 'persentase_diskon' => 25],
            ['nama' => 'Anak Yatim', 'persentase_diskon' => 50],
            ['nama' => 'Saudara Siswa/Alumni', 'persentase_diskon' => 25],
        ];

        foreach ($kategori as $data) {
            KategoriSiswa::create($data);
        }
    }
}
