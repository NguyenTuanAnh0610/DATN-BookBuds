import React, { useEffect, useState } from 'react';
import {
  Table,
  Card,
  Typography,
  Avatar,
  Rate,
  Spin,
  Alert,
  Popconfirm,
  Button,
  message,
  Breadcrumb,
} from 'antd';
import { UserOutlined, DeleteOutlined, ShoppingOutlined } from '@ant-design/icons';
import reviewApi from '../../apis/reviewApi';

const { Title, Text } = Typography;

const ReviewsManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all reviews
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewApi.getAllReviews();
      setReviews(response.data || response);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Handle delete review
  const handleDelete = async (id) => {
    try {
      await reviewApi.deleteReview(id);
      message.success('Review deleted successfully');
      fetchReviews();
    } catch (err) {
      message.error('Failed to delete review');
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Book',
      dataIndex: ['book', 'title'],
      key: 'book',
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary">{record.book?.author}</Text>
        </div>
      )
    },
    {
      title: 'User',
      dataIndex: ['user', 'username'],
      key: 'user',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            src={record.user?.avatar} 
            icon={<UserOutlined />} 
            style={{ marginRight: 8 }}
          />
          <div>
            <Text strong>{text}</Text>
            <br />
            <Text type="secondary">{record.user?.email}</Text>
          </div>
        </div>
      )
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => <Rate disabled defaultValue={rating} />
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
      ellipsis: true
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'date',
      render: (date) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Popconfirm
          title="Are you sure to delete this review?"
          onConfirm={() => handleDelete(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="link"  style={{ width: 100, borderRadius: 15 }} icon={<DeleteOutlined />} >
                            {"Xóa"}
                        </Button>
        </Popconfirm>
      )
    }
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        style={{ margin: 20 }}
      />
    );
  }

  return (
    <Card style={{ margin: 20 }}>
        <div style={{ marginTop: 20, marginBottom:20 }}>
                        <Breadcrumb>
                            <Breadcrumb.Item href="">
                                <ShoppingOutlined />
                            </Breadcrumb.Item>
                            <Breadcrumb.Item href="">
                                <span>Quản lý bình luận</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    
      <Table
        columns={columns}
        dataSource={reviews}
        rowKey="id"
        bordered
        pagination={{ pageSize: 10 }}
        scroll={{ x: true }}
      />
    </Card>
  );
};

export default ReviewsManagement;