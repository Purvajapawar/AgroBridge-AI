import React, { useState, useEffect } from 'react'
import { Table, Tag, Card, Typography, Row, Col, Statistic, message } from 'antd'
import { InboxOutlined, DollarOutlined } from '@ant-design/icons'
import { getTraderInventory } from '../../services/api'

const { Title, Text } = Typography

const TraderInventory = () => {
  const [loading, setLoading] = useState(true)
  const [inventory, setInventory] = useState([])
  
  const userId = localStorage.getItem('userId')

  useEffect(() => {
    fetchInventory()
  }, [])

  const fetchInventory = async () => {
    try {
      setLoading(true)
      const response = await getTraderInventory(userId)
      if (response.success) {
        setInventory(response.inventory)
      }
    } catch (error) {
      message.error('Failed to fetch inventory')
    } finally {
      setLoading(false)
    }
  }

  // Calculate aggregation by crop type
  const getAggregatedData = () => {
    const aggregated = {}
    inventory.forEach(item => {
      if (!aggregated[item.cropType]) {
        aggregated[item.cropType] = {
          cropType: item.cropType,
          totalQuantity: 0,
          farmers: new Set(),
          totalValue: 0,
          grade: item.grade
        }
      }
      aggregated[item.cropType].totalQuantity += item.quantity
      aggregated[item.cropType].farmers.add(item.farmerName)
      aggregated[item.cropType].totalValue += item.price * item.quantity
    })
    return Object.values(aggregated).map(item => ({
      ...item,
      farmers: Array.from(item.farmers).join(', ')
    }))
  }

  const columns = [
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
      title: 'Total Value',
      key: 'totalValue',
      render: (_, record) => `₹${record.price * record.quantity}`
    },
    {
      title: 'Farmer',
      dataIndex: 'farmerName',
      key: 'farmerName'
    }
  ]

  const aggregatedColumns = [
    {
      title: 'Crop',
      dataIndex: 'cropType',
      key: 'cropType',
      render: (text) => <Tag color="blue">{text}</Tag>
    },
    {
      title: 'Total Stock (q)',
      dataIndex: 'totalQuantity',
      key: 'totalQuantity',
      render: (qty) => <strong>{qty}</strong>
    },
    {
      title: 'Grade',
      dataIndex: 'grade',
      key: 'grade'
    },
    {
      title: 'Total Value',
      dataIndex: 'totalValue',
      key: 'totalValue',
      render: (val) => `₹${val}`
    },
    {
      title: 'Farmers',
      dataIndex: 'farmers',
      key: 'farmers'
    }
  ]

  const totalQuantity = inventory.reduce((sum, item) => sum + item.quantity, 0)
  const totalValue = inventory.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <div className="fade-in">
      <Title level={3} style={{ marginBottom: 24 }}>Inventory Management</Title>
      
      {/* Stats */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12}>
          <Card>
            <Statistic
              title="Total Stock"
              value={totalQuantity}
              prefix={<InboxOutlined />}
              suffix="quintals"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card>
            <Statistic
              title="Total Investment Value"
              value={totalValue}
              prefix={<DollarOutlined />}
              suffix="₹"
              precision={0}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Individual Items */}
      <Card title="Inventory Details" style={{ marginBottom: 24 }}>
        {inventory.length > 0 ? (
          <Table 
            columns={columns} 
            dataSource={inventory} 
            rowKey="_id"
            pagination={{ pageSize: 10 }}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Text type="secondary">No inventory items. Accept deals from farmers to add items.</Text>
          </div>
        )}
      </Card>

      {/* Aggregated View */}
      <Card title="Aggregated Inventory by Crop">
        {inventory.length > 0 ? (
          <Table 
            columns={aggregatedColumns} 
            dataSource={getAggregatedData()} 
            rowKey="cropType"
            pagination={false}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Text type="secondary">No data to aggregate.</Text>
          </div>
        )}
      </Card>
    </div>
  )
}

export default TraderInventory

