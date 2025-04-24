<?php

namespace App\Http\Controllers;

use App\Models\Promotion;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PromotionController extends Controller
{
    public function index(): JsonResponse
    {
        $promotions = Promotion::all();
        return response()->json($promotions);
    }

    public function show(int $id): JsonResponse
    {
        $promotion = Promotion::findOrFail($id);
        return response()->json($promotion);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'promotion_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'discount_type' => 'required|in:FIXED_AMOUNT,PERCENT',
            'discount_value' => 'required|numeric|min:0',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'status' => 'required|in:ACTIVE,INACTIVE'
        ]);

        $promotion = Promotion::create($validated);
        return response()->json($promotion, 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $promotion = Promotion::findOrFail($id);

        $validated = $request->validate([
            'promotion_name' => 'string|max:255',
            'description' => 'nullable|string',
            'discount_type' => 'in:FIXED_AMOUNT,PERCENT',
            'discount_value' => 'numeric|min:0',
            'start_date' => 'date',
            'end_date' => 'date|after:start_date',
            'status' => 'in:ACTIVE,INACTIVE'
        ]);

        $promotion->update($validated);
        return response()->json($promotion);
    }

    public function destroy(int $id): JsonResponse
    {
        $promotion = Promotion::findOrFail($id);
        $promotion->delete();
        return response()->json(null, 204);
    }
} 