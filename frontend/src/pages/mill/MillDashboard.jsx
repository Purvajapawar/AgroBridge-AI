import React, { useState, useEffect } from 'react'
import { Row, Col, Card, Statistic, Table, Tag, Typography, Spin, message } from 'antd'
import { 
  ShoppingOutlined, 
  DollarOutlined,
  InboxOutlined,
  CheckCircleOutlined
} from '@ant-design/icons'
import { getMillOrders, getTraderListings } from '../../services/api'

const { Title, Text } = Typography

const MillDashboard = () => {
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    pendingOrders: 0,
    completedOrders: 0
  })

  const userId = localStorage.getItem('userId')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      const ordersResponse = await getMillOrders(userId)
      if (ordersResponse.success) {
        setOrders(ordersResponse.orders)
        
        const totalSpent = ordersResponse.orders.reduce((sum, order) => 
          sum + (order.price * order.quantity), 0
        )
        const pendingOrders = ordersResponse.orders.filter(o => o.status === 'pending').length
        const completedOrders = ordersResponse.orders.filter(o => o.status === 'completed').length
        
        setStats({
          totalOrders: ordersResponse.orders.length,
          totalSpent,
          pendingOrders,
          completedOrders
        })
      }
    } catch (error) {
      message.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      title: 'Order ID',
      dataIndex: '_id',
      key: '_id',
      render: (id) => `#${id.slice(-6).toUpperCase()}`
    },
    {
      title: 'Crop',
      dataIndex: 'crop',
      key: 'crop',
      render: (text) => <Tag color="purple">{text}</Tag>
    },
    {
      title: 'Quantity (q)',
      dataIndex: 'quantity',
      key: 'quantity'
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `₹${price}`
    },
    {
      title: 'Total',
      key: 'total',
      render: (_, record) => `₹${record.price * record.quantity}`
    },
    {
      title: 'Trader',
      dataIndex: 'traderName',
      key: 'traderName'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'completed' ? 'green' : status === 'pending' ? 'orange' : 'blue'}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      )
    }
  ]

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div className="fade-in">
      <Title level={3} style={{ marginBottom: 24 }}>Mill Dashboard</Title>
      
      {/* Stats Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Orders"
              value={stats.totalOrders}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Spent"
              value={stats.totalSpent}
              prefix={<DollarOutlined />}
              precision={0}
              valueStyle={{ color: '#52c41a' }}
              suffix="₹"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pending Orders"
              value={stats.pendingOrders}
              prefix={<InboxOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Completed Orders"
              value={stats.completedOrders}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Orders */}
      <Card title="Recent Orders">
        {orders.length > 0 ? (
          <Table 
            columns={columns} 
            dataSource={orders} 
            rowKey="_id"
            pagination={{ pageSize: 5 }}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Text type="secondary">No orders yet. Browse available products from traders to place orders!</Text>
          </div>
        )}
      </Card>
    </div>
  )
}

export default MillDashboard

