import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Box, Button, FormControl, FormLabel, Container, Input, Alert, Text, Divider, useToast } from '@chakra-ui/react';
import axiosClient from '../apis/axiosClient';

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const toast = useToast();

    const validateForm = () => {
        if (newPassword !== confirmPassword) {
            setError('Mật khẩu mới không khớp');
            return false;
        }
        if (newPassword.length < 6) {
            setError('Mật khẩu mới phải có ít nhất 6 ký tự');
            return false;
        }
        setError('');
        return true;
    };

    const onFinish = async (event) => {
        event.preventDefault();
        
        if (!validateForm()) {
            toast({
                title: "Lỗi",
                description: error,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        const currentUser = JSON.parse(localStorage.getItem("user"));
        const passwordData = {
            username: currentUser.username,
            currentPassword: currentPassword,
            newPassword: newPassword
        };

        try {
            const response = await axiosClient.post("/change-password", passwordData);
            if (response.success) {
                toast({
                    title: "Thành công",
                    description: "Thay đổi mật khẩu thành công",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                // Đăng xuất sau khi đổi mật khẩu thành công
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi khi thay đổi mật khẩu";
            toast({
                title: "Lỗi",
                description: errorMessage,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Container maxW="container.sm" py={10}>
            <Box bg="white" p={8} borderRadius="lg" boxShadow="lg">
                <Text fontSize="2xl" textAlign="center" mb={6}>Thay đổi mật khẩu</Text>
                <Divider mb={6} />
                
                {error && <Alert status="error" mb={4}>{error}</Alert>}
                
                <form onSubmit={onFinish}>
                    <FormControl mb={4} isRequired>
                        <FormLabel>Mật khẩu hiện tại</FormLabel>
                        <Input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Nhập mật khẩu hiện tại"
                        />
                    </FormControl>

                    <FormControl mb={4} isRequired>
                        <FormLabel>Mật khẩu mới</FormLabel>
                        <Input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Nhập mật khẩu mới"
                        />
                    </FormControl>

                    <FormControl mb={6} isRequired>
                        <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                        <Input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Nhập lại mật khẩu mới"
                        />
                    </FormControl>

                    <Button
                        colorScheme="blue"
                        type="submit"
                        width="full"
                        size="lg"
                    >
                        Đổi mật khẩu
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default ChangePassword; 