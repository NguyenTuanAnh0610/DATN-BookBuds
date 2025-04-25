import React, { useEffect, useState } from 'react';
import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    UserOutlined
} from '@ant-design/icons';
import {
    BackTop,
    Breadcrumb,
    Button,
    Col,
    Form,
    Input,
    Modal,
    Popconfirm,
    Row,
    Space,
    Spin,
    Table,
    notification,
    Select
} from 'antd';
import { useHistory } from 'react-router-dom';
import userApi from "../../apis/userApi";
import "./accountManagement.css";
import { PageHeader } from '@ant-design/pro-layout';

const { Option } = Select;

const AccountManagement = () => {
    const [accounts, setAccounts] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [id, setId] = useState();

    const history = useHistory();

    const showModal = () => {
        setOpenModalCreate(true);
    };

    const createAccount = async (accountData) => {
        // Check if the username already exists in the local state
        const existingAccountByUsername = accounts.find(account => account.username === accountData.username);
        if (existingAccountByUsername) {
            notification["error"]({
                message: `Thông báo`,
                description: 'Tên đăng nhập đã tồn tại, vui lòng chọn tên khác!',
            });
            return; // Exit the function early
        }

        // Check if the email already exists in the local state
        const existingAccountByEmail = accounts.find(account => account.email === accountData.email);
        if (existingAccountByEmail) {
            notification["error"]({
                message: `Thông báo`,
                description: 'Email đã tồn tại, vui lòng chọn email khác!',
            });
            return; // Exit the function early
        }

        try {
            const response = await userApi.createUser(accountData);
            if (response) {
                notification["success"]({
                    message: `Thông báo`,
                    description: 'Tạo tài khoản thành công',
                });
                handleAccountList();
                setOpenModalCreate(false);
            }
        } catch (error) {
            notification["error"]({
                message: `Thông báo`,
                description: 'Tạo tài khoản thất bại',
            });
        }
    }

    const updateAccount = async (accountData) => {
        try {
            const response = await userApi.updateUser(id, accountData);
            if (response) {
                notification["success"]({
                    message: `Thông báo`,
                    description: 'Chỉnh sửa tài khoản thành công',
                });
                handleAccountList();
                setOpenModalUpdate(false);
            }
        } catch (error) {
            notification["error"]({
                message: `Thông báo`,
                description: 'Chỉnh sửa tài khoản thất bại',
            });
        }
    }

    const handleOkUser = async (values) => {
        setLoading(true);
        await createAccount(values);
        setLoading(false);
    }

    const handleUpdateAccount = async (values) => {
        setLoading(true);
        await updateAccount(values);
        setLoading(false);
    }

    const handleCancel = (type) => {
        if (type === "create") {
            setOpenModalCreate(false);
        } else {
            setOpenModalUpdate(false)
        }
        console.log('Clicked cancel button');
    };

    const handleAccountList = async () => {
        try {
            const res = await userApi.getAllUsers();
            setAccounts(res);
            setLoading(false);
        } catch (error) {
            console.log('Failed to fetch account list:' + error);
        };
    }

    const handleDeleteAccount = async (id) => {
        setLoading(true);
        try {
            await userApi.deleteUser(id).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description: 'Xóa tài khoản thất bại',
                    });
                    setLoading(false);
                } else {
                    notification["success"]({
                        message: `Thông báo`,
                        description: 'Xóa tài khoản thành công',
                    });
                    handleAccountList();
                    setLoading(false);
                }
            });
        } catch (error) {
            console.log('Failed to delete account:' + error);
        }
    }

    const handleEditAccount = (id) => {
        setOpenModalUpdate(true);
        (async () => {
            try {
                const response = await userApi.getUserById(id);
                setId(id);
                form2.setFieldsValue(response);
                setLoading(false);
            } catch (error) {
                throw error;
            }
        })();
    }

    

    const columns = [
        {
            title: 'Tên đăng nhập',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (text, record) => (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Button
                        size="small"
                        icon={<EditOutlined />}
                        style={{ width: 150, borderRadius: 15, height: 30, marginBottom: 10 }}
                        onClick={() => handleEditAccount(record.id)}
                    >
                        {"Chỉnh sửa"}
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc chắn xóa tài khoản này?"
                        onConfirm={() => handleDeleteAccount(record.id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button
                            size="small"
                            icon={<DeleteOutlined />}
                            style={{ width: 150, borderRadius: 15, height: 30 }}
                        >
                            {"Xóa"}
                        </Button>
                    </Popconfirm>
                </div>
            ),
        }
    ];

    useEffect(() => {
        handleAccountList();
    }, [])

    return (
        <div>
            <Spin spinning={loading}>
                <div className='container'>
                    <div style={{ marginTop: 20 }}>
                        <Breadcrumb>
                            <Breadcrumb.Item href="">
                                <UserOutlined />
                            </Breadcrumb.Item>
                            <Breadcrumb.Item href="">
                                <span>Quản lý tài khoản</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <div style={{ marginTop: 20 }}>
                        <div id="my__event_container__list">
                            <PageHeader
                                subTitle=""
                                style={{ fontSize: 14 }}
                            >
                                <Row>
                                    <Col span="18">
                                        <Input
                                            placeholder="Tìm kiếm tài khoản"
                                            allowClear
                                            onChange={(e) => handleSearch(e.target.value)}
                                            style={{ width: 300 }}
                                        />
                                    </Col>
                                    <Col span="6">
                                        <Row justify="end">
                                            <Space>
                                                <Button onClick={showModal} icon={<PlusOutlined />} style={{ marginLeft: 10 }} >Tạo tài khoản</Button>
                                            </Space>
                                        </Row>
                                    </Col>
                                </Row>

                            </PageHeader>
                        </div>
                    </div>


                    <div style={{ marginTop: 30 }}>
                        <Table columns={columns} pagination={{ position: ['bottomCenter'] }} dataSource={accounts} rowKey="id" />
                    </div>
                </div>

                <Modal
                    title="Tạo tài khoản mới"
                    visible={openModalCreate}
                    style={{ top: 100 }}
                    onOk={() => {
                        form
                            .validateFields()
                            .then((values) => {
                                form.resetFields();
                                handleOkUser(values);
                            })
                            .catch((info) => {
                                console.log('Validate Failed:', info);
                            });
                    }}
                    onCancel={() => handleCancel("create")}
                    okText="Hoàn thành"
                    cancelText="Hủy"
                    width={600}
                >
                    <Form
                        form={form}
                        name="accountCreate"
                        layout="vertical"
                        scrollToFirstError
                    >
                        <Form.Item
                            name="username"
                            label="Tên đăng nhập"
                            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Tên đăng nhập" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            label="Mật khẩu"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input.Password placeholder="Mật khẩu" />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Email" />
                        </Form.Item>
                        <Form.Item
                            name="phone"
                            label="Số điện thoại"
                            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Số điện thoại" />
                        </Form.Item>
                        <Form.Item
                            name="role"
                            label="Vai trò"
                            rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select placeholder="Chọn vai trò">
                                <Option value="USER">USER</Option>
                                <Option value="ADMIN">ADMIN</Option>
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal
                    title="Chỉnh sửa tài khoản"
                    visible={openModalUpdate}
                    style={{ top: 100 }}
                    onOk={() => {
                        form2
                            .validateFields()
                            .then((values) => {
                                form2.resetFields();
                                handleUpdateAccount(values);
                            })
                            .catch((info) => {
                                console.log('Validate Failed:', info);
                            });
                    }}
                    onCancel={handleCancel}
                    okText="Hoàn thành"
                    cancelText="Hủy"
                    width={600}
                >
                    <Form
                        form={form2}
                        name="accountUpdate"
                        layout="vertical"
                        scrollToFirstError
                    >
                        <Form.Item
                            name="username"
                            label="Tên đăng nhập"
                            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Tên đăng nhập" />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Email" />
                        </Form.Item>
                        <Form.Item
                            name="phone"
                            label="Số điện thoại"
                            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Số điện thoại" />
                        </Form.Item>
                        <Form.Item
                            name="role"
                            label="Vai trò"
                            rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select placeholder="Chọn vai trò">
                                <Option value="USER">USER</Option>
                                <Option value="ADMIN">ADMIN</Option>
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>

                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div>
    )
}

export default AccountManagement;

