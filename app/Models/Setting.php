<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'company_name',
        'office_name',
        'office_latitude',
        'office_longitude',
        'attendance_radius',
        'check_in_start',
        'check_in_end',
        'check_out',
    ];

    protected $casts = [
        'office_latitude'   => 'float',
        'office_longitude'  => 'float',
        'attendance_radius' => 'integer',
    ];
}
