<?php

namespace App\Http\Requests\Ppdb;

use Illuminate\Foundation\Http\FormRequest;

class VerifikasiPendaftaranPpdbRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Otorisasi role sudah ditangani middleware 'role:staf_ppdb' di route.
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'status' => ['required', 'in:diterima,ditolak'],
            'kategori_siswa_id' => ['required_if:status,diterima', 'nullable', 'exists:kategori_siswa,id'],
        ];
    }
}
