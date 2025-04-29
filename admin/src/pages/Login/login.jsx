import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Alert, Button, Divider, Form, Input, Modal, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import userApi from "../../apis/userApi";
import "./login.css";

const Login = () => {

  const [isLogin, setLogin] = useState(true);
  const [forgotPasswordModalVisible, setForgotPasswordModalVisible] = useState(false);
  const [forgotPasswordForm] = Form.useForm(); 

  let history = useHistory();

  const onFinish = values => {
    const loginData = {
      email: values.email,
      password: values.password
    };

    userApi.login(loginData)
      .then(function (response) {
        if (!response.user) {
          setLogin(false);
        }
        else {
          (async () => {
            try {
              console.log(response);
              if (response.user.role === "ADMIN") {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
                history.push("/dash-board");
              } else {
                notification["error"]({
                  message: 'Thông báo',
                  description: 'Bạn không có quyền truy cập vào hệ thống',
                });
              }
            } catch (error) {
              console.log('Failed to fetch ping role:' + error);
            }
          })();
        }
      })
      .catch(error => {
        setLogin(false);
        console.log("Login error: " + error);
      });
  }

  const showForgotPasswordModal = () => {
    setForgotPasswordModalVisible(true);
  };

  const handleForgotPasswordCancel = () => {
    setForgotPasswordModalVisible(false);
    forgotPasswordForm.resetFields();
  };

  const handleForgotPasswordSubmit = async () => {
    try {
      const values = await forgotPasswordForm.validateFields();
      await userApi.forgotPassword({ email: values.email });
      notification.success({
        message: 'Thành công',
        description: 'Mật khẩu mới đã được gửi đến email của bạn.',
      });
      setForgotPasswordModalVisible(false);
      forgotPasswordForm.resetFields();
    } catch (error) {
      if (error.response?.data?.message) {
        notification.error({
          message: 'Lỗi',
          description: error.response.data.message,
        });
      } else {
        notification.error({
          message: 'Lỗi',
          description: 'Đã có lỗi xảy ra khi xử lý yêu cầu.',
        });
      }
    }
  };

  const handleLink = () => {
    history.push("/register");
  }

  useEffect(() => {

  }, [])

  return (
    <div className="imageBackground">
      <div id="formContainer" >
        <div id="form-Login">
          <div className="formContentLeft"
          >
            <img className="formImg" src="https://wallpapers.com/images/hd/camping-background-rgj5169zktuggn6e.jpg" alt='spaceship' />
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
              <Divider style={{ marginBottom: 5, fontSize: 19 }} orientation="center">CHÀO MỪNG BẠN ĐẾN VỚI HỆ THỐNG!</Divider>
            </Form.Item>
            <Form.Item style={{ marginBottom: 16, textAlign: "center" }}>
              <p className="text">Đăng nhập để vào hệ thống quản lý</p>
            </Form.Item>
            <>
              {isLogin === false ?
                <Form.Item style={{ marginBottom: 16 }}>
                  <Alert
                    message="Email hoặc mật khẩu không chính xác"
                    type="error"
                    showIcon
                  />

                </Form.Item>
                : ""}
            </>
            <Form.Item
              style={{ marginBottom: 20 }}
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập email!',
                },
                {
                  type: 'email',
                  message: 'Email không hợp lệ!',
                }
              ]}
            >
              <Input
                style={{ height: 34, borderRadius: 5 }}
                prefix={<MailOutlined className="siteformitemicon" />}
                placeholder="Email" />
            </Form.Item >
            <Form.Item
              style={{ marginBottom: 8 }}
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập mật khẩu!',
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="siteformitemicon" />}
                type="password"
                placeholder="Mật khẩu"
                style={{ height: 34, borderRadius: 5 }}
              />
            </Form.Item>

            <Form.Item style={{ width: '100%', marginTop: 20, marginBottom: 5 }}>
              <Button className="button" type="primary" htmlType="submit"  >
                Đăng Nhập
              </Button>
            </Form.Item>

            <Form.Item style={{ textAlign: 'center' }}>
              <Button type="link" onClick={showForgotPasswordModal}>
                Quên mật khẩu?
              </Button>
            </Form.Item>
          </Form>
        </div>

        <Modal
          title="Quên mật khẩu"
          visible={forgotPasswordModalVisible}
          onCancel={handleForgotPasswordCancel}
          footer={[
            <Button key="back" onClick={handleForgotPasswordCancel}>
              Hủy
            </Button>,
            <Button key="submit" type="primary" onClick={handleForgotPasswordSubmit}>
              Gửi mật khẩu mới
            </Button>,
          ]}
        >
          <Form
            form={forgotPasswordForm}
            layout="vertical"
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập email',
                },
                {
                  type: 'email',
                  message: 'Email không hợp lệ!',
                }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Nhập email của bạn" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Login;


