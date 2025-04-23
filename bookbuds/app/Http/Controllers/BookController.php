<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class BookController extends Controller
{
    /**
     * @OA\Get(
     *     path="/books",
     *     summary="Get list of books",
     *     tags={"Books"},
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/Book")
     *         )
     *     )
     * )
     */

    /**
     * Lấy danh sách tất cả sách có kèm thông tin danh mục.
     */
    public function index(): JsonResponse
    {
        $books = Book::with(['category'])->get();
        return response()->json($books);
    }

    /**
     * @OA\Get(
     *     path="/books/{id}",
     *     summary="Get book by ID",
     *     tags={"Books"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Book ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(ref="#/components/schemas/Book")
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Book not found"
     *     )
     * )
     */

    /**
    * Lấy thông tin chi tiết của một cuốn sách dựa trên ID.
    * Bao gồm thông tin danh mục và các đánh giá có kèm thông tin người dùng.
    */
    public function show(int $id): JsonResponse 
    {
        $book = Book::with(['category', 'reviews.user'])->findOrFail($id);
        return response()->json($book);
    }

    /**
     * @OA\Post(
     *     path="/books",
     *     summary="Create a new book",
     *     tags={"Books"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/BookRequest")
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Book created successfully",
     *         @OA\JsonContent(ref="#/components/schemas/Book")
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error"
     *     )
     * )
     */
     /**
     * Thêm một cuốn sách mới vào cơ sở dữ liệu.
     * Dữ liệu đầu vào được kiểm tra và xác thực trước khi lưu vào database.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'publisher' => 'required|string|max:255',
            'publication_year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'genre' => 'required|string|max:255',
            'language' => 'required|string|max:50',
            'image' => 'required|string',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'status' => 'required|in:ACTIVE,INACTIVE',
            'book_type' => 'required|in:PRINT',
            'categories_id' => 'required|exists:product_category,id',
            'dimensions' => 'required|string|max:50',
            'book_weight' => 'required|numeric|min:0',
            'cover_type' => 'required|in:HARDCOVER,PAPERBACK',
            'isbn' => 'required|string|max:13',
            'paper_type' => 'required|string|max:50'
        ]);

        // Tạo sách mới
        $book = Book::create($validated);
        return response()->json($book, 201);
    }
    
    /**
    * Cập nhật thông tin của một cuốn sách dựa trên ID.
    * Chỉ cập nhật các trường được gửi lên trong request.
    */
    public function update(Request $request, int $id): JsonResponse
    {
        $book = Book::findOrFail($id);
        
        $validated = $request->validate([
            'title' => 'string|max:255',
            'author' => 'string|max:255',
            'publisher' => 'string|max:255',
            'publication_year' => 'integer|min:1900|max:' . (date('Y') + 1),
            'genre' => 'string|max:255',
            'language' => 'string|max:50',
            'image' => 'string',
            'description' => 'string',
            'price' => 'numeric|min:0',
            'stock_quantity' => 'integer|min:0',
            'status' => 'in:ACTIVE,INACTIVE',
            'book_type' => 'in:PRINT',
            'categories_id' => 'exists:product_category,id',
            'dimensions' => 'string|max:50',
            'book_weight' => 'numeric|min:0',
            'cover_type' => 'in:HARDCOVER,PAPERBACK',
            'isbn' => 'string|max:13',
            'paper_type' => 'string|max:50'
        ]);

        $book->update($validated);
        return response()->json($book);
    }

    /**
     * @OA\Get(
     *     path="/books/category/{id}",
     *     summary="Get books by category ID",
     *     tags={"Books"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Category ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/Book")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Category not found"
     *     )
     * )
     */

    /**
    * Lấy danh sách sách thuộc một danh mục cụ thể dựa vào category_id.
    */ 
    public function getBooksByCategory(int $categoryId): JsonResponse
    {
        $books = Book::where('categories_id', $categoryId)
            ->with(['category'])
            ->get();
            
        return response()->json($books);
    }
    /**
    * Xóa một cuốn sách dựa trên ID.
    */
    public function destroy(int $id): JsonResponse
    {
        $book = Book::findOrFail($id);
        $book->delete();
        return response()->json(null, 204);
    }
} 