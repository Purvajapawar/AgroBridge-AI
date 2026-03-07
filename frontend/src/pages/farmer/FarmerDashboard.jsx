import React, { useState, useEffect } from 'react'
import { Row, Col, Card, Statistic, Table, Tag, Typography, Spin, message } from 'antd'
import { 
  ArrowUpOutlined, 
  ArrowDownOutlined, 
  ShoppingOutlined, 
  DollarOutlined,
  WalletOutlined,
  InboxOutlined
} from '@ant-design/icons'
import { getFarmerCrops, getFarmerAnalytics } from '../../services/api'

const { Title, Text } = Typography

const FarmerDashboard = () => {
  const [loading, setLoading] = useState(true)
  const [crops, setCrops] = useState([])
  const [analytics, setAnalytics] = useState({
    totalCrops: 0,
    activeListings: 0,
    soldCrops: 0,
    estimatedEarnings: 0
  })

  const userId = localStorage.getItem('userId')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch crops
      const cropsResponse = await getFarmerCrops(userId)
      if (cropsResponse.success) {
        setCrops(cropsResponse.crops)
        
        // Calculate analytics
        const activeListings = cropsResponse.crops.filter(c => c.status === 'available').length
        const soldCrops = cropsResponse.crops.filter(c => c.status === 'sold_to_trader').length
        const estimatedEarnings = cropsResponse.crops
          .filter(c => c.status === 'sold_to_trader')
          .reduce((sum, c) => sum + (c.price * c.quantity), 0)
        
        setAnalytics({
          totalCrops: cropsResponse.crops.length,
          activeListings,
          soldCrops,
          estimatedEarnings
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
      title: 'Crop',
      dataIndex: 'cropType',
      key: 'cropType',
      render: (text) => <Tag color="green">{text}</Tag>
    },
    {
      title: 'Quantity (q)',
      dataIndex: 'quantity',
      key: 'quantity'
    },
    {
      title: 'Expected Price',
      dataIndex: 'expectedPrice',
      key: 'expectedPrice',
      render: (price) => `₹${price}`
    },
    {
      title: 'AI Predicted',
      dataIndex: 'aiPredictedPrice',
      key: 'aiPredictedPrice',
      render: (price) => `₹${price}`
    },
    {
      title: 'Grade',
      dataIndex: 'grade',
      key: 'grade',
      render: (grade) => (
        <span className={`quality-badge quality-grade-${grade?.toLowerCase()}`}>
          {grade || 'N/A'}
        </span>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'available' ? 'green' : 'blue'}>
          {status === 'available' ? 'Available' : 'Sold'}
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
      <Title level={3} style={{ marginBottom: 24 }}>Farmer Dashboard</Title>
      
      {/* Stats Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Crops"
              value={analytics.totalCrops}
              prefix={<InboxOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Listings"
              value={analytics.activeListings}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Sold Crops"
              value={analytics.soldCrops}
              prefix={<ArrowDownOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Estimated Earnings"
              value={analytics.estimatedEarnings}
              prefix={<DollarOutlined />}
              precision={0}
              valueStyle={{ color: '#52c41a' }}
              suffix="₹"
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Crops Table */}
      <Card title="Recent Crops">
        {crops.length > 0 ? (
          <Table 
            columns={columns} 
            dataSource={crops} 
            rowKey="_id"
            pagination={{ pageSize: 5 }}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Text type="secondary">No crops uploaded yet. Go to Upload Crop to add your first crop!</Text>
          </div>
        )}
      </Card>
    </div>
  )
}

export default FarmerDashboard

