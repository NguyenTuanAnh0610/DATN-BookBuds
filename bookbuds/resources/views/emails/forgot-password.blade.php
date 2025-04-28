<!DOCTYPE html>
<html>
<head>
    <title>Mật khẩu mới - BookBuds</title>
</head>
<body>
    <h2>Xin chào {{ $user->name }},</h2>
    
    <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn tại BookBuds.</p>
    
    <p>Mật khẩu mới của bạn là: <strong>{{ $newPassword }}</strong></p>
    
    <p>Vui lòng đăng nhập với mật khẩu mới và thay đổi mật khẩu ngay sau khi đăng nhập để đảm bảo an toàn.</p>
    
    <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng liên hệ với chúng tôi ngay.</p>
    
    <p>Trân trọng,<br>
    Đội ngũ BookBuds</p>
</body>
</html> 