<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pembayaran', function (Blueprint $table) {
            $table->id();

            $table->foreignId('tagihan_id')->constrained('tagihan');
            $table->decimal('nominal_dibayar', 12, 2);
            $table->date('tanggal_bayar');
            $table->enum('metode', ['tunai', 'transfer']);
            $table->foreignId('dicatat_oleh')->constrained('users');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pembayaran');
    }
};
