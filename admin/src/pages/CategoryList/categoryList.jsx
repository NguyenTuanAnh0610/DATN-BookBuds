import {
  DeleteOutlined,
  EditOutlined,
  HomeOutlined,
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
  Modal, Popconfirm,
  Row,
  Select,
  Space,
  Spin,
  Table,
  notification
} from 'antd';
import React, { useEffect, useState } from 'react';
import categoryApi from "../../apis/categoryApi";
import uploadFileApi from '../../apis/uploadFileApi';
import "./categoryList.css";

const CategoryList = () => {

  const [category, setCategory] = useState([]);

  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [id, setId] = useState();


  const showModal = () => {
      setOpenModalCreate(true);
  };

  const createCategory = async (categoryList) => {
      try {
          const response = await categoryApi.createCategory(categoryList);
          if (response) {
              notification["success"]({
                  message: `Thông báo`,
                  description: 'Tạo danh mục thành công',
              });
              handleCategoryList();
              setOpenModalCreate(false);
          }
      } catch (error) {
          notification["error"]({
              message: `Thông báo`,
              description: 'Tạo danh mục thất bại',
          });
      }
  }

  const updateCategory = async (categoryList) => {
      try {
          const response = await categoryApi.updateCategory(id, categoryList);
          if (response) {
              notification["success"]({
                  message: `Thông báo`,
                  description: 'Chỉnh sửa danh mục thành công',
              });
              handleCategoryList();
              setOpenModalUpdate(false);
          }
      } catch (error) {
          notification["error"]({
              message: `Thông báo`,
              description: 'Chỉnh sửa danh mục thất bại',
          });
      }
  }

  const handleOkUser = async (values) => {
      setLoading(true);
      const categoryList = {
          "name": values.name,
      };
      await createCategory(categoryList);
      setLoading(false);
  }

  const handleUpdateCategory = async (values) => {
      setLoading(true);
      const categoryList = {
          "name": values.name,
      };
      await updateCategory(categoryList);
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

  const handleCategoryList = async () => {
      try {
          await categoryApi.getListCategory().then((res) => {
              setCategory(res);
              setLoading(false);
          });
      } catch (error) {
          console.log('Failed to fetch event list:' + error);
      };
  }

  const handleDeleteCategory = async (id) => {
      setLoading(true);
      try {
          await categoryApi.deleteCategory(id).then(response => {
              if (response === undefined) {
                  notification["error"]({
                      message: `Thông báo`,
                      description:
                          'Xóa danh mục thất bại',

                  });
                  setLoading(false);
              }
              else {
                  notification["success"]({
                      message: `Thông báo`,
                      description:
                          'Xóa danh mục thành công',

                  });
                  handleCategoryList();
                  setLoading(false);
              }
          }
          );

      } catch (error) {
          console.log('Failed to fetch event list:' + error);
      }
  }

  const handleEditCategory = (id) => {
      setOpenModalUpdate(true);
      (async () => {
          try {
              const response = await categoryApi.getDetailCategory(id);
              setId(id);
              form2.setFieldsValue({
                  name: response.name,
              });
              console.log(form2);
              setLoading(false);
          } catch (error) {
              throw error;
          }
      })();
  }



  const columns = [
      {
          title: 'ID',
          key: 'index',
          render: (text, record, index) => index + 1,
      },
      {
          title: 'Tên',
          dataIndex: 'name',
          key: 'name',
          render: (text) => <a>{text}</a>,
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
                      onClick={() => handleEditCategory(record.id)}
                  >
                      {"Chỉnh sửa"}
                  </Button>
                  <Popconfirm
                      title="Bạn có chắc chắn xóa danh mục này?"
                      onConfirm={() => handleDeleteCategory(record.id)}
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
      handleCategoryList();
  }, [])
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
                              <ShoppingOutlined />
                              <span>Danh mục sản phẩm</span>
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
                                              <Button onClick={showModal} icon={<PlusOutlined />} style={{ marginLeft: 10 }} >Tạo danh mục</Button>
                                          </Space>
                                      </Row>
                                  </Col>
                              </Row>

                          </PageHeader>
                      </div>
                  </div>

                  <div style={{ marginTop: 30 }}>
                      <Table columns={columns} pagination={{ position: ['bottomCenter'] }} dataSource={category} />
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
                                  message: 'Vui lòng nhập tên!',
                              },
                          ]}
                          style={{ marginBottom: 10 }}
                      >
                          <Input placeholder="Tên" />
                      </Form.Item>

                      
                  </Form>
              </Modal>

              <Modal
                  title="Chỉnh sửa danh mục"
                  visible={openModalUpdate}
                  style={{ top: 100 }}
                  onOk={() => {
                      form2
                          .validateFields()
                          .then((values) => {
                              form2.resetFields();
                              handleUpdateCategory(values);
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
                      
                  </Form>
              </Modal>

              <BackTop style={{ textAlign: 'right' }} />
          </Spin>
      </div >
  )
}

export default CategoryList;