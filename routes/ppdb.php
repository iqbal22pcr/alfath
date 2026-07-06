<?php

use App\Http\Controllers\Ppdb\PendaftaranPpdbController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:staf_ppdb'])->group(function () {
    Route::get('ppdb/pendaftaran', [PendaftaranPpdbController::class, 'index'])
        ->name('ppdb.pendaftaran.index');

    Route::get('ppdb/pendaftaran/{pendaftaran}/verifikasi', [PendaftaranPpdbController::class, 'show'])
        ->name('ppdb.pendaftaran.show');

    Route::patch('ppdb/pendaftaran/{pendaftaran}/verifikasi', [PendaftaranPpdbController::class, 'verifikasi'])
        ->name('ppdb.pendaftaran.verifikasi');
});
