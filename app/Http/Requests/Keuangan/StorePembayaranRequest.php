<?php

namespace App\Http\Requests\Keuangan;

use Illuminate\Foundation\Http\FormRequest;

class StorePembayaranRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Otorisasi role sudah ditangani middleware 'role:staf_keuangan' di route.
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
            'nominal_dibayar' => ['required', 'numeric', 'min:0.01'],
            'tanggal_bayar' => ['required', 'date'],
            'metode' => ['required', 'in:tunai,transfer'],
        ];
    }
}
