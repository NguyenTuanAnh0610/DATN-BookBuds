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
       
      </Grid>

      
    </Flex>
  );
} 