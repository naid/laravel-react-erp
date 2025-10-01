<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Client extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'qapi_client_id',
        'name',
        'address',
        'city',
        'state',
        'postal_code',
        'country',
        'phone',
        'email',
        'contact_person',
        'active',
    ];

    protected function casts(): array
    {
        return [
            'created_on' => 'datetime',
            'updated_on' => 'datetime',
        ];
    }

    /**
     * Get the users for the client.
     */
    public function users()
    {
        return $this->hasMany(User::class);
    }

    /**
     * Get the personnel for the client.
     */
    public function personnel()
    {
        return $this->hasMany(Personnel::class);
    }
}
