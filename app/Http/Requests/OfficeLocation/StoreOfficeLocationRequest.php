<?php

namespace App\Http\Requests\OfficeLocation;

use Illuminate\Foundation\Http\FormRequest;

class StoreOfficeLocationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [

            'name' => [
                'required',
                'string',
                'max:100',
            ],

            'address' => [
                'nullable',
                'string',
                'max:255',
            ],

            'latitude' => [
                'required',
                'numeric',
                'between:-90,90',
            ],

            'longitude' => [
                'required',
                'numeric',
                'between:-180,180',
            ],

            'radius' => [
                'required',
                'integer',
                'min:1',
            ],

            'is_active' => [
                'required',
                'boolean',
            ],
        ];
    }

    public function messages(): array
    {
        return [

            'name.required' => 'Nama lokasi wajib diisi.',

            'latitude.required' => 'Latitude wajib diisi.',
            'latitude.between' => 'Latitude tidak valid.',

            'longitude.required' => 'Longitude wajib diisi.',
            'longitude.between' => 'Longitude tidak valid.',

            'radius.required' => 'Radius wajib diisi.',
            'radius.min' => 'Radius minimal 1 meter.',
        ];
    }
}