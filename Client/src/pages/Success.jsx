import React, { useEffect } from 'react';
import { Box, Heading, Text, VStack, Button, useToast } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import orderApi from '../apis/orderApi';

const Success = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();
    const { clearCart } = useCart();

    useEffect(() => {
        const handlePaymentResult = async () => {
            // Lấy các tham số từ URL (VNPAY redirect)
            const params = new URLSearchParams(location.search);
            const vnpResponseCode = params.get('vnp_ResponseCode');
            const orderId = localStorage.getItem('pendingOrderId');

            if (orderId) {
                try {
                    if (vnpResponseCode === '00') {
                        // Thanh toán thành công
                        await orderApi.updateOrderStatus(orderId, 'PROCESSING');
                       
                        clearCart();
                    } else if (vnpResponseCode) {
                        // Thanh toán thất bại
                        await orderApi.updateOrderStatus(orderId, 'CANCELLED');
                     
                    }
                } catch (error) {
                    console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
                  
                }
                // Xóa orderId khỏi localStorage sau khi xử lý
                localStorage.removeItem('pendingOrderId');
            }
        };

        handlePaymentResult();
    }, [location, toast, clearCart]);

    return (
        <Box p={8} maxW="600px" mx="auto" textAlign="center">
            <VStack spacing={6}>
                <Heading color="teal.500">Cảm ơn bạn đã đặt hàng!</Heading>
                <Text>Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất.</Text>
                <Button colorScheme="teal" onClick={() => navigate('/')}>
                    Tiếp tục mua sắm
                </Button>
            </VStack>
        </Box>
    );
};

export default Success; 