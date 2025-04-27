import React, { useState } from 'react';
import "./changePassword.css";
import { useHistory } from "react-router-dom";
import { Form, Input, Button, Divider, Alert, notification } from 'antd';
import backgroundLogin from "../../assets/image/background-login.png";
import axiosClient from '../../apis/axiosClient';

const ChangePassWord = () => {
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const history = useHistory();

    const validateForm = (values) => {
        if (values.password !== values.confirm) {
            setErrorMessage('Hai mật khẩu bạn nhập không khớp!');
            setIsError(true);
            return false;
        }
        if (values.password.length < 6) {
            setErrorMessage('Mật khẩu mới phải có ít nhất 6 ký tự');
            setIsError(true);
            return false;
        }
        setIsError(false);
        setErrorMessage('');
        return true;
    };

    const onFinish = async (values) => {
        if (!validateForm(values)) {
            return;
        }

        const currentUser = JSON.parse(localStorage.getItem("user"));
        const passwordData = {
            username: currentUser.username,
            currentPassword: values.currentPassword,
            newPassword: values.password
        };

        try {
            const response = await axiosClient.post("/change-password", passwordData);
            if (response.success) {
                notification["success"]({
                    message: "Thành công",
                    description: "Thay đổi mật khẩu thành công",
                });
                // Đăng xuất sau khi đổi mật khẩu thành công
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                history.push("/login");
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Đã xảy ra lỗi khi thay đổi mật khẩu";
            setIsError(true);
            setErrorMessage(errorMsg);
            notification["error"]({
                message: "Lỗi",
                description: errorMsg,
            });
        }
    };

    return (
        <div className="imageBackground">
            <div id="formContainer" >
                <div id="form-Login">
                    <div className="formContentLeft">
                        <img className="formImg" src={backgroundLogin} alt='spaceship' />
                    </div>
                    <Form
                        style={{ width: 340, marginBottom: 8 }}
                        name="normal_login"
                        className="loginform"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                    >
                        <Form.Item style={{ marginBottom: 3, marginTop: 65 }}>
                            <Divider style={{ marginBottom: 5, fontSize: 19 }} orientation="center">BookBuds</Divider>
                        </Form.Item>
                        <Form.Item style={{ marginBottom: 16, textAlign: "center" }}>
                            <p className="text">Thay đổi mật khẩu</p>
                        </Form.Item>
                        {isError && (
                            <Form.Item style={{ marginBottom: 16 }}>
                                <Alert
                                    message={errorMessage}
                                    type="error"
                                    showIcon
                                />
                            </Form.Item>
                        )}
                        <Form.Item
                            name="currentPassword"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mật khẩu hiện tại!',
                                }
                            ]}
                        >
                            <Input.Password placeholder="Mật khẩu hiện tại" />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mật khẩu mới!',
                                },
                                { min: 6, message: 'Mật khẩu ít nhất 6 ký tự' },
                            ]}
                            hasFeedback
                        >
                            <Input.Password placeholder="Mật khẩu mới" />
                        </Form.Item>

                        <Form.Item
                            name="confirm"
                            dependencies={['password']}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập lại mật khẩu!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }

                                        return Promise.reject(new Error('Hai mật khẩu bạn nhập không khớp!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Nhập lại mật khẩu mới" />
                        </Form.Item>
                        <Form.Item style={{ width: '100%', marginTop: 20 }}>
                            <Button className="button" type="primary" htmlType="submit">
                                Đổi mật khẩu
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default ChangePassWord;
