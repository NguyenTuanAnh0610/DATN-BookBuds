<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $table = 'product_category';
    
    protected $fillable = [
        'name'
    ];

    public function books(): HasMany
    {
        return $this->hasMany(Book::class, 'categories_id');
    }
} 