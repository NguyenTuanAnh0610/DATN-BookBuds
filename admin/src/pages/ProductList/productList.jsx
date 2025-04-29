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
    Image,
    Input,
    Modal,
    Popconfirm,
    Row,
    Select,
    Space,
    Spin,
    Table,
    Tag,
    notification
} from 'antd';
import 'firebase/storage';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import bookApi from '../../apis/bookApi';
import categoryApi from '../../apis/categoryApi';
import { storage } from '../../config/FirebaseConfig';
import "./productList.css";

const { Option } = Select;

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [id, setId] = useState();
    const [image, setImage] = useState();
    const [bookType, setBookType] = useState("PRINT");
    const [accessLink, setAccessLink] = useState();
    const [searchTerm, setSearchTerm] = useState("");

    const showModal = () => {
        setOpenModalCreate(true);
    };


    const handleProductList = async () => {
        try {
            const res = await bookApi.getListBooks();
            setProducts(res);
            setLoading(false);
        } catch (error) {
            console.log('Failed to fetch product list:' + error);
        }
    }

    const handleCategoryList = async () => {
        try {
            const res = await categoryApi.getListCategory();
            setCategories(res);
        } catch (error) {
            console.log('Failed to fetch category list:' + error);
        }
    }
    const handleCancel = () => {
        setOpenModalCreate(false);
        setOpenModalUpdate(false);
    };

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    const handleOnChange = async (info) => {
        if (info.file.status === "done") {
            // Lấy URL từ response của Cloudinary
            const url = info.file.response.secure_url;
            setImage(url);
            notification.success({
                message: "Upload thành công",
            });
        } else if (info.file.status === "error") {
            notification.error({
                message: "Upload thất bại",
            });
        }
    };

    const handleOkUser = async (values) => {
        setLoading(true);
        const bookData = {
            title: values.title,
            author: values.author,
            publisher: values.publisher,
            publication_year: values.publicationYear,
            genre: values.genre,
            language: values.language,
            image: image,
            description: values.description,
            price: values.price,
            stock_quantity: values.stockQuantity,
            status: values.status,
            book_type: values.bookType,
            categories_id: values.categoryId,
            dimensions: values.dimensions,
            book_weight: values.bookWeight,
            cover_type: values.coverType,
            isbn: values.isbn,
            paper_type: values.paperType
        };
        try {
            const response = await bookApi.createBook(bookData);
            if (response) {
                notification["success"]({
                    message: `Thông báo`,
                    description: 'Tạo sách thành công',
                });
                handleProductList();
                setOpenModalCreate(false);
                form.resetFields();
            }
        } catch (error) {
            notification["error"]({
                message: `Thông báo`,
                description: 'Tạo sách thất bại',
            });
        }
        setLoading(false);
    }

    const handleEditBook = async (bookId) => {
        setOpenModalUpdate(true);
        try {
            const response = await bookApi.getDetailBook(bookId);
            setId(bookId);
            form2.setFieldsValue({
                title: response.title,
                author: response.author,
                publisher: response.publisher,
                publicationYear: response.publication_year,
                genre: response.genre,
                language: response.language,
                categoryId: response.categories_id,
                description: response.description,
                price: response.price,
                stockQuantity: response.stock_quantity,
                status: response.status,
                bookType: response.book_type,
                dimensions: response.dimensions,
                bookWeight: response.book_weight,
                coverType: response.cover_type,
                isbn: response.isbn,
                paperType: response.paper_type
            });
            setImage(response.image);
            setBookType(response.book_type);
        } catch (error) {
            notification["error"]({
                message: `Thông báo`,
                description: 'Lấy thông tin sách thất bại',
            });
        }
    };

    const handleUpdateBook = async (values) => {
        setLoading(true);
        const bookData = {
            title: values.title,
            author: values.author,
            publisher: values.publisher,
            publication_year: values.publicationYear,
            genre: values.genre,
            language: values.language,
            image: image,
            description: values.description,
            price: values.price,
            stock_quantity: values.stockQuantity,
            status: values.status,
            book_type: values.bookType,
            categories_id: values.categoryId,
            dimensions: values.dimensions,
            book_weight: values.bookWeight,
            cover_type: values.coverType,
            isbn: values.isbn,
            paper_type: values.paperType
        };
        try {
            await bookApi.updateBook(id, bookData);
            notification["success"]({
                message: `Thông báo`,
                description: 'Cập nhật sách thành công',
            });
            handleProductList();
            setOpenModalUpdate(false);
            form2.resetFields();
        } catch (error) {
            notification["error"]({
                message: `Thông báo`,
                description: 'Cập nhật sách thất bại',
            });
        }
        setLoading(false);
    };

    const handleDeleteBook = async (bookId) => {
        setLoading(true);
        try {
            await bookApi.deleteBook(bookId);
            notification["success"]({
                message: `Thông báo`,
                description: 'Xóa sách thành công',
            });
            handleProductList();
            setLoading(false);
        } catch (error) {
            notification["error"]({
                message: `Thông báo`,
                description: 'Xóa sách thất bại',
            });
            setLoading(false);
        }
    };


    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        {
            title: 'ID',
            key: 'id',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'image',
            key: 'image',
            render: (text) => <Image src={text} alt="book cover" style={{ width: 50, height: 50 }} />,
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Tác giả',
            dataIndex: 'author',
            key: 'author',
        },
        {
            title: 'Nhà xuất bản',
            dataIndex: 'publisher',
            key: 'publisher',
        },
        {
            title: 'Năm xuất bản',
            dataIndex: 'publication_year',
            key: 'publication_year',
        },
        {
            title: 'Thể loại',
            dataIndex: 'genre',
            key: 'genre',
        },
        {
            title: 'Ngôn ngữ',
            dataIndex: 'language',
            key: 'language',
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (text) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(text),
        },
        {
            title: 'Số lượng tồn kho',
            dataIndex: 'stock_quantity',
            key: 'stock_quantity',
        },
        {
            title: 'Kích thước',
            dataIndex: 'dimensions',
            key: 'dimensions',
        },
        {
            title: 'Trọng lượng (gram)',
            dataIndex: 'book_weight',
            key: 'book_weight',
        },
        {
            title: 'Loại bìa',
            dataIndex: 'cover_type',
            key: 'cover_type',
            render: (text) => {
                let color = text === 'HARDCOVER' ? 'blue' : 'green';
                return <Tag color={color}>{text === 'HARDCOVER' ? 'Bìa cứng' : 'Bìa mềm'}</Tag>;
            },
        },
        {
            title: 'ISBN',
            dataIndex: 'isbn',
            key: 'isbn',
        },
        {
            title: 'Loại giấy',
            dataIndex: 'paper_type',
            key: 'paper_type',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (text) => {
                let color = text === 'ACTIVE' ? 'green' : 'red';
                return <Tag color={color}>{text === 'ACTIVE' ? 'Kích hoạt' : 'Không kích hoạt'}</Tag>;
            },
        },
        {
            title: 'Loại sách',
            dataIndex: 'book_type',
            key: 'book_type',
            render: (text) => {
                return <Tag color="blue">{text === 'PRINT' ? 'In' : text}</Tag>;
            },
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
                        onClick={() => handleEditBook(record.id)}
                    >
                        {"Chỉnh sửa"}
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc chắn xóa sách này?"
                        onConfirm={() => handleDeleteBook(record.id)}
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
        handleProductList();
        handleCategoryList();
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
                                <span>Danh sách sản phẩm</span>
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
                                            placeholder="Tìm kiếm"
                                            allowClear
                                            onChange={(e) => handleSearch(e.target.value)}
                                            style={{ width: 300 }}
                                        />
                                    </Col>
                                    <Col span="6">
                                        <Row justify="end">
                                            <Space>
                                                <Button onClick={showModal} icon={<PlusOutlined />} style={{ marginLeft: 10 }} >Tạo sách</Button>
                                            </Space>
                                        </Row>
                                    </Col>
                                </Row>
                            </PageHeader>
                        </div>
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <Table columns={columns} pagination={{ position: ['bottomCenter'] }} dataSource={filteredProducts} />
                    </div>
                </div>

                <Modal
                    title="Tạo sách mới"
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
                    onCancel={handleCancel}
                    okText="Hoàn thành"
                    cancelText="Hủy"
                    width={600}
                >
                    <Form
                        form={form}
                        name="bookCreate"
                        layout="vertical"
                        scrollToFirstError
                    >
                        <Form.Item
                            name="title"
                            label="Tiêu đề"
                            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                        >
                            <Input placeholder="Tiêu đề" />
                        </Form.Item>
                        <Form.Item
                            name="author"
                            label="Tác giả"
                            rules={[{ required: true, message: 'Vui lòng nhập tác giả!' }]}
                        >
                            <Input placeholder="Tác giả" />
                        </Form.Item>
                        <Form.Item
                            name="publisher"
                            label="Nhà xuất bản"
                            rules={[{ required: true, message: 'Vui lòng nhập nhà xuất bản!' }]}
                        >
                            <Input placeholder="Nhà xuất bản" />
                        </Form.Item>
                        <Form.Item
                            name="publicationYear"
                            label="Năm xuất bản"
                            rules={[{ required: true, message: 'Vui lòng nhập năm xuất bản!' }]}
                        >
                            <Input type="number" placeholder="Năm xuất bản" />
                        </Form.Item>
                        <Form.Item
                            name="genre"
                            label="Thể loại"
                            rules={[{ required: true, message: 'Vui lòng nhập thể loại!' }]}
                        >
                            <Input placeholder="Thể loại" />
                        </Form.Item>
                        <Form.Item
                            name="language"
                            label="Ngôn ngữ"
                            rules={[{ required: true, message: 'Vui lòng nhập ngôn ngữ!' }]}
                        >
                            <Input placeholder="Ngôn ngữ" />
                        </Form.Item>
                        <Form.Item
                            label="Upload"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                        >
                            <Upload
                                action="https://api.cloudinary.com/v1_1/dmw7rvzg2/image/upload"
                                listType="picture-card"
                                data={{ upload_preset: "demo-image" }}
                                onChange={handleOnChange}
                            >
                                <button
                                    style={{
                                        border: 0,
                                        background: "none",
                                    }}
                                    type="button"
                                >
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </button>
                            </Upload>
                        </Form.Item>
                        <Form.Item
                            name="categoryId"
                            label="Danh mục"
                            rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                        >
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label="Mô tả"
                            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                        >
                            <Input.TextArea placeholder="Mô tả" />
                        </Form.Item>
                        <Form.Item
                            name="price"
                            label="Giá"
                            rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
                        >
                            <Input type="number" placeholder="Giá" />
                        </Form.Item>
                        <Form.Item
                            name="stockQuantity"
                            label="Số lượng tồn kho"
                            rules={[{ required: true, message: 'Vui lòng nhập số lượng tồn kho!' }]}
                        >
                            <Input type="number" placeholder="Số lượng tồn kho" />
                        </Form.Item>
                        <Form.Item
                            name="status"
                            label="Trạng thái"
                            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                        >
                            <Select placeholder="Chọn trạng thái">
                                <Option value="ACTIVE">Kích hoạt</Option>
                                <Option value="INACTIVE">Không kích hoạt</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="bookType"
                            label="Loại sách"
                            rules={[{ required: true, message: 'Vui lòng chọn loại sách!' }]}
                        >
                            <Select placeholder="Chọn loại sách">
                                <Option value="PRINT">In</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="dimensions"
                            label="Kích thước"
                            rules={[{ required: true, message: 'Vui lòng nhập kích thước!' }]}
                        >
                            <Input placeholder="VD: 20 x 15 x 1.5 cm" />
                        </Form.Item>
                        <Form.Item
                            name="bookWeight"
                            label="Trọng lượng (gram)"
                            rules={[{ required: true, message: 'Vui lòng nhập trọng lượng!' }]}
                        >
                            <Input type="number" placeholder="VD: 300" />
                        </Form.Item>
                        <Form.Item
                            name="coverType"
                            label="Loại bìa"
                            rules={[{ required: true, message: 'Vui lòng chọn loại bìa!' }]}
                        >
                            <Select placeholder="Chọn loại bìa">
                                <Option value="HARDCOVER">Bìa cứng</Option>
                                <Option value="PAPERBACK">Bìa mềm</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="isbn"
                            label="ISBN"
                            rules={[{ required: true, message: 'Vui lòng nhập mã ISBN!' }]}
                        >
                            <Input placeholder="VD: 9781234567890" maxLength={13} />
                        </Form.Item>
                        <Form.Item
                            name="paperType"
                            label="Loại giấy"
                            rules={[{ required: true, message: 'Vui lòng nhập loại giấy!' }]}
                        >
                            <Input placeholder="VD: Giấy ford" />
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal
                    title="Chỉnh sửa sách"
                    visible={openModalUpdate}
                    style={{ top: 100 }}
                    onOk={() => {
                        form2
                            .validateFields()
                            .then((values) => {
                                form2.resetFields();
                                handleUpdateBook(values);
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
                        name="bookUpdate"
                        layout="vertical"
                        scrollToFirstError
                    >
                        <Form.Item
                            name="title"
                            label="Tiêu đề"
                            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                        >
                            <Input placeholder="Tiêu đề" />
                        </Form.Item>
                        <Form.Item
                            name="author"
                            label="Tác giả"
                            rules={[{ required: true, message: 'Vui lòng nhập tác giả!' }]}
                        >
                            <Input placeholder="Tác giả" />
                        </Form.Item>
                        <Form.Item
                            name="publisher"
                            label="Nhà xuất bản"
                            rules={[{ required: true, message: 'Vui lòng nhập nhà xuất bản!' }]}
                        >
                            <Input placeholder="Nhà xuất bản" />
                        </Form.Item>
                        <Form.Item
                            name="publicationYear"
                            label="Năm xuất bản"
                            rules={[{ required: true, message: 'Vui lòng nhập năm xuất bản!' }]}
                        >
                            <Input type="number" placeholder="Năm xuất bản" />
                        </Form.Item>
                        <Form.Item
                            name="genre"
                            label="Thể loại"
                            rules={[{ required: true, message: 'Vui lòng nhập thể loại!' }]}
                        >
                            <Input placeholder="Thể loại" />
                        </Form.Item>
                        <Form.Item
                            name="language"
                            label="Ngôn ngữ"
                            rules={[{ required: true, message: 'Vui lòng nhập ngôn ngữ!' }]}
                        >
                            <Input placeholder="Ngôn ngữ" />
                        </Form.Item>
                        <Form.Item
                            label="Upload"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                        >
                            <Upload
                                action="https://api.cloudinary.com/v1_1/dmw7rvzg2/image/upload"
                                listType="picture-card"
                                data={{ upload_preset: "demo-image" }}
                                onChange={handleOnChange}
                            >
                                <button
                                    style={{
                                        border: 0,
                                        background: "none",
                                    }}
                                    type="button"
                                >
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </button>
                            </Upload>
                        </Form.Item>
                        <Form.Item
                            name="categoryId"
                            label="Danh mục"
                            rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                        >
                            <Select placeholder="Chọn danh mục">
                                {categories.map(category => (
                                    <Option key={category.id} value={category.id}>{category.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label="Mô tả"
                            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                        >
                            <Input.TextArea placeholder="Mô tả" />
                        </Form.Item>
                        <Form.Item
                            name="price"
                            label="Giá"
                            rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
                        >
                            <Input type="number" placeholder="Giá" />
                        </Form.Item>
                        <Form.Item
                            name="stockQuantity"
                            label="Số lượng tồn kho"
                            rules={[{ required: true, message: 'Vui lòng nhập số lượng tồn kho!' }]}
                        >
                            <Input type="number" placeholder="Số lượng tồn kho" />
                        </Form.Item>
                        <Form.Item
                            name="status"
                            label="Trạng thái"
                            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                        >
                            <Select placeholder="Chọn trạng thái">
                                <Option value="ACTIVE">Kích hoạt</Option>
                                <Option value="INACTIVE">Không kích hoạt</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="bookType"
                            label="Loại sách"
                            rules={[{ required: true, message: 'Vui lòng chọn loại sách!' }]}
                        >
                            <Select placeholder="Chọn loại sách">
                                <Option value="PRINT">In</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="dimensions"
                            label="Kích thước"
                            rules={[{ required: true, message: 'Vui lòng nhập kích thước!' }]}
                        >
                            <Input placeholder="VD: 20 x 15 x 1.5 cm" />
                        </Form.Item>
                        <Form.Item
                            name="bookWeight"
                            label="Trọng lượng (gram)"
                            rules={[{ required: true, message: 'Vui lòng nhập trọng lượng!' }]}
                        >
                            <Input type="number" placeholder="VD: 300" />
                        </Form.Item>
                        <Form.Item
                            name="coverType"
                            label="Loại bìa"
                            rules={[{ required: true, message: 'Vui lòng chọn loại bìa!' }]}
                        >
                            <Select placeholder="Chọn loại bìa">
                                <Option value="HARDCOVER">Bìa cứng</Option>
                                <Option value="PAPERBACK">Bìa mềm</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="isbn"
                            label="ISBN"
                            rules={[{ required: true, message: 'Vui lòng nhập mã ISBN!' }]}
                        >
                            <Input placeholder="VD: 9781234567890" maxLength={13} />
                        </Form.Item>
                        <Form.Item
                            name="paperType"
                            label="Loại giấy"
                            rules={[{ required: true, message: 'Vui lòng nhập loại giấy!' }]}
                        >
                            <Input placeholder="VD: Giấy ford" />
                        </Form.Item>
                    </Form>
                </Modal>

                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div>
    )
}

export default ProductList;