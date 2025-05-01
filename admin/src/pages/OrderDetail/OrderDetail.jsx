import {
    HomeOutlined,
    ShoppingCartOutlined,
    CheckCircleOutlined,
    SyncOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    CarOutlined
} from '@ant-design/icons';
import {
    BackTop,
    Breadcrumb,
    Spin,
    Card,
    Row,
    Col,
    Image,
    Tag,
    Divider,
    Typography,
    Button
} from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import orderApi from "../../apis/orderApi";
import bookApi from "../../apis/bookApi";
import "./orderDetail.css";

const { Text, Title } = Typography;

const OrderDetail = () => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const history = useHistory();

    useEffect(() => {
        (async () => {
            try {
                const res = await orderApi.getDetailOrder(id);
                setOrder(res);
                await fetchProducts(res.items);
                setLoading(false);
            } catch (error) {
                console.log('Failed to fetch order details:' + error);
                setLoading(false);
            }
        })();
    }, [id]);

    const fetchProducts = async (items) => {
        try {
            const productPromises = items.map(item => 
                bookApi.getDetailBook(item.bookId)
            );
            const productDetails = await Promise.all(productPromises);
            setProducts(productDetails);
        } catch (error) {
            console.log('Failed to fetch products:', error);
        }
    };

    const getStatusTag = (status) => {
        switch (status) {
            case 'delivered':
                return (
                    <Tag icon={<CheckCircleOutlined />} color="success">
                        Đã giao hàng
                    </Tag>
                );
            case 'shipped':
                return (
                    <Tag icon={<CarOutlined />} color="processing">
                        Đang vận chuyển
                    </Tag>
                );
            case 'processing':
                return (
                    <Tag icon={<SyncOutlined spin />} color="processing">
                        Đang xử lý
                    </Tag>
                );
            case 'pending':
                return (
                    <Tag icon={<ClockCircleOutlined />} color="default">
                        Chờ xác nhận
                    </Tag>
                );
            case 'cancelled':
                return (
                    <Tag icon={<CloseCircleOutlined />} color="error">
                        Đã hủy
                    </Tag>
                );
            default:
                return <Tag>{status}</Tag>;
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin spinning={loading} tip="Đang tải chi tiết đơn hàng..." size="large" />
            </div>
        );
    }

    if (!order) {
        return (
            <div style={{ padding: 24 }}>
                <Card>
                    <div style={{ textAlign: 'center', padding: 24 }}>
                        <Title level={4}>Không tìm thấy đơn hàng</Title>
                        <Button type="primary" onClick={() => history.push('/orders')}>
                            Quay lại danh sách đơn hàng
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className='order-detail-container'>
            <div style={{ margin: '20px 0' }}>
                <Breadcrumb>
                    <Breadcrumb.Item onClick={() => history.push('/')} style={{ cursor: 'pointer' }}>
                        <HomeOutlined /> Trang chủ
                    </Breadcrumb.Item>
                    <Breadcrumb.Item onClick={() => history.push('/orders')} style={{ cursor: 'pointer' }}>
                        <ShoppingCartOutlined /> Đơn hàng
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        Chi tiết đơn hàng #{order.id}
                    </Breadcrumb.Item>
                </Breadcrumb>
            </div>

            <Title level={3} style={{ marginBottom: 24 }}>
                Chi tiết đơn hàng #{order.id}
            </Title>

            <Row gutter={[24, 24]}>
                <Col xs={24} md={8}>
                    <Card title="Thông tin đơn hàng" bordered={false}>
                        <div style={{ marginBottom: 16 }}>
                            <Text strong>Trạng thái: </Text>
                            {getStatusTag(order.status)}
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <Text strong>Ngày đặt hàng: </Text>
                            {moment(order.created_at).format('DD/MM/YYYY HH:mm')}
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <Text strong>Phương thức thanh toán: </Text>
                            {order.payment_method === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản VNPay'}
                        </div>
                        <Divider />
                        <div style={{ marginBottom: 8 }}>
                            <Text strong>Tổng tiền hàng: </Text>
                            <Text>{formatCurrency(order.total_amount)}</Text>
                        </div>
                        
                        <div style={{ marginBottom: 16 }}>
                            <Text strong>Tổng thanh toán: </Text>
                            <Text strong style={{ color: '#1890ff', fontSize: 16 }}>
                                {formatCurrency(order.total_amount + (order.shipping_fee || 0))}
                            </Text>
                        </div>
                        <Divider />
                        <div>
                            <Text strong>Địa chỉ giao hàng: </Text>
                            {order.shipping_address ? (
                                <div style={{ marginTop: 8 }}>
                                    <div>{order.shipping_address.address_line}</div>
                                    <div>
                                        {order.shipping_address.ward}, {order.shipping_address.district}, {order.shipping_address.city}
                                    </div>
                                    <div>Số điện thoại: {order.shipping_address.phone}</div>
                                </div>
                            ) : (
                                <Text>Không có thông tin địa chỉ</Text>
                            )}
                        </div>
                    </Card>

                    <Card title="Thông tin khách hàng" bordered={false} style={{ marginTop: 24 }}>
                        {order.user ? (
                            <>
                                <div style={{ marginBottom: 8 }}>
                                    <Text strong>Tên khách hàng: </Text>
                                    <Text>{order.user.username}</Text>
                                </div>
                                <div style={{ marginBottom: 8 }}>
                                    <Text strong>Email: </Text>
                                    <Text>{order.user.email}</Text>
                                </div>
                                <div>
                                    <Text strong>Số điện thoại: </Text>
                                    <Text>{order.user.phone || 'Chưa cập nhật'}</Text>
                                </div>
                            </>
                        ) : (
                            <Text>Không có thông tin khách hàng</Text>
                        )}
                    </Card>
                    <Card title="Sản phẩm trong đơn hàng" bordered={false} style={{ marginTop: 24 }}>
                    {Array.isArray(order?.items) && order.items.map((item, index) => {
    const product = products[index]; // matching with productDetails[index]
    return (
        <Card key={item.id} style={{ marginBottom: 16 }}>
            <Row gutter={16}>
                <Col span={6}>
                    <Image src={product?.images?.[0]} alt={product?.title} width={100} />
                </Col>
                <Col span={18}>
                    <Text strong>{product?.title}</Text>
                    <div>Số lượng: {item.quantity}</div>
                    <div>Giá: {formatCurrency(item.price)}</div>
                </Col>
            </Row>
        </Card>
    );
})}

</Card>

                </Col>
            </Row>

            <BackTop />
        </div>
    );
};

export default OrderDetail;