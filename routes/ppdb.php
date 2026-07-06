<?php

use App\Http\Controllers\Ppdb\PendaftaranPpdbController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:staf_ppdb'])->group(function () {
    Route::patch('ppdb/pendaftaran/{pendaftaran}/verifikasi', [PendaftaranPpdbController::class, 'verifikasi'])
        ->name('ppdb.pendaftaran.verifikasi');
});
