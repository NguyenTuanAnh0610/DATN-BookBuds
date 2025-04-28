<!DOCTYPE html>
<html>
<head>
    <title>Xác nhận đơn hàng</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #4299e1;
            color: white;
            padding: 20px;
            text-align: center;
        }
        .content {
            padding: 20px;
            background-color: #f7fafc;
        }
        .order-details {
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #666;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            padding: 10px;
            border: 1px solid #ddd;
        }
        th {
            background-color: #f1f1f1;
        }
        .pdf-preview-section {
            margin-top: 10px;
        }
        .pdf-item {
            margin-bottom: 15px;
        }
        .pdf-link {
            display: inline-block;
            padding: 5px 10px;
            background-color: white;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            margin-left: 10px;
        }
        .pdf-link:hover {
            background-color: #3182ce;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Xác nhận đơn hàng #{{ $order->id }}</h1>
        </div>
        
        <div class="content">
            <p>Xin chào {{ $order->user->name }},</p>
            
            <p>Cảm ơn bạn đã đặt hàng tại BookBuds. Đơn hàng của bạn đã được xác nhận thành công.</p>
            
            <div class="order-details">
                <h2>Chi tiết đơn hàng:</h2>
                <table>
                    <tr>
                        <th>Sản phẩm</th>
                        <th>Số lượng</th>
                        <th>Giá</th>
                    </tr>
                    @foreach($order->orderItems as $item)
                    <tr>
                        <td>{{ $item->book->title }}</td>
                        <td>{{ $item->quantity }}</td>
                        <td>{{ number_format($item->book->price * $item->quantity) }} VND</td>
                    </tr>
                    @endforeach
                </table>

                <!-- Phần hiển thị PDF cho từng sản phẩm -->
                <h3>File Audio:</h3>
                @foreach($order->orderItems as $item)
                    @if($item->book->preview_pdf)
                    <div class="pdf-item">
                        <a href="{{ $item->book->preview_pdf }}" 
                           target="_blank" 
                           class="pdf-link">
                           Xem
                        </a>
                    </div>
                    @endif
                @endforeach

                <p><strong>Tổng tiền:</strong> {{ number_format($order->total_amount) }} VND</p>
                <p><strong>Phương thức thanh toán:</strong> {{ $order->payment_method }}</p>
               
                <h3>Địa chỉ giao hàng:</h3>
                <p>
                    {{ $order->shippingAddress->address_line }}<br>
                    {{ $order->shippingAddress->city }}<br>
                    {{ $order->shippingAddress->state }}<br>
                    {{ $order->shippingAddress->postal_code }}<br>
                    {{ $order->shippingAddress->country }}
                </p>
            </div>
            
            <p>Chúng tôi sẽ thông báo cho bạn khi đơn hàng được gửi đi.</p>
        </div>
        
        <div class="footer">
            <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.</p>
            <p>© {{ date('Y') }} BookBuds. All rights reserved.</p>
        </div>
    </div>
</body>
</html>