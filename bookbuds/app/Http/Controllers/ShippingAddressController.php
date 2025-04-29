<?php

namespace App\Http\Controllers;

use App\Models\ShippingAddress;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ShippingAddressController extends Controller
{
    public function index(): JsonResponse
    {
        $addresses = auth()->user()->shippingAddresses;
        return response()->json($addresses);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'addressLine' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'country' => 'required|string|max:255',
            'postalCode' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'user_id' => 'required|exists:users,id'
        ]);

        $address = ShippingAddress::create([
            'address_line' => $validated['addressLine'],
            'city' => $validated['city'],
            'country' => $validated['country'],
            'postal_code' => $validated['postalCode'],
            'state' => $validated['state'],
            'user_id' => $validated['user_id']
        ]);

        return response()->json($address, 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $address = ShippingAddress::findOrFail($id);
        
        if ($address->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'addressLine' => 'sometimes|required|string|max:255',
            'city' => 'sometimes|required|string|max:255',
            'country' => 'sometimes|required|string|max:255',
            'postalCode' => 'sometimes|required|string|max:255',
            'state' => 'sometimes|required|string|max:255'
        ]);

        $address->update([
            'address_line' => $validated['addressLine'] ?? $address->address_line,
            'city' => $validated['city'] ?? $address->city,
            'country' => $validated['country'] ?? $address->country,
            'postal_code' => $validated['postalCode'] ?? $address->postal_code,
            'state' => $validated['state'] ?? $address->state
        ]);

        return response()->json($address);
    }

    public function destroy(int $id): JsonResponse
    {
        $address = ShippingAddress::findOrFail($id);
        

        $address->delete();
        return response()->json(null, 204);
    }

   
    public function getShippingAddressesByUserId(int $id): JsonResponse
    {
        $addresses = ShippingAddress::where('user_id', $id)->get();
        return response()->json($addresses);
    }
} 