import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Grid,
  Input,
  Text,
  Badge,
  Flex,
  Stack,
  Button,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import orderApi from '../apis/orderApi';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const toast = useToast();
  const userId = JSON.parse(localStorage.getItem('user'))?.id;
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const cardBgColor = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    if (userId) {
      fetchUserOrders(userId);
    }
  }, [userId]);

  const fetchUserOrders = (userId) => {
    orderApi.getOrdersByUserId(userId).then((response) => {
      setOrders(response);
    }).catch((error) => {
      console.error('Failed to fetch user orders:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách đơn hàng",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    });
  };

  const handleDeleteOrder = (id) => {
    const orderToDelete = orders.find(order => order.id === id);
    if (orderToDelete && orderToDelete.paymentMethod === 'PayPal') {
      toast({
        title: "Hủy đơn hàng thất bại.",
        description: "Đơn hàng đã được thanh toán bằng PayPal không thể hủy.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    
    orderApi.updateOrderStatus(id, "cancelled").then(() => {
      fetchUserOrders(userId);
      toast({
        title: "Hủy đơn hàng thành công.",
        description: "Đơn hàng đã được hủy.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }).catch((error) => {
      console.error('Failed to cancel order:', error);
      toast({
        title: "Hủy đơn hàng thất bại.",
        description: "Có lỗi xảy ra khi hủy đơn hàng.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    });
  };

  useEffect(() => {
    const getStatusCode = (searchText) => {
      searchText = searchText.toLowerCase();
      if (searchText.includes('đã hủy')) return 'cancelled';
      if (searchText.includes('vận chuyển')) return 'shipped';
      if (searchText.includes('đã giao')) return 'delivered';
      if (searchText.includes('đang xử lý')) return 'processing';
      if (searchText.includes('chờ xác nhận')) return 'pending';
      return searchText;
    };

    const getStatusText = (status) => {
      switch (status) {
        case 'cancelled': return 'Đã hủy';
        case 'shipped': return 'Vận chuyển';
        case 'delivered': return 'Đã giao';
        case 'processing': return 'Đang xử lý';
        case 'pending': return 'Chờ xác nhận';
        default: return status;
      }
    };

    const results = orders.filter(order => {
      const searchTextLower = searchTerm.toLowerCase();
      const statusCode = getStatusCode(searchTerm);
      
      return (
        order.id.toString().includes(searchTerm) ||
        order.payment_method.toLowerCase().includes(searchTextLower) ||
        order.status === statusCode ||
        getStatusText(order.status).toLowerCase().includes(searchTextLower) ||
        order.description?.toLowerCase().includes(searchTextLower) ||
        order.total_amount.toString().includes(searchTerm)
      );
    });
    setFilteredOrders(results);
  }, [searchTerm, orders]);

  return (
    <Box maxW="1200px" mx="auto" py={8} px={4}>
      <Heading mb={6}>Lịch sử đơn hàng</Heading>
      
      <Input
        placeholder="Tìm kiếm đơn hàng theo mã, trạng thái, phương thức thanh toán..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        mb={6}
      />

      {orders.length > 0 ? (
        <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
          {(searchTerm ? filteredOrders : orders).map((order) => (
            <Box
              key={order.id}
              p={5}
              bg={cardBgColor}
              borderRadius="lg"
              boxShadow="md"
              borderLeftWidth={4}
              borderColor={
                order.status === 'delivered'
                  ? 'green.400'
                  : order.status === 'shipped'
                    ? 'blue.400'
                    : order.status === 'processing'
                      ? 'orange.400'
                      : order.status === 'pending'
                        ? 'blue.400'
                        : 'red.400'
              }
            >
              <Flex justify="space-between" align="center" mb={4}>
                <Text fontWeight="bold" fontSize="lg">
                  Mã đơn hàng: #{order.id}
                </Text>
                <Badge colorScheme={
                  order.status === 'delivered'
                    ? 'green'
                    : order.status === 'shipped'
                      ? 'blue'
                      : order.status === 'processing'
                        ? 'orange'
                        : order.status === 'pending'
                          ? 'blue'
                          : 'red'
                }>
                  {order.status === 'delivered' 
                    ? 'Đã giao' 
                    : order.status === 'shipped'
                      ? 'Vận chuyển'
                      : order.status === 'processing'
                        ? 'Đang xử lý'
                        : order.status === 'pending'
                          ? 'Chờ xác nhận'
                          : 'Đã hủy'}
                </Badge>
              </Flex>

              <Stack spacing={2}>
                <Text>
                  <strong>Tổng tiền:</strong> {formatCurrency(order.total_amount)}
                </Text>
                <Text>
                  <strong>Phương thức thanh toán:</strong> {order.payment_method}
                </Text>
                <Text>
                  <strong>Ngày tạo:</strong> {new Date(order.created_at).toLocaleDateString('vi-VN')}
                </Text>
                <Text>
                  <strong>Mô tả:</strong> {order.description || 'Không có mô tả'}
                </Text>
                
                {order.status === 'pending' && (
                  <Button colorScheme="red" onClick={() => handleDeleteOrder(order.id)}>
                    Hủy đơn hàng
                  </Button>
                )}
              </Stack>
            </Box>
          ))}
        </Grid>
      ) : (
        <Text>Không có đơn hàng nào.</Text>
      )}
    </Box>
  );
};

export default OrderHistory; 