import React, { useState, useEffect } from 'react';
import {
    Box, Text, VStack, Button, Divider, Select, Image, HStack, Heading, Flex, 
    Icon, Badge, useToast, Spinner, Center
} from '@chakra-ui/react';
import { FaTruck, FaMoneyBillWave, FaCreditCard } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import shippingAddressApi from '../apis/shippingAddressApi';
import orderApi from '../apis/orderApi';
import vnpayApi from '../apis/vnpayApi';
import cartApi from '../apis/cartApi';

const Checkout = () => {
    const location = useLocation();
    const [cart, setCart] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [originalTotal, setOriginalTotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [promotion, setPromotion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shippingAddresses, setShippingAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [checkingStock, setCheckingStock] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    // Initialize data from cart or location state
    const fetchData = async () => {
        try {
            // If coming from Cart with discount applied
            if (location.state) {
                setCart(location.state.selectedItemsData);
                setTotalAmount(location.state.totalAmount);
                setOriginalTotal(location.state.originalTotal);
                setDiscount(location.state.discount);
                setPromotion(location.state.promotion);
            } else {
                // If accessing Checkout directly
                const cartResponse = await cartApi.getCart();
                setCart(cartResponse.items);
                const calculatedTotal = cartResponse.items.reduce(
                    (sum, item) => sum + (item.book.price * item.quantity), 0
                );
                setTotalAmount(calculatedTotal);
                setOriginalTotal(calculatedTotal);
            }

            // Fetch shipping addresses
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                const addresses = await shippingAddressApi.getShippingAddressesByUserId(user.id);
                setShippingAddresses(addresses);
            }

            setLoading(false);
        } catch (error) {
            console.error('Error initializing checkout:', error);
            toast({
                title: 'Lỗi',
                description: 'Không thể tải dữ liệu thanh toán',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Check for book types in the cart
    const hasAudioOrOnline = cart.some(item => 
        item.book.book_type === 'AUDIO' || item.book.book_type === 'ONLINE'
    );

    const handlePayment = async (method) => {
        setPaymentMethod(method);
        const user = JSON.parse(localStorage.getItem('user'));
        
        // Validate user and address
        if (!user) {
            toast({
                title: 'Lỗi',
                description: 'Vui lòng đăng nhập để thanh toán',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            navigate('/login');
            return;
        }

        if (!selectedAddress) {
            toast({
                title: 'Lỗi',
                description: 'Vui lòng chọn địa chỉ giao hàng',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        // Validate COD for audio/online books
        // if (method === 'COD' && hasAudioOrOnline) {
        //     toast({
        //         title: 'Lỗi',
        //         description: 'Không thể thanh toán COD cho sách loại AUDIO hoặc ONLINE',
        //         status: 'error',
        //         duration: 5000,
        //         isClosable: true,
        //     });
        //     return;
        // }

        // setCheckingStock(true);

        try {
            // Check stock before proceeding
            const stockCheck = await cartApi.checkStock();
            
            if (!stockCheck.success) {
                const outOfStockItems = stockCheck.outOfStockItems;
                let message = 'Một số sản phẩm không đủ số lượng trong kho:';
                
                outOfStockItems.forEach(item => {
                    message += `\n- ${item.title}: Yêu cầu ${item.requested_quantity}, Còn lại ${item.available_quantity}`;
                });
                
                toast({
                    title: 'Không đủ hàng',
                    description: message,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                return;
            }

            // Prepare order data with discount information
            const orderData = {
                userId: user.id,
                items: cart.map(item => ({
                    bookId: item.book.id,
                    quantity: item.quantity,
                    price: item.book.price,
                })),
                shippingAddressId: selectedAddress,
                paymentMethod: method,
                totalAmount: totalAmount,
                originalAmount: originalTotal,
                discountAmount: discount,
                promotionId: promotion?.promotion_id || null,
                status: 'pending',
                description: `Đơn hàng ${method === 'COD' ? 'COD' : 'VNPAY'}${promotion ? ' + Khuyến mãi' : ''}`
            };

            // Create order
            const orderResponse = await orderApi.createOrder(orderData);

            if (method === 'VNPAY') {
                // For VNPAY, redirect to payment gateway
                localStorage.setItem('pendingOrderId', orderResponse.id);
                
                const paymentResponse = await vnpayApi.createPayment({
                    price: totalAmount,
                    return_url: `${window.location.origin}/payment-success`,
                    ipAddr: window.location.hostname,
                    orderId: orderResponse.id
                });

                window.location.href = paymentResponse.paymentUrl;
            } else {
                // For COD, clear cart and show success
                await cartApi.clearCart();
                toast({
                    title: 'Thành công',
                    description: 'Đơn hàng đã được đặt thành công!',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
                navigate('/success', { state: { orderId: orderResponse.id } });
            }
        } catch (error) {
            console.error('Checkout error:', error);
            toast({
                title: 'Lỗi',
                description: error.response?.data?.message || 'Đặt hàng không thành công',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setCheckingStock(false);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { 
            style: 'currency', 
            currency: 'VND' 
        }).format(value);
    };

    if (loading) {
        return (
            <Center h="200px">
                <Spinner size="xl" />
            </Center>
        );
    }

    return (
        <Box p={{ base: 4, md: 8 }} maxW="900px" mx="auto" bg="white" boxShadow="xl" borderRadius="lg">
            <Heading as="h1" size="xl" mb={6} textAlign="center" color="teal.600">
                Thanh Toán
            </Heading>
            
            {/* Shipping Address */}
            <VStack align="start" spacing={4} mb={8}>
                <Text fontWeight="bold" fontSize="lg">Địa chỉ giao hàng</Text>
                <Select
                    placeholder="Chọn địa chỉ giao hàng"
                    onChange={(e) => setSelectedAddress(e.target.value)}
                    borderColor="teal.400"
                    value={selectedAddress || ''}
                >
                    {shippingAddresses.map(address => (
                        <option key={address.id} value={address.id}>
                            {`${address.address_line}, ${address.city}, ${address.state}, ${address.postal_code}`}
                        </option>
                    ))}
                </Select>
                {!selectedAddress && (
                    <Text color="red.500" fontSize="sm">Vui lòng chọn địa chỉ giao hàng</Text>
                )}
            </VStack>

            <Divider mb={8} />

            {/* Order Items */}
            <VStack align="start" spacing={4} mb={8}>
                <Text fontWeight="bold" fontSize="lg">Sản phẩm đặt hàng</Text>
                {cart.map(item => (
                    <HStack 
                        key={item.id} 
                        spacing={4} 
                        w="full" 
                        p={4} 
                        bg="gray.50" 
                        borderRadius="md" 
                        boxShadow="md"
                        align="flex-start"
                    >
                        <Image 
                            src={item.book.image} 
                            alt={item.book.title} 
                            boxSize="100px" 
                            objectFit="contain"
                            borderRadius="md" 
                        />
                        <VStack align="start" spacing={1} flex={1}>
                            <Text fontWeight="bold">{item.book.title}</Text>
                            <Text fontSize="sm">Tác giả: {item.book.author}</Text>
                            <Text fontSize="sm">Số lượng: {item.quantity}</Text>
                            <Badge 
                                colorScheme={
                                    item.book.book_type === 'PHYSICAL' ? 'green' : 
                                    item.book.book_type === 'AUDIO' ? 'blue' : 'purple'
                                }
                            >
                                {item.book.book_type}
                            </Badge>
                            <Text color="red.500" fontWeight="bold">
                                {formatCurrency(item.book.price)}
                            </Text>
                            <Text fontSize="sm">
                                Thành tiền: {formatCurrency(item.book.price * item.quantity)}
                            </Text>
                        </VStack>
                    </HStack>
                ))}
                
                {hasAudioOrOnline && (
                    <Text color="orange.500" fontSize="sm">
                        Lưu ý: Sản phẩm số (AUDIO/ONLINE) sẽ được gửi qua email sau khi thanh toán
                    </Text>
                )}
            </VStack>

            <Divider mb={8} />

            {/* Order Summary */}
            <VStack spacing={4} align="stretch" mb={8}>
                <Flex justify="space-between">
                    <Text>Tổng tiền hàng:</Text>
                    <Text>{formatCurrency(originalTotal)}</Text>
                </Flex>
                
                {discount > 0 && (
                    <Flex justify="space-between">
                        <Text>Giảm giá:</Text>
                        <Text color="green.500">-{formatCurrency(discount)}</Text>
                    </Flex>
                )}
                
                <Flex justify="space-between" fontWeight="bold" fontSize="lg">
                    <Text>Tổng thanh toán:</Text>
                    <Text color="teal.600">{formatCurrency(totalAmount)}</Text>
                </Flex>
            </VStack>

            <Divider mb={8} />

            {/* Payment Methods */}
            <VStack spacing={4} align="stretch">
                <Text fontWeight="bold" fontSize="lg">Phương thức thanh toán</Text>
                
                {!hasAudioOrOnline && (
                    <Button
                        leftIcon={<Icon as={FaMoneyBillWave} />}
                        colorScheme="green"
                        variant={paymentMethod === 'COD' ? 'solid' : 'outline'}
                        onClick={() => handlePayment('COD')}
                        isLoading={checkingStock && paymentMethod === 'COD'}
                    >
                        Thanh toán khi nhận hàng (COD)
                    </Button>
                )}
                
                <Button
                    leftIcon={<Icon as={FaCreditCard} />}
                    colorScheme="blue"
                    variant={paymentMethod === 'VNPAY' ? 'solid' : 'outline'}
                    onClick={() => handlePayment('VNPAY')}
                    isLoading={checkingStock && paymentMethod === 'VNPAY'}
                >
                    Thanh toán qua VNPAY
                </Button>
                
                <Text color="gray.600" fontSize="sm">
                    <Icon as={FaTruck} color="teal.500" mr={2} />
                    Giao hàng tiêu chuẩn 3-5 ngày làm việc
                </Text>
            </VStack>
        </Box>
    );
};

export default Checkout;