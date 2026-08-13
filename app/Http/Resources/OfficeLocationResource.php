<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OfficeLocationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string,mixed>
     */
    public function toArray(Request $request): array
    {
        return [

            'id' => $this->id,

            'name' => $this->name,

            'address' => $this->address,

            'latitude' => (float) $this->latitude,

            'longitude' => (float) $this->longitude,

            'radius' => $this->radius,

            'is_active' => $this->is_active,

            'created_at' => $this->created_at?->format('d M Y H:i'),
        ];
    }
}