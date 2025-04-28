import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  Button,
  Image,
  Checkbox,
  Divider,
  Grid,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import cartApi from '../apis/cartApi';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectAll, setSelectAll] = useState(false);
  const toast = useToast();
  // Fetch cart data
  const fetchCart = async () => {
    try {
      const response = await cartApi.getCart();
      setCart(response.items);
      setTotalAmount(response.total);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải giỏ hàng',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
  };

  const handleDeleteAll = async () => {
    try {
      await cartApi.clearCart();
      await fetchCart();
      setSelectAll(false);
      toast({
        title: 'Thành công',
        description: 'Đã xóa tất cả sản phẩm khỏi giỏ hàng',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa giỏ hàng',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const handleQuantityChange = async (id, value) => {
    const quantity = parseInt(value);
    if (!isNaN(quantity) && quantity > 0) {
      try {
        await cartApi.updateQuantity(id, quantity);
        await fetchCart();
      } catch (error) {
        toast({
          title: 'Lỗi',
          description: error.response?.data?.message || 'Không thể cập nhật số lượng',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleRemoveFromCart = async (id) => {
    try {
      await cartApi.removeFromCart(id);
      await fetchCart();
      toast({
        title: 'Thành công',
        description: 'Đã xóa sản phẩm khỏi giỏ hàng',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa sản phẩm khỏi giỏ hàng',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  
  if (loading) {
    return (
      <Center h="200px">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box p={5} maxW="1200px" mx="auto" bg="gray.50" boxShadow="xl" borderRadius="lg">
      <Text fontWeight="bold" fontSize="2xl" mb={4}>GIỎ HÀNG ({cart.length} sản phẩm)</Text>
      <Divider mb={4} />
      {cart.length === 0 ? (
        <Text>Giỏ hàng của bạn đang trống.</Text>
      ) : (
        <Grid templateColumns={["1fr", "3fr 1fr"]} gap={6}>
          <Box>
            <HStack mb={4} justifyContent="space-between">
              <Checkbox isChecked={selectAll} onChange={handleSelectAll}>
                Chọn tất cả ({cart.length} sản phẩm)
              </Checkbox>
              <Button
                colorScheme="red"
                size="sm"
                onClick={handleDeleteAll}
                isDisabled={!selectAll}
              >
                Xóa tất cả
              </Button>
            </HStack>
            <VStack spacing={4} align="stretch">
              {cart.map((item) => (
                <Box key={item.id} w="full" p={4} bg="white" borderRadius="md" boxShadow="md">
                  <HStack justifyContent="space-between">
                    <Image src={item.book.image} alt={item.book.title} boxSize="80px" />
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="bold">{item.book.title}</Text>
                      <Text color="red.500" fontWeight="bold">{formatCurrency(item.book.price)}</Text>
                      <Text color="gray.600">Tổng: {formatCurrency(item.book.price * item.quantity)}</Text>
                    </VStack>
                    <NumberInput
                      size="sm"
                      maxW={20}
                      min={1}
                      value={item.quantity}
                      onChange={(value) => handleQuantityChange(item.id, value)}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <Button size="sm" onClick={() => handleRemoveFromCart(item.id)}>Xóa</Button>
                  </HStack>
                </Box>
              ))}
            </VStack>
          </Box>
          <Box>
            <Box p={4} bg="white" borderRadius="md" boxShadow="md">
              <Text fontWeight="bold" mb={2}>Tổng Số Tiền (gồm VAT)</Text>
              <Text fontSize="2xl" color="red.500" fontWeight="bold">
                {formatCurrency(totalAmount)}
              </Text>
              <Divider my={4} />
              <Button 
                colorScheme="red" 
                w="full" 
                mt={4} 
                onClick={handleCheckout}
                
                loadingText="Đang kiểm tra"
              >
                THANH TOÁN
              </Button>
            </Box>
          </Box>
        </Grid>
      )}
    </Box>
  );
};

export default Cart;