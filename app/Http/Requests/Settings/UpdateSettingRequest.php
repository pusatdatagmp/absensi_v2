<?php

namespace App\Http\Requests\Settings;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSettingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation rules.
     */
    public function rules(): array
    {
        return [

            'company_name' => [
                'sometimes',
                'string',
                'max:255',
            ],

            'office_name' => [
                'sometimes',
                'nullable',
                'string',
                'max:255',
            ],

            'office_latitude' => [
                'sometimes',
                'numeric',
                'between:-90,90',
            ],

            'office_longitude' => [
                'sometimes',
                'numeric',
                'between:-180,180',
            ],

            'attendance_radius' => [
                'sometimes',
                'integer',
                'min:1',
            ],

            'check_in_start' => [
                'sometimes',
                'nullable',
                'date_format:H:i',
            ],

            'check_in_end' => [
                'sometimes',
                'nullable',
                'date_format:H:i',
            ],

            'work_start_time' => [
                'sometimes',
                'nullable',
                'date_format:H:i',
            ],

            'bonus_minutes' => [
                'sometimes',
                'nullable',
                'integer',
                'min:0',
            ],

            'check_out' => [
                'sometimes',
                'nullable',
                'date_format:H:i',
            ],
        ];
    }
}
