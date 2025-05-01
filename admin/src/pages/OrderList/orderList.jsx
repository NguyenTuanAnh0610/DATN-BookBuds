import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { PageHeader } from '@ant-design/pro-layout';
import {
  BackTop,
  Breadcrumb,
  Button,
  Col,
  Form,
  Input,
  Modal, Popconfirm,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  notification,
  Steps
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axiosClient from '../../apis/axiosClient';
import orderApi from "../../apis/orderApi";
import shippingAddressApi from "../../apis/shippingAddressApi";
import userApi from "../../apis/userApi";
import "./orderList.css";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
const { Option } = Select;
const { Step } = Steps;

const OrderList = () => {
  const [order, setOrder] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [id, setId] = useState();
  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  const history = useHistory();

  const handleOkUser = async (values) => {
      setLoading(true);
      try {
          const categoryList = {
              "name": values.name,
              "description": values.description,
              "slug": values.slug
          }
          await axiosClient.post("/category", categoryList).then(response => {
              if (response === undefined) {
                  notification["error"]({
                      message: `Thông báo`,
                      description:
                          'Tạo danh mục thất bại',
                  });
              }
              else {
                  notification["success"]({
                      message: `Thông báo`,
                      description:
                          'Tạo danh mục thành công',
                  });
                  setOpenModalCreate(false);
                  handleCategoryList();
              }
          })
          setLoading(false);

      } catch (error) {
          throw error;
      }
  }

  const handleUpdateOrder = async () => {
      setLoading(true);
      try {
          let status;
          switch (currentStep) {
              case 0:
                  status = 'pending';
                  break;
              case 1:
                  status = 'processing';
                  break;
              case 2:
                  status = 'shipped';
                  break;
              case 3:
                  status = 'delivered';
                  break;
              case 4:
                  status = 'cancelled';
                  break;
              default:
                  status = 'pending';
          }

          await orderApi.updateOrderStatus(id, status).then(response => {
              if (response === undefined || response.error === "sai-quy-trinh") {
                  notification["error"]({
                      message: `Thông báo`,
                      description:
                          'Cập nhật thất bại',
                  });
              }
              else {
                  notification["success"]({
                      message: `Thông báo`,
                      description:
                          'Cập nhật thành công',
                  });
                  setOpenModalUpdate(false);
                  handleCategoryList();
              }
          })
          setLoading(false);

      } catch (error) {
          throw error;
      }
  }

  const handleCancel = (type) => {
      if (type === "create") {
          setOpenModalCreate(false);
      } else {
          setOpenModalUpdate(false)
      }
      console.log('Clicked cancel button');
  };

  const handleCategoryList = async () => {
      try {
          await orderApi.getListOrder().then((res) => {
              // Sort orders by created_at in descending order (newest first)
              const sortedOrders = res.sort((a, b) => 
                  new Date(b.created_at) - new Date(a.created_at)
              );
              setOrder(sortedOrders);
              setFilteredOrders(sortedOrders);
              setLoading(false);
          });
      } catch (error) {
          console.log('Failed to fetch event list:' + error);
      };
  }

  const handleEditOrder = (id) => {
      setOpenModalUpdate(true);
      (async () => {
          try {
              const response = await orderApi.getDetailOrder(id);
              console.log(response);
              setId(id);
              
              // Set current step based on status
              switch(response.status) {
                  case 'pending':
                      setCurrentStep(0);
                      break;
                  case 'processing':
                      setCurrentStep(1);
                      break;
                  case 'shipped':
                      setCurrentStep(2);
                      break;
                  case 'delivered':
                      setCurrentStep(3);
                      break;
                  case 'cancelled':
                      setCurrentStep(4);
                      break;
                  default:
                      setCurrentStep(0);
              }

              form2.setFieldsValue({
                  status: response.status,
                  address: response.shippingAddressId, 
                  description: "Order placed through checkout",
                  orderTotal: 16261,
                  products: response.items,
                  user: response.userId,
                  billing: response.paymentMethod,
              });
              console.log(form2);
              setLoading(false);
          } catch (error) {
              throw error;
          }
      })();
  }

  const handleSearch = (value) => {
      setSearchText(value);
      if (value === '') {
          setFilteredOrders(order);
      } else {
          const filtered = order.filter(item => 
              item.id.toString().includes(value.toString())
          );
          setFilteredOrders(filtered);
      }
  };

  useEffect(() => {
      const fetchShippingAddresses = async () => {
          try {
              const response = await shippingAddressApi.getAllShippingAddresses();
              setShippingAddresses(response);
          } catch (error) {
              console.log('Failed to fetch shipping addresses:', error);
          }
      };

      const fetchUsers = async () => {
          try {
              const response = await userApi.getAllUsers();
              setUsers(response);
          } catch (error) {
              console.log('Failed to fetch users:', error);
          }
      };

      fetchShippingAddresses();
      fetchUsers();
  }, []);

  const columns = [
      {
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
      },
      {
          title: 'Tổng tiền',
          dataIndex: 'total_amount',
          key: 'total_amount',
          render: (text) => <a>{text?.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</a>,
      },
      {
          title: 'Hình thức thanh toán',
          dataIndex: 'payment_method',
          key: 'payment_method',
      },
      {
          title: 'Trạng thái',
          key: 'status',
          dataIndex: 'status',
          render: (status) => (
              <span>
                  {status === "cancelled" ? <Tag style={{ width: 95, textAlign: "center" }} color="red">Đã hủy</Tag> : 
                   status === "shipped" ? <Tag style={{ width: 95, textAlign: "center" }} color="geekblue">Vận chuyển</Tag> : 
                   status === "delivered" ? <Tag color="green" style={{ width: 95, textAlign: "center" }}>Đã giao</Tag> :
                   status === "processing" ? <Tag color="orange" style={{ width: 95, textAlign: "center" }}>Đang xử lý</Tag> :
                   <Tag color="blue" style={{ width: 95, textAlign: "center" }}>Chờ xác nhận</Tag>}
              </span>
          ),
      },
      {
          title: 'Mô tả',
          dataIndex: 'description',
          key: 'description',
      },
      {
          title: 'Địa chỉ giao hàng',
          dataIndex: 'shipping_address',
          key: 'shipping_address',
          render: (address) => address ? `${address.address_line}, ${address.city}, ${address.state}, ${address.postal_code}, ${address.country}` : 'Không có',
      },
      {
          title: 'Người mua',
          dataIndex: 'user',
          key: 'user',
          render: (user) => user ? user.username : 'Không có',
      },
      {
          title: 'Ngày đặt hàng',
          dataIndex: 'created_at',
          key: 'created_at',
          render: (date) => new Date(date).toLocaleString('vi-VN'),
          sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
      },
      {
          title: 'Action',
          key: 'action',
          render: (text, record) => (
              <div>
                  <Row>
                      <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                          <Button
                              size="small"
                              icon={<EyeOutlined />}
                              style={{ width: 180, borderRadius: 15, height: 30 }}
                              onClick={() => handleViewOrder(record.id)}
                          >
                              Xem
                          </Button>
                          <Button
                              size="small"
                              icon={<EditOutlined />}
                              style={{ width: 180, borderRadius: 15, height: 30 }}
                              onClick={() => handleEditOrder(record.id)}
                          >
                              Quản lý vận đơn
                          </Button>
                      </div>
                  </Row>
              </div>
          ),
      },
  ];

  const handleViewOrder = (orderId) => {
      history.push(`/order-details/${orderId}`);
  };

  useEffect(() => {
      (async () => {
          try {
              await orderApi.getListOrder().then((res) => {
                  console.log(res);
                  // Sort orders by created_at in descending order (newest first)
                  const sortedOrders = res.sort((a, b) => 
                      new Date(b.created_at) - new Date(a.created_at)
                  );
                  setOrder(sortedOrders);
                  setFilteredOrders(sortedOrders);
                  setLoading(false);
              });
          } catch (error) {
              console.log('Failed to fetch event list:' + error);
          }
      })();
  }, [])

  const getStatusText = (status) => {
      switch (status) {
          case 'cancelled':
              return 'Đã hủy';
          case 'shipped':
              return 'Đang vận chuyển';
          case 'delivered':
              return 'Đã giao';
          case 'processing':
              return 'Đang xử lý';
          case 'pending':
              return 'Chờ xác nhận';
          default:
              return status;
      }
  };

  const exportToExcel = () => {
      const worksheet = XLSX.utils.json_to_sheet(filteredOrders.map(item => ({
          ID: item.id,
          'Tổng tiền': item.total_amount,
          'Hình thức thanh toán': item.payment_method,
          'Trạng thái': getStatusText(item.status),
          'Mô tả': item.description,
          'Địa chỉ giao hàng': item.shipping_address ? `${item.shipping_address.address_line}, ${item.shipping_address.city}, ${item.shipping_address.state}, ${item.shipping_address.postal_code}, ${item.shipping_address.country}` : 'Không có',
          'Người mua': item.user ? item.user.username : 'Không có',
          'Ngày đặt hàng': new Date(item.created_at).toLocaleString('vi-VN'),
      })));

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');

      // Generate buffer and save
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: EXCEL_TYPE });
      saveAs(data, 'OrderList.xlsx');
  };

  const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

  return (
      <div>
          <Spin spinning={loading}>
              <div className='container'>
                  <div style={{ marginTop: 20 }}>
                      <Breadcrumb>
                          <Breadcrumb.Item href="">
                              <HomeOutlined />
                          </Breadcrumb.Item>
                          <Breadcrumb.Item href="">
                              <ShoppingCartOutlined />
                              <span>Quản lý đơn hàng</span>
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
                                  <Col span={12}>
                                      <Input
                                          placeholder="Tìm kiếm theo ID đơn hàng"
                                          prefix={<SearchOutlined />}
                                          value={searchText}
                                          onChange={(e) => handleSearch(e.target.value)}
                                          style={{ width: 300 }}
                                      />
                                  </Col>
                                  <Col span={12}>
                                      <Row justify="end">
                                          <Space>
                                              <Button type="primary" onClick={exportToExcel}>
                                                  Xuất Excel
                                              </Button>
                                          </Space>
                                      </Row>
                                  </Col>
                              </Row>
                          </PageHeader>
                      </div>
                  </div>

                  <div style={{ marginTop: 30 }}>
                      <Table 
                          columns={columns} 
                          pagination={{ position: ['bottomCenter'] }} 
                          dataSource={filteredOrders} 
                          scroll={{ x: 1500 }} 
                      />
                  </div>
              </div>

              <Modal
                  title="Tạo danh mục mới"
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
                      name="eventCreate"
                      layout="vertical"
                      initialValues={{
                          residence: ['zhejiang', 'hangzhou', 'xihu'],
                          prefix: '86',
                      }}
                      scrollToFirstError
                  >
                      <Form.Item
                          name="name"
                          label="Tên"
                          rules={[
                              {
                                  required: true,
                                  message: 'Please input your sender name!',
                              },
                          ]}
                          style={{ marginBottom: 10 }}
                      >
                          <Input placeholder="Tên" />
                      </Form.Item>
                      <Form.Item
                          name="description"
                          label="Mô tả"
                          rules={[
                              {
                                  required: true,
                                  message: 'Please input your subject!',
                              },
                          ]}
                          style={{ marginBottom: 10 }}
                      >
                          <Input placeholder="Mô tả" />
                      </Form.Item>

                      <Form.Item
                          name="slug"
                          label="Slug"
                          rules={[
                              {
                                  required: true,
                                  message: 'Please input your content!',
                              },
                          ]}
                          style={{ marginBottom: 10 }}
                      >
                          <Input placeholder="Slug" />
                      </Form.Item>

                  </Form>
              </Modal>

              <Modal
                  title="Cập nhật đơn hàng"
                  visible={openModalUpdate}
                  style={{ top: 100 }}
                  onOk={handleUpdateOrder}
                  onCancel={handleCancel}
                  okText="Xác nhận"
                  cancelText="Hủy"
                  width={600}
              >
                  <Form
                      form={form2}
                      name="eventCreate"
                      layout="vertical"
                      initialValues={{
                          residence: ['zhejiang', 'hangzhou', 'xihu'],
                          prefix: '86',
                      }}
                      scrollToFirstError
                  >
                      <Steps current={currentStep} direction="vertical" onChange={setCurrentStep}>
                          <Step title="Chờ xác nhận" description="Đơn hàng đã được đặt và đang chờ xác nhận" />
                          <Step title="Đang xử lý" description="Đơn hàng đã được xác nhận và đang được xử lý" />
                          <Step title="Đang vận chuyển" description="Đơn hàng đã được giao cho đơn vị vận chuyển" />
                          <Step title="Đã giao hàng" description="Đơn hàng đã được giao thành công" />
                          <Step title="Đã hủy" description="Đơn hàng đã bị hủy" status="error" />
                      </Steps>
                      
                      <div style={{ marginTop: 24 }}>
                          <p>Trạng thái hiện tại sẽ được cập nhật thành: 
                              <strong>
                                  {currentStep === 0 && " Chờ xác nhận"}
                                  {currentStep === 1 && " Đang xử lý"}
                                  {currentStep === 2 && " Đang vận chuyển"}
                                  {currentStep === 3 && " Đã giao hàng"}
                                  {currentStep === 4 && " Đã hủy"}
                              </strong>
                          </p>
                      </div>
                  </Form>
              </Modal>
              <BackTop style={{ textAlign: 'right' }} />
          </Spin>
      </div >
  )
}

export default OrderList;