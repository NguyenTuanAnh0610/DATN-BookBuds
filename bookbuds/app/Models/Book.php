<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @OA\Schema(
 *     schema="Book",
 *     required={"title", "author", "book_type", "categories_id"},
 *     @OA\Property(property="id", type="integer"),
 *     @OA\Property(property="title", type="string"),
 *     @OA\Property(property="author", type="string"),
 *     @OA\Property(property="book_type", type="string", enum={"PRINT"}),
 *     @OA\Property(property="description", type="string"),
 *     @OA\Property(property="genre", type="string"),
 *     @OA\Property(property="price", type="number"),
 *     @OA\Property(property="categories_id", type="integer"),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 * 
 * @OA\Schema(
 *     schema="BookRequest",
 *     required={"title", "author", "book_type", "categories_id"},
 *     @OA\Property(property="title", type="string"),
 *     @OA\Property(property="author", type="string"),
 *     @OA\Property(property="book_type", type="string", enum={"PRINT"}),
 *     @OA\Property(property="description", type="string"),
 *     @OA\Property(property="price", type="number"),
 *     @OA\Property(property="categories_id", type="integer")
 * )
 */
class Book extends Model
{
    protected $table = 'bookbuds';
    
    protected $fillable = [
        'title', 'author', 'book_type', 'description', 'genre',
        'image', 'language', 'price', 'publication_year',
        'publisher', 'status', 'stock_quantity', 'page_count',
        'book_weight', 'dimensions', 'cover_type', 'isbn',
        'paper_type', 'categories_id'
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'categories_id');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }
} 