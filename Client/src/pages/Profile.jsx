'use client'

import React, { useState, useEffect } from 'react';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  AvatarBadge,
  IconButton,
  Center,
  Box,
  Text,
  Grid,
  GridItem,
  useToast,
} from '@chakra-ui/react';
import { SmallCloseIcon, DeleteIcon } from '@chakra-ui/icons';
import userApi from '../apis/userApi';


// Utility function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export default function UserProfileEdit() {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    phone: '',
    imageUrl: '',
    role: 'USER', 
  });
  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    addressLine: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });
 
  const userId = JSON.parse(localStorage.getItem('user'))?.id;

  // Use the hook at the top level of the component
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const cardBgColor = useColorModeValue('white', 'gray.700');
  

  const toast = useToast(); 

  useEffect(() => {
    if (userId) {
      fetchUserData(userId);
    }
  }, [userId]);

  const fetchUserData = (id) => {
    userApi.getUserById(id).then((data) => {
      const updatedUserData = {
        username: data.username || '',
        email: data.email || '',
        phone: data.phone || '',
        imageUrl: data.imageUrl,
        role: data.role || 'USER',
      };
      setUserData(updatedUserData);

      // Update localStorage with the fetched user data
      localStorage.setItem('user', JSON.stringify({ ...data, id }));
    }).catch((error) => {
      console.error('Failed to fetch user data:', error);
    });
  };

  const fetchShippingAddresses = (userId) => {
    shippingAddressApi.getShippingAddressesByUserId(userId).then((response) => {
      setShippingAddresses(response);
    }).catch((error) => {
      console.error('Failed to fetch shipping addresses:', error);
    });
  };


  const handleSubmit = () => {
    if (userId) {
      console.log("====DATA====")
      console.log(userData);
      userApi.updateUser(userId, userData).then(() => {
        fetchUserData(userId);
        toast({
          title: "Cập nhật thành công.",
          description: "Thông tin người dùng đã được cập nhật.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }).catch((error) => {
        console.error('Failed to update user data:', error);
        toast({
          title: "Cập nhật thất bại.",
          description: "Có lỗi xảy ra khi cập nhật thông tin.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
    }
  };
  const handleCreateAddress = () => {
    if (userId) {
      // Đảm bảo tất cả các giá trị là string và được đặt trong dấu ngoặc kép
      const addressData = {
        addressLine: `${String(newAddress.addressLine).trim()}`,
        city: `${String(newAddress.city).trim()}`,
        state: `${String(newAddress.state).trim()}`,
        postalCode: `${String(newAddress.postalCode).trim()}`,
        country: `${String(newAddress.country).trim()}`,
        user_id: Number(userId)
      };

      // Kiểm tra dữ liệu trước khi gửi
      if (!addressData.addressLine || !addressData.city || !addressData.state || 
          !addressData.postalCode || !addressData.country) {
        toast({
          title: "Thêm địa chỉ thất bại.",
          description: "Vui lòng điền đầy đủ thông tin địa chỉ.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      console.log('Sending address data:', addressData); // Thêm log để kiểm tra dữ liệu

      shippingAddressApi.createShippingAddress(addressData).then(() => {
        fetchShippingAddresses(userId);
        setNewAddress({
          addressLine: '',
          city: '',
          state: '',
          postalCode: '',
          country: ''
        });
        onClose();
        toast({
          title: "Thêm địa chỉ thành công.",
          description: "Địa chỉ mới đã được thêm.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }).catch((error) => {
        console.error('Failed to create shipping address:', error);
        toast({
          title: "Thêm địa chỉ thất bại.",
          description: error.response?.data?.message || "Có lỗi xảy ra khi thêm địa chỉ.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
    }
  };

  const handleDeleteAddress = (id) => {
    shippingAddressApi.deleteShippingAddress(id).then(() => {
      fetchShippingAddresses(userId);
      toast({
        title: "Xóa địa chỉ thành công.",
        description: "Địa chỉ đã được xóa.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }).catch((error) => {
      console.log(error);
      if (error.message === "Cannot delete shipping address as it is referenced by existing orders.") {
        console.error('Cannot delete shipping address as it is referenced by existing orders.');
        toast({
          title: "Xóa địa chỉ thất bại.",
          description: "Địa chỉ không thể xóa vì đang được tham chiếu bởi đơn hàng.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        console.error('Failed to delete shipping address:', error);
        toast({
          title: "Xóa địa chỉ thất bại.",
          description: "Có lỗi xảy ra khi xóa địa chỉ.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    });
  };
  
 


   
  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={bgColor}>
      <Grid
        templateColumns={{ base: '1fr', md: '1fr 1fr' }}
        gap={6}
        w={'full'}
        maxW={'6xl'}
        p={6}
      >
        <GridItem>
          <Stack
            spacing={4}
            bg={cardBgColor}
            rounded={'xl'}
            boxShadow={'lg'}
            p={6}
          >
            <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
              Hồ sơ người dùng
            </Heading>
            <FormControl id="userName">
              <FormLabel>Biểu tượng người dùng</FormLabel>
              <Stack direction={['column', 'row']} spacing={6}>
                <Center>
                  <Avatar size="xl" src={userData.imageUrl}>
                    <AvatarBadge
                      as={IconButton}
                      size="sm"
                      rounded="full"
                      top="-10px"
                      colorScheme="red"
                      aria-label="remove Image"
                      icon={<SmallCloseIcon />}
                    />
                  </Avatar>
                </Center>
                <Center w="full">
                  <Input type="file" accept="image/*" onChange={handleImageUpload} />
                </Center>
              </Stack>
            </FormControl>
            <FormControl id="userName" isRequired>
              <FormLabel>Tên người dùng</FormLabel>
              <Input
                placeholder="Tên người dùng"
                _placeholder={{ color: 'gray.500' }}
                type="text"
                disabled
                value={userData.username}
                onChange={(e) => setUserData({ ...userData, username: e.target.value })}
              />
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel>Địa chỉ email</FormLabel>
              <Input
                placeholder="email@example.com"
                _placeholder={{ color: 'gray.500' }}
                type="email"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              />
            </FormControl>
            <FormControl id="phone" isRequired>
              <FormLabel>Số điện thoại</FormLabel>
              <Input
                placeholder="Số điện thoại"
                _placeholder={{ color: 'gray.500' }}
                type="tel"
                value={userData.phone}
                onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
              />
            </FormControl>
            <Stack spacing={6} direction={['column', 'row']}>
              <Button
                bg={'blue.400'}
                color={'white'}
                w="full"
                _hover={{
                  bg: 'blue.500',
                }}
                onClick={handleSubmit}
              >
                Cập nhật
              </Button>
            </Stack>
          </Stack>
        </GridItem>
        <GridItem>
          <Stack
            spacing={4}
            bg={cardBgColor}
            rounded={'xl'}
            boxShadow={'lg'}
            p={6}
          >
            <Heading size="md">Địa chỉ giao hàng</Heading>
            <Button onClick={onOpen} colorScheme="teal" mb={4}>
              Thêm địa chỉ mới
            </Button>
            <Stack spacing={3}>
              {shippingAddresses.map((address) => (
                <Box key={address.id} p={3} shadow="md" borderWidth="1px" rounded="md" display="flex" justifyContent="space-between" alignItems="center">
                  <Text>{address.address_line}, {address.city}, {address.state}, {address.postal_code}, {address.country}</Text>
                  <IconButton
                    aria-label="Delete address"
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    onClick={() => handleDeleteAddress(address.id)}
                  />
                </Box>
              ))}
            </Stack>
          </Stack>
        </GridItem>
      </Grid>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Thêm địa chỉ mới</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="addressLine" isRequired>
              <FormLabel>Địa chỉ</FormLabel>
              <Input
                placeholder="Địa chỉ"
                value={newAddress.addressLine}
                onChange={(e) => setNewAddress({ ...newAddress, addressLine: e.target.value })}
              />
            </FormControl>
            <FormControl id="city" isRequired mt={4}>
              <FormLabel>Thành phố</FormLabel>
              <Input
                placeholder="Thành phố"
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
              />
            </FormControl>
            <FormControl id="state" isRequired mt={4}>
              <FormLabel>Tỉnh/Thành phố</FormLabel>
              <Input
                placeholder="Tỉnh/Thành phố"
                value={newAddress.state}
                onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
              />
            </FormControl>
            <FormControl id="postalCode" isRequired mt={4}>
              <FormLabel>Mã bưu điện</FormLabel>
              <Input
                placeholder="Mã bưu điện"
                value={newAddress.postalCode}
                onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
              />
            </FormControl>
            <FormControl id="country" isRequired mt={4}>
              <FormLabel>Quốc gia</FormLabel>
              <Input
                placeholder="Quốc gia"
                value={newAddress.country}
                onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCreateAddress}>
              Lưu
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
} 