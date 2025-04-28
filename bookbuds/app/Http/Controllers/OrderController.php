<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Book;
use App\Mail\OrderConfirmation;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

class OrderController extends Controller
{
    public function index(): JsonResponse
    {
        $orders = Order::with(['orderItems.book', 'user', 'shippingAddress'])->get();
        return response()->json($orders);
    }

    public function show(int $id): JsonResponse
    {
        $order = Order::with(['orderItems.book', 'user', 'shippingAddress'])->findOrFail($id);
        return response()->json($order);
    }

    public function getOrdersByUserId(int $userId): JsonResponse
    {
        $orders = Order::with(['orderItems.book', 'user', 'shippingAddress'])
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($orders);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'paymentMethod' => 'required|string|max:255',
            'shippingAddressId' => 'required|exists:shipping_addresses,id',
            'items' => 'required|array',
            'items.*.bookId' => 'required|exists:bookbuds,id',
            'items.*.quantity' => 'required|integer|min:1',
            'description' => 'nullable|string',
            'totalAmount' => 'required|numeric',
            'status' => 'required|string|in:pending,approved,final,cancelled',
            'userId' => 'required|exists:users,id'
        ]);

        // Kiểm tra số lượng tồn kho trước khi tạo đơn hàng
        foreach ($validated['items'] as $item) {
            $book = Book::findOrFail($item['bookId']);
            if ($book->stock_quantity < $item['quantity']) {
                return response()->json([
                    'message' => "Sản phẩm '{$book->title}' không đủ số lượng trong kho. Chỉ còn {$book->stock_quantity} sản phẩm."
                ], 400);
            }
        }

        $order = Order::create([
            'user_id' => $validated['userId'],
            'status' => $validated['status'],
            'payment_method' => $validated['paymentMethod'],
            'shipping_address_id' => $validated['shippingAddressId'],
            'description' => $validated['description'],
            'total_amount' => $validated['totalAmount'],
            'created_at' => now()
        ]);

        // Tạo order items và cập nhật số lượng tồn kho
        foreach ($validated['items'] as $item) {
            $order->orderItems()->create([
                'book_id' => $item['bookId'],
                'quantity' => $item['quantity']
            ]);

            // Cập nhật số lượng tồn kho
            $book = Book::findOrFail($item['bookId']);
            $book->stock_quantity -= $item['quantity'];
            $book->save();
        }

        return response()->json($order->load(['orderItems.book']), 201);
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $order = Order::with('orderItems.book')->findOrFail($id);
        
        $validated = $request->validate([
            'status' => 'required|string|in:pending,processing,shipped,delivered,cancelled'
        ]);

        $oldStatus = $order->status;
        $newStatus = $validated['status'];

        // Nếu đơn hàng bị hủy, hoàn lại số lượng sách vào kho
        if ($newStatus === 'cancelled' && $oldStatus !== 'cancelled') {
            foreach ($order->orderItems as $item) {
                $book = $item->book;
                $book->stock_quantity += $item->quantity;
                $book->save();
            }
        }

        $order->update(['status' => $newStatus]);
        return response()->json($order);
    }
} 