<?php

namespace App\Http\Controllers;

use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class OrderItemController extends Controller
{
    public function index(int $orderId): JsonResponse
    {
        $items = OrderItem::with(['book'])
            ->where('order_id', $orderId)
            ->get();
        return response()->json($items);
    }

    public function store(Request $request, int $orderId): JsonResponse
    {
        $validated = $request->validate([
            'book_id' => 'required|exists:bookbuds,id',
            'quantity' => 'required|integer|min:1'
        ]);

        $item = OrderItem::create([
            ...$validated,
            'order_id' => $orderId
        ]);

        return response()->json($item->load('book'), 201);
    }

    public function update(Request $request, int $orderId, int $id): JsonResponse
    {
        $item = OrderItem::where('order_id', $orderId)
            ->findOrFail($id);

        $validated = $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $item->update($validated);
        return response()->json($item->load('book'));
    }

    public function destroy(int $orderId, int $id): JsonResponse
    {
        $item = OrderItem::where('order_id', $orderId)
            ->findOrFail($id);
            
        $item->delete();
        return response()->json(null, 204);
    }
} 