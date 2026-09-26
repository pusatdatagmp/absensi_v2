<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SettingResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'company_name' => $this->company_name,
            'office_name' => $this->office_name,

            'office_latitude' => $this->office_latitude,
            'office_longitude' => $this->office_longitude,

            'attendance_radius' => $this->attendance_radius,

            'check_in_start' => $this->check_in_start,
            'check_in_end' => $this->check_in_end,
            'work_start_time' => $this->work_start_time,
            'bonus_minutes' => $this->bonus_minutes,
            'check_out' => $this->check_out,

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}