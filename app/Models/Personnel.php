<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Personnel extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'qapi_personnel_id',
        'qapi_client_id',
        'client_id',
        'user_id',
        'first_name',
        'last_name',
        'email',
        'phone_number',
        'position',
        'department',
        'hire_date',
        'active',
    ];

    protected function casts(): array
    {
        return [
            'created_on' => 'datetime',
            'updated_on' => 'datetime',
            'hire_date' => 'date',
        ];
    }

    /**
     * Get the user that owns the personnel record.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the client that owns the personnel record.
     */
    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}
