import React, { createContext, useState, useContext, useEffect } from 'react';
import cartApi from '../apis/cartApi';
import { useToast } from '@chakra-ui/react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [discountedTotal, setDiscountedTotal] = useState(0);
  const toast = useToast();

  // Fetch cart data when component mounts
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
          const response = await cartApi.getCart();
          setCart(response.items);
          setTotalAmount(response.total);
          const discountedAmount = response.total - discount;
          setDiscountedTotal(discountedAmount > 0 ? discountedAmount : 0);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };
    fetchCart();
  }, [discount]);

  const applyDiscount = (discountValue) => {
    setDiscount(discountValue);
  };

  const removeDiscount = () => {
    setDiscount(0);
  };

  const addToCart = async (book, quantity) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        toast({
          title: "Thông báo",
          description: "Vui lòng đăng nhập để thêm vào giỏ hàng",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      await cartApi.addToCart({
        book_id: book.id,
        quantity: quantity
      });

      // Refresh cart after adding
      const response = await cartApi.getCart();
      setCart(response.items);
      setTotalAmount(response.total);
      const discountedAmount = response.total - discount;
      setDiscountedTotal(discountedAmount > 0 ? discountedAmount : 0);

      toast({
        title: "Thành công",
        description: "Đã thêm sản phẩm vào giỏ hàng",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể thêm vào giỏ hàng",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const removeFromCart = async (id) => {
    try {
      await cartApi.removeFromCart(id);
      
      // Refresh cart after removing
      const response = await cartApi.getCart();
      setCart(response.items);
      setTotalAmount(response.total);
      const discountedAmount = response.total - discount;
      setDiscountedTotal(discountedAmount > 0 ? discountedAmount : 0);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa sản phẩm khỏi giỏ hàng",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const updateQuantity = async (id, quantity) => {
    try {
      await cartApi.updateQuantity(id, quantity);
      
      // Refresh cart after updating
      const response = await cartApi.getCart();
      setCart(response.items);
      setTotalAmount(response.total);
      const discountedAmount = response.total - discount;
      setDiscountedTotal(discountedAmount > 0 ? discountedAmount : 0);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể cập nhật số lượng",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const clearCart = async () => {
    try {
      await cartApi.clearCart();
      setCart([]);
      setTotalAmount(0);
      setDiscountedTotal(0);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa giỏ hàng",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      totalAmount, 
      discountedTotal, 
      applyDiscount, 
      removeDiscount, 
      discount 
    }}>
      {children}
    </CartContext.Provider>
  );
};