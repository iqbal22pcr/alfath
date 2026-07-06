<?php

namespace App\Http\Requests\Ppdb;

use Illuminate\Foundation\Http\FormRequest;

class StorePendaftaranPpdbRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Otorisasi role sudah ditangani middleware 'role:wali_murid' di route.
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // Format file: mime & ukuran maks belum diatur eksplisit di brief —
        // dipilih nilai wajar untuk scan dokumen (foto/pdf, maks 2MB).
        $fileRule = ['file', 'mimes:pdf,jpg,jpeg,png', 'max:2048'];

        return [
            'status_ayah' => ['required', 'in:hidup,meninggal'],
            // Nullable: tidak semua pendaftar kategori Reguler perlu mengisi
            // kondisi ekonomi, dan brief tidak menyatakan ini wajib.
            'kondisi_ekonomi' => ['nullable', 'string', 'max:1000'],
            'punya_saudara_sekolah' => ['required', 'boolean'],
            'nama_saudara' => ['required_if:punya_saudara_sekolah,1', 'nullable', 'string', 'max:255'],

            'akta_kelahiran' => ['required', ...$fileRule],
            'kartu_keluarga' => ['required', ...$fileRule],
            'ktp_orangtua' => ['required', ...$fileRule],
            'pas_foto' => ['required', ...$fileRule],
            'surat_kematian_ayah' => ['required_if:status_ayah,meninggal', 'nullable', ...$fileRule],
            'surat_kematian_tidak_mampu' => ['nullable', ...$fileRule],
        ];
    }
}
