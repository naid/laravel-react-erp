<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TimeLog extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'action_type',
        'timestamp',
        'latitude',
        'longitude',
        'location_address',
        'active',
    ];

    protected function casts(): array
    {
        return [
            'timestamp' => 'datetime',
            'created_on' => 'datetime',
            'updated_on' => 'datetime',
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
        ];
    }

    /**
     * Get the user that owns the time log.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
