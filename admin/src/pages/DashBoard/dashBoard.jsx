import {
  ContactsTwoTone,
  DashboardOutlined,
  EnvironmentTwoTone,
  HomeOutlined,
  NotificationTwoTone
} from '@ant-design/icons';
import {
  BackTop,
  Breadcrumb,
  Card,
  Col,
  Row,
  Spin
} from 'antd';
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'; 
import bookApi from '../../apis/bookApi';
import categoryApi from '../../apis/categoryApi';
import orderApi from '../../apis/orderApi'; 
import promotionsApi from '../../apis/promotionsApi';
import "./dashBoard.css";

const DashBoard = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promotionTotal, setPromotionTotal] = useState();
  const [bookTotal, setBookTotal] = useState(null);
  const [orderTotal, setOrderTotal] = useState(null);
  const [revenueData, setRevenueData] = useState([]); 

  useEffect(() => {
      (async () => {
          try {
              const promotions = await promotionsApi.getListPromotions();
              setPromotionTotal(promotions);

              const books = await bookApi.getListBooks();
              setBookTotal(books);

              const categories = await categoryApi.getListCategory();
              setCategoryList(categories);

              const orders = await orderApi.getListOrder();
              setOrderTotal(orders);

              // Tính toán doanh thu theo tháng
              const revenueMap = {};
              orders.forEach(order => {
                  // Chỉ tính các đơn hàng không bị hủy (CANCELLED)
                  if (order.status !== 'CANCELLED') {
                      const date = new Date(order.created_at);
                      const month = date.toLocaleString('vi-VN', { month: 'long', year: 'numeric' });
                      
                      if (!revenueMap[month]) {
                          revenueMap[month] = {
                              pending: 0,
                              processing: 0,
                              shipped: 0,
                              delivered: 0,
                              total: 0
                          };
                      }
                      
                      // Cộng doanh thu theo trạng thái
                      const status = order.status.toLowerCase();
                      revenueMap[month][status] = (revenueMap[month][status] || 0) + order.total_amount;
                      revenueMap[month].total += order.total_amount;
                  }
              });

              // Chuyển đổi dữ liệu cho biểu đồ cột
              const revenueArray = Object.entries(revenueMap).map(([name, data]) => ({
                  name,
                  'Chờ xác nhận': data.pending || 0,
                  'Đang xử lý': data.processing || 0,
                  'Đang giao': data.shipped || 0,
                  'Đã giao': data.delivered || 0,
                  'Tổng': data.total
              }));

              // Chuyển đổi dữ liệu cho biểu đồ tròn
              const pieData = Object.entries(revenueMap).map(([name, data]) => ({
                  name,
                  value: data.total
              }));

              setRevenueData({
                  bar: revenueArray,
                  pie: pieData
              });

              setLoading(false);
          } catch (error) {
              console.log('Failed to fetch data:', error);
              setLoading(false);
          }
      })();
  }, []);

  // Màu sắc cho các trạng thái
  const COLORS = {
      'Chờ xác nhận': '#ffc107',
      'Đang xử lý': '#17a2b8',
      'Đang giao': '#007bff',
      'Đã giao': '#28a745',
      'Tổng': '#6f42c1'
  };

  // Format số tiền
  const formatCurrency = (value) => {
      return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND'
      }).format(value);
  };

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
                              <DashboardOutlined />
                              <span>DashBoard</span>
                          </Breadcrumb.Item>
                      </Breadcrumb>
                  </div>
                  <Row gutter={12} style={{ marginTop: 20 }}>
                      <Col span={6}>
                          <Card className="card_total" bordered={false}>
                              <div className='card_number'>
                                  <div>
                                      <div className='number_total'>{categoryList?.length}</div>
                                      <div className='title_total'>Số danh mục</div>
                                  </div>
                                  <div>
                                      <ContactsTwoTone style={{ fontSize: 48 }} />
                                  </div>
                              </div>
                          </Card>
                      </Col>
                      <Col span={6}>
                          <Card className="card_total" bordered={false}>
                              <div className='card_number'>
                                  <div>
                                      <div className='number_total'>{promotionTotal?.length}</div>
                                      <div className='title_total'>Tổng khuyến mãi</div>
                                  </div>
                                  <div>
                                      <NotificationTwoTone style={{ fontSize: 48 }} />
                                  </div>
                              </div>
                          </Card>
                      </Col>

                      <Col span={6}>
                          <Card className="card_total" bordered={false}>
                              <div className='card_number'>
                                  <div>
                                      <div className='number_total'>{bookTotal?.length || 0} </div>
                                      <div className='title_total'>Tổng sách</div>
                                  </div>
                                  <div>
                                      <EnvironmentTwoTone style={{ fontSize: 48 }} />
                                  </div>
                              </div>
                          </Card>
                      </Col>

                      <Col span={6}>
                          <Card className="card_total" bordered={false}>
                              <div className='card_number'>
                                  <div>
                                      <div className='number_total'>{orderTotal?.length || 0} </div>
                                      <div className='title_total'>Tổng đơn hàng</div>
                                  </div>
                                  <div>
                                      <EnvironmentTwoTone style={{ fontSize: 48 }} />
                                  </div>
                              </div>
                          </Card>
                      </Col>
                  </Row>

                  {/* Chart Container */}
                  <div className="chart-container">
                      <div className="chart-card">
                          <h3 className="chart-title">Doanh thu theo tháng</h3>
                          <BarChart width={800} height={400} data={revenueData?.bar || []}>
                              <XAxis dataKey="name" />
                              <YAxis tickFormatter={(value) => formatCurrency(value)} />
                              <Tooltip 
                                  formatter={(value) => formatCurrency(value)}
                                  labelStyle={{ color: 'black' }}
                              />
                              <Legend />
                              <Bar dataKey="Chờ xác nhận" stackId="a" fill={COLORS['Chờ xác nhận']} />
                              <Bar dataKey="Đang xử lý" stackId="a" fill={COLORS['Đang xử lý']} />
                              <Bar dataKey="Đang giao" stackId="a" fill={COLORS['Đang giao']} />
                              <Bar dataKey="Đã giao" stackId="a" fill={COLORS['Đã giao']} />
                          </BarChart>
                      </div>

                      <div className="chart-card">
                          <h3 className="chart-title">Doanh thu phân bổ theo tháng</h3>
                          <PieChart width={400} height={400}>
                              <Pie
                                  data={revenueData?.pie || []}
                                  dataKey="value"
                                  nameKey="name"
                                  cx="50%"
                                  cy="50%"
                                  outerRadius={100}
                                  label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                              >
                                  {(revenueData?.pie || []).map((entry, index) => (
                                      <Cell 
                                          key={`cell-${index}`} 
                                          fill={`#${Math.floor(Math.random()*16777215).toString(16)}`} 
                                      />
                                  ))}
                              </Pie>
                              <Tooltip formatter={(value) => formatCurrency(value)} />
                          </PieChart>
                      </div>
                  </div>
              </div>
              <BackTop style={{ textAlign: 'right' }} />
          </Spin>
      </div>
  );
}

export default DashBoard;
