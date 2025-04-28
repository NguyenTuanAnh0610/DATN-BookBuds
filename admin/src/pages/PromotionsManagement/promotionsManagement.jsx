import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ShoppingOutlined
} from '@ant-design/icons';
import { PageHeader } from '@ant-design/pro-layout';
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
  DatePicker,
  Select
} from 'antd';
import React, { useEffect, useState } from 'react';
import promotionsApi from '../../apis/promotionsApi';
import "./promotionsManagement.css";
import dayjs from 'dayjs';

const { Option } = Select;

const PromotionsManagement = () => {
  const [promotions, setPromotions] = useState([]);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [id, setId] = useState();
  const [discountType, setDiscountType] = useState("PERCENT");

  const showModal = () => {
      setOpenModalCreate(true);
  };

  const createPromotion = async (promotionData) => {
      try {
          const response = await promotionsApi.createPromotion(promotionData);
          if (response) {
              notification["success"]({
                  message: `Thông báo`,
                  description: 'Tạo khuyến mãi thành công',
              });
              handlePromotionsList();
              setOpenModalCreate(false);
          }
      } catch (error) {
          notification["error"]({
              message: `Thông báo`,
              description: 'Tạo khuyến mãi thất bại',
          });
      }
  }

  const updatePromotion = async (promotionData) => {
      try {
          const response = await promotionsApi.updatePromotion(id, promotionData);
          if (response) {
              notification["success"]({
                  message: `Thông báo`,
                  description: 'Chỉnh sửa khuyến mãi thành công',
              });
              handlePromotionsList();
              setOpenModalUpdate(false);
          }
      } catch (error) {
          notification["error"]({
              message: `Thông báo`,
              description: 'Chỉnh sửa khuyến mãi thất bại',
          });
      }
  }

  const handleOkUser = async (values) => {
      setLoading(true);
      const promotionData = {
          "promotion_name": values.name,
          "description": values.description,
          "start_date": values.startDate.format(),
          "end_date": values.endDate.format(),
          "discount_type": discountType,
          "discount_value": Number(values.discountValue),
          "status": "ACTIVE"
      };
      await createPromotion(promotionData);
      setLoading(false);
  }

  const handleUpdatePromotion = async (values) => {
      setLoading(true);
      const promotionData = {
          "promotion_name": values.name,
          "description": values.description,
          "start_date": values.startDate.format(),
          "end_date": values.endDate.format(),
          "discount_type": discountType,
          "discount_value": Number(values.discountValue),
          "status": "ACTIVE"
      };
      await updatePromotion(promotionData);
      setLoading(false);
  }

  const handleCancel = (type) => {
      if (type === "create") {
          setOpenModalCreate(false);
      } else {
          setOpenModalUpdate(false);
      }
  };

  const handlePromotionsList = async () => {
      try {
          const res = await promotionsApi.getListPromotions();
          setPromotions(res);
          setLoading(false);
      } catch (error) {
          console.log('Failed to fetch promotions list:' + error);
      }
  }

  const handleDeletePromotion = async (id) => {
      setLoading(true);
      try {
          await promotionsApi.deletePromotion(id);
          notification["success"]({
              message: `Thông báo`,
              description: 'Xóa khuyến mãi thành công',
          });
          handlePromotionsList();
          setLoading(false);
      } catch (error) {
          notification["error"]({
              message: `Thông báo`,
              description: 'Xóa khuyến mãi thất bại',
          });
          setLoading(false);
      }
  }
  const handleEditPromotion = (id) => {
      setOpenModalUpdate(true);
      (async () => {
          try {
              const response = await promotionsApi.getDetailPromotion(id);
              setId(id);
              form2.setFieldsValue({
                  name: response.promotion_name,
                  description: response.description,
                  startDate: dayjs(response.start_date),
                  endDate: dayjs(response.end_date),
                  discountValue: response.discount_value,
                  discountType: response.discount_type,
              });
          } catch (error) {
              throw error;
          }
      })();
  }

  const getMaxValue = () => {
      return discountType === "PERCENT" ? 100 : Number.MAX_SAFE_INTEGER;
  };

  const columns = [
      {
          title: 'ID',
          key: 'index',
          render: (text, record, index) => index + 1,
      },
      {
          title: 'Tên',
          dataIndex: 'promotion_name',
          key: 'promotion_name',
          render: (text) => <a>{text}</a>,
      },
      {
          title: 'Mô tả',
          dataIndex: 'description',
          key: 'description',
      },
      {
          title: 'Ngày bắt đầu',
          dataIndex: 'start_date',
          key: 'start_date',
      },
      {
          title: 'Ngày kết thúc',
          dataIndex: 'end_date',
          key: 'end_date',
      },
      {
          title: 'Loại giảm giá',
          dataIndex: 'discount_type',
          key: 'discount_type',
      },
      {
          title: 'Giá trị giảm giá',
          dataIndex: 'discount_value',
          key: 'discount_value',
      },
      {
          title: 'Trạng thái',
          dataIndex: 'status',
          key: 'status',
      },
      {
          title: 'Action',
          key: 'action',
          render: (text, record) => (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Button
                      size="small"
                      icon={<EditOutlined />}
                      style={{ width: 150, borderRadius: 15, height: 30, marginBottom: 10 }}
                      onClick={() => handleEditPromotion(record.promotion_id)}
                  >
                      {"Chỉnh sửa"}
                  </Button>
                  <Popconfirm
                      title="Bạn có chắc chắn xóa khuyến mãi này?"
                      onConfirm={() => handleDeletePromotion(record.promotion_id)}
                      okText="Yes"
                      cancelText="No"
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
      handlePromotionsList();
  }, []);

  return (
      <div>
          <Spin spinning={loading}>
              <div className='container'>
                  <div style={{ marginTop: 20 }}>
                      <Breadcrumb>
                          <Breadcrumb.Item href="">
                              <ShoppingOutlined />
                          </Breadcrumb.Item>
                          <Breadcrumb.Item href="">
                              <span>Quản lý khuyến mãi</span>
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
                                  </Col>
                                  <Col span="6">
                                      <Row justify="end">
                                          <Space>
                                              <Button onClick={showModal} icon={<PlusOutlined />} style={{ marginLeft: 10 }} >Tạo khuyến mãi</Button>
                                          </Space>
                                      </Row>
                                  </Col>
                              </Row>
                          </PageHeader>

                      </div>
                  </div>

                  <div style={{ marginTop: 30 }}>
                      <Table columns={columns} pagination={{ position: ['bottomCenter'] }} dataSource={promotions} />
                  </div>
              </div>

              <Modal
                  title="Tạo khuyến mãi mới"
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
                      name="promotionCreate"
                      layout="vertical"
                      scrollToFirstError
                  >
                      <Form.Item
                          name="name"
                          label="Tên"
                          rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                          style={{ marginBottom: 10 }}
                      >
                          <Input placeholder="Tên" />
                      </Form.Item>
                      <Form.Item
                          name="description"
                          label="Mô tả"
                          rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                          style={{ marginBottom: 10 }}
                      >
                          <Input placeholder="Mô tả" />
                      </Form.Item>
                      <Form.Item
                          name="startDate"
                          label="Ngày bắt đầu"
                          rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
                      >
                          <DatePicker showTime format="YYYY-MM-DD" />
                      </Form.Item>
                      <Form.Item
                          name="endDate"
                          label="Ngày kết thúc"
                          rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc!' }]}
                      >
                          <DatePicker showTime format="YYYY-MM-DD" />
                      </Form.Item>
                      <Form.Item
                          name="discountValue"
                          label="Giá trị giảm giá"
                          rules={[
                              { required: true, message: 'Vui lòng nhập giá trị giảm giá!' },
                              () => ({
                                  validator(_, value) {
                                      const numValue = Number(value);
                                      if (isNaN(numValue) || numValue < 0) {
                                          return Promise.reject('Giá trị giảm giá không hợp lệ');
                                      }
                                      if (discountType === "PERCENT" && numValue > 100) {
                                          return Promise.reject('Giảm giá theo phần trăm không được vượt quá 100%');
                                      }
                                      return Promise.resolve();
                                  },
                              })
                          ]}
                      >
                          <Input 
                              type="number"
                              min={0}
                              max={discountType === "PERCENT" ? 100 : undefined}
                              step={discountType === "PERCENT" ? 1 : 1000}
                              placeholder={discountType === "PERCENT" ? "Nhập giá trị từ 0-100" : "Nhập số tiền giảm"}
                          />
                      </Form.Item>
                      <Form.Item label="Loại giảm giá">
                          <Select defaultValue="PERCENT" onChange={(value) => {
                              setDiscountType(value);
                              form.validateFields(['discountValue']);
                          }}>
                              <Option value="PERCENT">Phần trăm</Option>
                              <Option value="FIXED_AMOUNT">Số tiền</Option>
                          </Select>
                      </Form.Item>
                  </Form>
              </Modal>

              <Modal
                  title="Chỉnh sửa khuyến mãi"
                  visible={openModalUpdate}
                  style={{ top: 100 }}
                  onOk={() => {
                      form2
                          .validateFields()
                          .then((values) => {
                              form2.resetFields();
                              handleUpdatePromotion(values);
                          })
                          .catch((info) => {
                              console.log('Validate Failed:', info);
                          });
                  }}
                  onCancel={() => handleCancel("update")}
                  okText="Hoàn thành"
                  cancelText="Hủy"
                  width={600}
              >
                  <Form
                      form={form2}
                      name="promotionUpdate"
                      layout="vertical"
                      scrollToFirstError
                  >
                      <Form.Item
                          name="name"
                          label="Tên"
                          rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                          style={{ marginBottom: 10 }}
                      >
                          <Input placeholder="Tên" />
                      </Form.Item>
                      <Form.Item
                          name="description"
                          label="Mô tả"
                          rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                          style={{ marginBottom: 10 }}
                      >
                          <Input placeholder="Mô tả" />
                      </Form.Item>
                      <Form.Item
                          name="startDate"
                          label="Ngày bắt đầu"
                          rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
                      >
                          <DatePicker showTime format="YYYY-MM-DD" />
                      </Form.Item>
                      <Form.Item
                          name="endDate"
                          label="Ngày kết thúc"
                          rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc!' }]}
                      >
                          <DatePicker showTime format="YYYY-MM-DD" />
                      </Form.Item>
                      <Form.Item
                          name="discountValue"
                          label="Giá trị giảm giá"
                          rules={[
                              { required: true, message: 'Vui lòng nhập giá trị giảm giá!' },
                              () => ({
                                  validator(_, value) {
                                      const numValue = Number(value);
                                      if (isNaN(numValue) || numValue < 0) {
                                          return Promise.reject('Giá trị giảm giá không hợp lệ');
                                      }
                                      if (discountType === "PERCENT" && numValue > 100) {
                                          return Promise.reject('Giảm giá theo phần trăm không được vượt quá 100%');
                                      }
                                      return Promise.resolve();
                                  },
                              })
                          ]}
                      >
                          <Input 
                              type="number"
                              min={0}
                              max={discountType === "PERCENT" ? 100 : undefined}
                              step={discountType === "PERCENT" ? 1 : 1000}
                              placeholder={discountType === "PERCENT" ? "Nhập giá trị từ 0-100" : "Nhập số tiền giảm"}
                          />
                      </Form.Item>
                      <Form.Item label="Loại giảm giá">
                          <Select defaultValue="PERCENT" onChange={(value) => {
                              setDiscountType(value);
                              form2.validateFields(['discountValue']);
                          }}>
                              <Option value="PERCENT">Phần trăm</Option>
                              <Option value="FIXED_AMOUNT">Số tiền</Option>
                          </Select>
                      </Form.Item>
                  </Form>
              </Modal>

              <BackTop style={{ textAlign: 'right' }} />
          </Spin>
      </div>
  )
}

export default PromotionsManagement; 