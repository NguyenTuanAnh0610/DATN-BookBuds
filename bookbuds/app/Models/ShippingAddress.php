<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @OA\Schema(
 *     schema="ShippingAddress",
 *     required={"user_id", "address", "city", "postal_code", "country"},
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="user_id", type="integer", example=1),
 *     @OA\Property(property="address", type="string", example="123 Main St"),
 *     @OA\Property(property="city", type="string", example="New York"),
 *     @OA\Property(property="state", type="string", nullable=true, example="NY"),
 *     @OA\Property(property="postal_code", type="string", example="10001"),
 *     @OA\Property(property="country", type="string", example="USA"),
 *     @OA\Property(property="phone", type="string", nullable=true, example="1234567890"),
 *     @OA\Property(property="is_default", type="boolean", example=true),
 *     @OA\Property(property="created_at", type="string", format="datetime", example="2024-03-05 12:00:00"),
 *     @OA\Property(property="updated_at", type="string", format="datetime", example="2024-03-05 12:00:00")
 * )
 */
class ShippingAddress extends Model
{
    protected $fillable = [
        'user_id',
        'address_line',
        'city',
        'state',
        'postal_code',
        'country',
        'phone',
        'is_default'
    ];

    protected $casts = [
        'is_default' => 'boolean'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
} 