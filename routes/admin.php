<?php

use App\Http\Controllers\Admin\TahunAjaranController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('admin/tahun-ajaran', [TahunAjaranController::class, 'index'])
        ->name('admin.tahun-ajaran.index');

    Route::get('admin/tahun-ajaran/create', [TahunAjaranController::class, 'create'])
        ->name('admin.tahun-ajaran.create');

    Route::post('admin/tahun-ajaran', [TahunAjaranController::class, 'store'])
        ->name('admin.tahun-ajaran.store');

    Route::patch('admin/tahun-ajaran/{tahunAjaran}/aktifkan', [TahunAjaranController::class, 'aktifkan'])
        ->name('admin.tahun-ajaran.aktifkan');
});
