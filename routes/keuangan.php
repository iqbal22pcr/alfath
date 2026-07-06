<?php

use App\Http\Controllers\Keuangan\PembayaranController;
use App\Http\Controllers\Keuangan\SiswaController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:staf_keuangan'])->group(function () {
    Route::get('keuangan/siswa', [SiswaController::class, 'index'])
        ->name('keuangan.siswa.index');

    Route::get('keuangan/siswa/{siswa}/tagihan', [SiswaController::class, 'show'])
        ->name('keuangan.siswa.tagihan');

    Route::post('keuangan/tagihan/{tagihan}/pembayaran', [PembayaranController::class, 'store'])
        ->name('keuangan.tagihan.pembayaran.store');
});
