<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $roles = [
            'admin' => 'Admin',
            'kepala_sekolah' => 'Kepala Sekolah',
            'guru' => 'Guru',
            'staf_keuangan' => 'Staf Keuangan',
            'staf_ppdb' => 'Staf PPDB',
            'wali_murid' => 'Wali Murid',
        ];

        foreach ($roles as $role => $name) {
            User::factory()->create([
                'name' => $name,
                'email' => "{$role}@alfath.test",
                'role' => $role,
            ]);
        }

        $this->call(KategoriSiswaSeeder::class);
    }
}
