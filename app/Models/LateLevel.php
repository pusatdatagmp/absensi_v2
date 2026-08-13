<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LateLevel extends Model
{
    protected $fillable = [
        'label',
        'minutes',
    ];

    protected $casts = [
        'minutes' => 'integer',
    ];
}
