import React, { useEffect } from 'react';
import { Box, Flex, Button, Avatar, Menu, MenuButton, MenuList, MenuItem, IconButton, Link as ChakraLink, Badge } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { HamburgerIcon } from '@chakra-ui/icons';
import { FiShoppingCart, FiLogOut } from 'react-icons/fi';

const Header = () => {
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem("token");
    const [user, setUser] = React.useState(JSON.parse(localStorage.getItem("user")) || {});

    useEffect(() => {
        const handleUserChange = () => {
            const newUser = JSON.parse(localStorage.getItem("user")) || {};
            if (JSON.stringify(newUser) !== JSON.stringify(user)) {
                setUser(newUser);
                window.location.reload();
            }
        };

        const interval = setInterval(handleUserChange, 1000);
        return () => clearInterval(interval);
    }, [user]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate('/');
        window.location.reload();
    };

    const userMenu = [
        {
            label: 'Thông tin cá nhân',
            key: 'profile',
            icon: <FiUser size={16} />,
            onClick: () => navigate('/profile')
        },
        {
            label: 'Đơn hàng của tôi',
            key: 'orders',
            icon: <FiShoppingBag />,
            onClick: () => navigate('/orders')
        },
        {
            label: 'Đổi mật khẩu',
            key: 'change-password',
            icon: <FiLock size={16} />,
            onClick: () => navigate('/change-password')
        },
        {
            label: 'Đăng xuất',
            key: 'logout',
            icon: <FiLogOut size={16} />,
            onClick: handleLogout
        }
    ];

    return (
        <Box bg="blue.500" color="white" px={4}>
            <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                <Flex alignItems={'center'}>
                    <img src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/fahasa-logo.png" alt="Logo Fahasa" style={{ height: '40px', marginRight: '8px' }} />
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
                    {isAuthenticated ? (
                        <Menu>
                            <MenuButton as={Button} variant="link" color="white" display="flex" alignItems="center" h="100%">
                                <Avatar size="sm" name={user.name} src={user.imageUrl} mr={2} />
                                {user.username}
                            </MenuButton>
                            <MenuList>
                                {userMenu.map((item) => (
                                    <MenuItem key={item.key} color="black" onClick={item.onClick} icon={item.icon}>
                                        {item.label}
                                    </MenuItem>
                                ))}
                            </MenuList>
                        </Menu>
                    ) : (
                        <Link to="/login">
                            <Button variant="link" color="white">Đăng nhập</Button>
                        </Link>
                    )}
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