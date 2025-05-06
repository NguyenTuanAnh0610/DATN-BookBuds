<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\ShippingAddressController;
use App\Http\Controllers\UserController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/
// Books
Route::get('/books', [BookController::class, 'index']);
Route::get('/books/{id}', [BookController::class, 'show']);
Route::post('/books', [BookController::class, 'store']);
Route::put('/books/{id}', [BookController::class, 'update']);
Route::delete('/books/{id}', [BookController::class, 'destroy']);
Route::get('/books/category/{id}', [BookController::class, 'getBooksByCategory']);

// Categories
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);
Route::post('/categories', [CategoryController::class, 'store']);
Route::put('/categories/{id}', [CategoryController::class, 'update']);
Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);


// Shipping Addresses
Route::get('/shipping-addresses', [ShippingAddressController::class, 'index']);
Route::get('/shipping-addresses/user/{id}', [ShippingAddressController::class, 'getShippingAddressesByUserId']);
Route::post('/shipping-addresses', [ShippingAddressController::class, 'store']);
Route::put('/shipping-addresses/{id}', [ShippingAddressController::class, 'update']);
Route::delete('/shipping-addresses/{id}', [ShippingAddressController::class, 'destroy']);

// User Management
Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);
Route::post('/logout', [UserController::class, 'logout']);
Route::post('/change-password', [UserController::class, 'changePassword'])->middleware('auth:sanctum');
Route::post('/forgot-password', [UserController::class, 'forgotPassword']);

Route::get('/profile', [UserController::class, 'profile']);
Route::put('/profile', [UserController::class, 'updateProfile']);
Route::get('/users', [UserController::class, 'index']);
Route::get('/users/{id}', [UserController::class, 'show']);
Route::put('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);
Route::get('/users/search', [UserController::class, 'search']);

// Cart routes

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'addToCart']);
    Route::put('/cart/{id}', [CartController::class, 'updateQuantity']);
    Route::delete('/cart/{id}', [CartController::class, 'removeFromCart']);
    Route::delete('/cart', [CartController::class, 'clearCart']);
    Route::post('/cart/check-stock', [CartController::class, 'checkStock']);
});

// Promotions
Route::get('/promotions', [PromotionController::class, 'index']);
Route::get('/promotions/{id}', [PromotionController::class, 'show']);
Route::post('/promotions', [PromotionController::class, 'store']);
Route::put('/promotions/{id}', [PromotionController::class, 'update']);
Route::delete('/promotions/{id}', [PromotionController::class, 'destroy']);

// Reviews
Route::post('/reviews', [ReviewController::class, 'store']);
Route::put('/reviews/{id}', [ReviewController::class, 'update']);
Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);
Route::get('/reviews/book/{id}', [ReviewController::class, 'getBookReviews']);
