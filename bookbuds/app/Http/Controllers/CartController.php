<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function index(): JsonResponse
    {
        $cartItems = Cart::where('user_id', Auth::id())
            ->with('book')
            ->get();

        $total = $cartItems->sum(function ($item) {
            return $item->book->price * $item->quantity;
        });

        return response()->json([
            'items' => $cartItems,
            'total' => $total
        ]);
    }
    
    public function addToCart(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'book_id' => 'required|exists:bookbuds,id',
            'quantity' => 'required|integer|min:1'
        ]);

        // Kiểm tra số lượng tồn kho
        
    }
    public function updateQuantity(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $cartItem = Cart::where('user_id', Auth::id())
            ->findOrFail($id);

        // Kiểm tra số lượng tồn kho
    }

    public function removeFromCart(int $id): JsonResponse
    {
        $cartItem = Cart::where('user_id', Auth::id())
            ->findOrFail($id);
            
        $cartItem->delete();
        return response()->json(null, 204);
    }

    

    public function checkStock(): JsonResponse
    {
        $user = Auth::user();
        $cartItems = Cart::where('user_id', $user->id)->with('book')->get();
        
        $outOfStockItems = [];
        
        foreach ($cartItems as $item) {
            if ($item->quantity > $item->book->stock_quantity) {
                $outOfStockItems[] = [
                    'id' => $item->id,
                    'book_id' => $item->book_id,
                    'title' => $item->book->title,
                    'requested_quantity' => $item->quantity,
                    'available_quantity' => $item->book->stock_quantity
                ];
            }
        }
        return response()->json([
            'success' => count($outOfStockItems) === 0,
            'outOfStockItems' => $outOfStockItems
        ]);
    }
}
