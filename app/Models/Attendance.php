<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $fillable = [
        'user_id',
        'office_location_id',
        'date',
        'check_in_time',
        'status',
        'attendance_level',
        'latitude',
        'longitude',
        'location',
        'distance',
        'check_out_time',
        'check_out_latitude',
        'check_out_longitude',
        'check_out_location',
        'check_out_distance',
        'approval_status',
        'approval_note',
        'approved_by',
        'approved_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
    public function officeLocation()
    {
        return $this->belongsTo(OfficeLocation::class);
    }
}
