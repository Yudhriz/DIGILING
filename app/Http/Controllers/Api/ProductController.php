<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\FirebaseService;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    protected $firebase;

    public function __construct(FirebaseService $firebase)
    {
        $this->firebase = $firebase;
    }

    public function index()
    {
        $response = $this->firebase->getAll();
        $data = [];

        if (isset($response['documents'])) {
            foreach ($response['documents'] as $doc) {
                $parts = explode('/', $doc['name']);
                $id = end($parts);
                $fields = $doc['fields'];
                $data[] = [
                    'id'    => $id,
                    'name'  => $fields['name']['stringValue'] ?? null,
                    'price' => $fields['price']['integerValue'] ?? 0,
                    'stock' => $fields['stock']['integerValue'] ?? 0,
                ];
            }
        }

        return response()->json([
        'produk' => $data // $produk bisa berupa collection atau array
        ], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'  => 'required|string',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
        ]);

        $res = $this->firebase->create($validated);
        $id = basename($res['name'] ?? '');

        return response()->json(['id' => $id, 'message' => 'Product created'], 201);
    }

    public function show($id)
    {
        $res = $this->firebase->get($id);

        if (isset($res['error'])) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $fields = $res['fields'];
        return response()->json([
            'id'    => $id,
            'name'  => $fields['name']['stringValue'] ?? null,
            'price' => $fields['price']['integerValue'] ?? 0,
            'stock' => $fields['stock']['integerValue'] ?? 0,
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name'  => 'sometimes|string',
            'price' => 'sometimes|numeric',
            'stock' => 'sometimes|integer',
        ]);

        $res = $this->firebase->update($id, $validated);

        if (isset($res['error'])) {
            return response()->json(['message' => 'Update failed'], 400);
        }

        return response()->json(['message' => 'Product updated']);
    }

    public function destroy($id)
    {
        $res = $this->firebase->delete($id);

        if ($res->failed()) {
            return response()->json(['message' => 'Delete failed'], 400);
        }

        return response()->json(['message' => 'Product deleted']);
    }
}
