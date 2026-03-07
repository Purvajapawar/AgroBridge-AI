import React, { useState, useEffect } from 'react'
import { Row, Col, Card, Statistic, Table, Tag, Typography, Spin, message } from 'antd'
import { 
  ShoppingOutlined, 
  DollarOutlined,
  InboxOutlined,
  ShopOutlined
} from '@ant-design/icons'
import { getTraderInventory, getTraderListings } from '../../services/api'

const { Title, Text } = Typography

const TraderDashboard = () => {
  const [loading, setLoading] = useState(true)
  const [inventory, setInventory] = useState([])
  const [listings, setListings] = useState([])
  const [stats, setStats] = useState({
    totalInventory: 0,
    totalValue: 0,
    activeListings: 0,
    totalOrders: 0
  })

  const userId = localStorage.getItem('userId')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch inventory
      const inventoryResponse = await getTraderInventory(userId)
      if (inventoryResponse.success) {
        setInventory(inventoryResponse.inventory)
        
        const totalValue = inventoryResponse.inventory.reduce((sum, item) => 
          sum + (item.price * item.quantity), 0
        )
        
        setStats(prev => ({
          ...prev,
          totalInventory: inventoryResponse.inventory.length,
          totalValue
        }))
      }

      // Fetch listings
      const listingsResponse = await getTraderListings()
      if (listingsResponse.success) {
        setListings(listingsResponse.listings)
        setStats(prev => ({
          ...prev,
          activeListings: listingsResponse.listings.length
        }))
      }
    } catch (error) {
      message.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const inventoryColumns = [
    {
      title: 'Crop',
      dataIndex: 'cropType',
      key: 'cropType',
      render: (text) => <Tag color="blue">{text}</Tag>
    },
    {
      title: 'Quantity (q)',
      dataIndex: 'quantity',
      key: 'quantity'
    },
    {
      title: 'Grade',
      dataIndex: 'grade',
      key: 'grade'
    },
    {
      title: 'Purchase Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `₹${price}`
    },
    {
      title: 'Farmer',
      dataIndex: 'farmerName',
      key: 'farmerName'
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
      <Title level={3} style={{ marginBottom: 24 }}>Trader Dashboard</Title>
      
      {/* Stats Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Inventory Items"
              value={stats.totalInventory}
              prefix={<InboxOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Inventory Value"
              value={stats.totalValue}
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
              title="Active Listings"
              value={stats.activeListings}
              prefix={<ShopOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Orders"
              value={stats.totalOrders}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Inventory Table */}
      <Card title="Current Inventory" style={{ marginBottom: 24 }}>
        {inventory.length > 0 ? (
          <Table 
            columns={inventoryColumns} 
            dataSource={inventory} 
            rowKey="_id"
            pagination={{ pageSize: 5 }}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Text type="secondary">No inventory yet. Accept deals from farmers to build inventory!</Text>
          </div>
        )}
      </Card>

      {/* Active Listings */}
      <Card title="Active Listings for Mills">
        {listings.length > 0 ? (
          <Table 
            columns={[
              ...inventoryColumns,
              {
                title: 'Listed Price',
                dataIndex: 'listedPrice',
                key: 'listedPrice',
                render: (price) => `₹${price}`
              }
            ]} 
            dataSource={listings} 
            rowKey="_id"
            pagination={{ pageSize: 5 }}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Text type="secondary">No listings yet. Create a listing from your inventory to sell to mills!</Text>
          </div>
        )}
      </Card>
    </div>
  )
}

export default TraderDashboard

