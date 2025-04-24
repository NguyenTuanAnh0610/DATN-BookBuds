<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Promotion extends Model
{
    protected $primaryKey = 'promotion_id';
    
    protected $fillable = [
        'promotion_name',
        'description',
        'discount_type',
        'discount_value',
        'start_date',
        'end_date',
        'status'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'discount_type' => 'string',
        'status' => 'string'
    ];

    public function isValid(): bool
    {
        $now = now();
        return $this->status === 'ACTIVE' 
            && $now->greaterThanOrEqualTo($this->start_date)
            && $now->lessThanOrEqualTo($this->end_date);
    }
} 