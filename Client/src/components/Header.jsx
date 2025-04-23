import React, { useEffect } from 'react';
import { Box, Flex, Button, Avatar, Menu, MenuButton, MenuList, MenuItem, IconButton, Link as ChakraLink, Badge } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { HamburgerIcon } from '@chakra-ui/icons';
import { FiShoppingCart } from 'react-icons/fi';


const Header = () => {
    
    return (
        <Box bg="blue.500" color="white" px={4}>
            <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                <Flex alignItems={'center'}>
                    {/* <img src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/fahasa-logo.png" alt="Logo Fahasa" style={{ height: '40px', marginRight: '8px' }} /> */}
                    <Flex display={{ base: 'none', md: 'flex' }} ml={4}>
                        <Link to="/">
                            <Button variant="link" color="white" ml={2}>Trang chủ</Button>
                        </Link>
                        <Link to="/products">
                            <Button variant="link" color="white" ml={4}>Sản phẩm</Button>
                        </Link>
                        <Link to="/contact">
                            <Button variant="link" color="white" ml={4}>Liên hệ</Button>
                        </Link>
                        <Link to="/about">
                            <Button variant="link" color="white" ml={4}>Giới thiệu</Button>
                        </Link>
                    </Flex>
                </Flex>
                <Flex alignItems={'center'}>
                    <ChakraLink as={Link} to="/cart" color="white" mr={4} position="relative">
                        <FiShoppingCart size="24px" />
                        
                    </ChakraLink>
                    
                    <IconButton
                        aria-label="Open Menu"
                        icon={<HamburgerIcon />}
                        display={{ md: 'none' }}
                        onClick={() => {
                            // Logic to open a mobile menu can be added here
                        }}
                        ml={2}
                    />
                </Flex>
            </Flex>
        </Box>
    );
};

export default Header;