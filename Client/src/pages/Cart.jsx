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
  Select,
  useToast,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import promotionsApi from '../apis/promotionsApi';
import cartApi from '../apis/cartApi';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [promotions, setPromotions] = useState([]);
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


  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await promotionsApi.getListPromotions();
        // Lọc chỉ lấy các khuyến mãi đang active và còn hiệu lực
        const activePromotions = response.filter(promo => {
          const now = new Date();
          const startDate = new Date(promo.start_date);
          const endDate = new Date(promo.end_date);
          return promo.status === 'ACTIVE' && now >= startDate && now <= endDate;
        });
        setPromotions(activePromotions);
      } catch (error) {
        console.error('Error fetching promotions:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải danh sách khuyến mãi',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };
    fetchPromotions();
  }, [toast]);

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

  
  const applyPromotion = () => {
    if (!selectedPromotion) {
      toast({
        title: 'Thông báo',
        description: 'Vui lòng chọn khuyến mãi',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (discountApplied) {
      toast({
        title: 'Thông báo',
        description: 'Đã áp dụng khuyến mãi rồi',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const { discount_type, discount_value } = selectedPromotion;
    let discountAmount = 0;

    if (discount_type === 'PERCENT') {
      // Giới hạn giảm giá tối đa là 100%
      const percentValue = Math.min(discount_value, 100);
      discountAmount = totalAmount * (percentValue / 100);
    } else if (discount_type === 'FIXED_AMOUNT') {
      discountAmount = discount_value;
    }

    // Đảm bảo số tiền giảm không vượt quá tổng tiền
    if (discountAmount > totalAmount) {
      discountAmount = totalAmount;
    }

    setDiscount(discountAmount);
    setDiscountApplied(true);

    toast({
      title: 'Thành công',
      description: 'Đã áp dụng khuyến mãi',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const removePromotion = () => {
    setSelectedPromotion(null);
    setDiscount(0);
    setDiscountApplied(false);
    toast({
      title: 'Thông báo',
      description: 'Đã bỏ khuyến mãi',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
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
              <Select 
                placeholder="Chọn khuyến mãi" 
                onChange={(e) => {
                  const promo = promotions.find(p => p.promotion_id === parseInt(e.target.value));
                  setSelectedPromotion(promo);
                }}
                value={selectedPromotion?.promotion_id || ''}
              >
                {promotions.map(promo => (
                  <option key={promo.promotion_id} value={promo.promotion_id}>
                    {promo.promotion_name} - {promo.discount_type === 'PERCENT' ? `${promo.discount_value}%` : formatCurrency(promo.discount_value)}
                  </option>
                ))}
              </Select>
              {selectedPromotion && (
                <Text fontSize="sm" color="gray.600" mt={2}>
                  {selectedPromotion.description}
                  <br />
                  Hiệu lực: {new Date(selectedPromotion.start_date).toLocaleDateString('vi-VN')} - {new Date(selectedPromotion.end_date).toLocaleDateString('vi-VN')}
                </Text>
              )}
              <HStack spacing={4} mt={4}>
                <Button 
                  colorScheme="blue"
                  onClick={applyPromotion} 
                  isDisabled={discountApplied || !selectedPromotion}
                >
                  Áp dụng khuyến mãi
                </Button>
                <Button 
                  onClick={removePromotion} 
                  isDisabled={!discountApplied}
                >
                  Bỏ khuyến mãi
                </Button>
              </HStack>
              <Button 
                colorScheme="red" 
                w="full" 
                mt={4} 
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