import React, { useState, useEffect } from 'react'
import { Table, Tag, Card, Typography, Button, Space, message, Modal, Descriptions } from 'antd'
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons'
import { getFarmerCrops } from '../../services/api'

const { Title, Text } = Typography

const MyCrops = () => {
  const [loading, setLoading] = useState(true)
  const [crops, setCrops] = useState([])
  const [viewModal, setViewModal] = useState({ visible: false, crop: null })
  
  const userId = localStorage.getItem('userId')

  useEffect(() => {
    fetchCrops()
  }, [])

  const fetchCrops = async () => {
    try {
      setLoading(true)
      const response = await getFarmerCrops(userId)
      if (response.success) {
        setCrops(response.crops)
      }
    } catch (error) {
      message.error('Failed to fetch crops')
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      title: 'Crop Type',
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
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => setViewModal({ visible: true, crop: record })}
          >
            View
          </Button>
        </Space>
      )
    }
  ]

  return (
    <div className="fade-in">
      <Title level={3} style={{ marginBottom: 24 }}>My Crops</Title>
      
      <Card>
        {crops.length > 0 ? (
          <Table 
            columns={columns} 
            dataSource={crops} 
            rowKey="_id"
            pagination={{ pageSize: 10 }}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Text type="secondary">No crops uploaded yet.</Text>
          </div>
        )}
      </Card>

      <Modal
        title="Crop Details"
        open={viewModal.visible}
        onCancel={() => setViewModal({ visible: false, crop: null })}
        footer={[
          <Button key="close" onClick={() => setViewModal({ visible: false, crop: null })}>
            Close
          </Button>
        ]}
      >
        {viewModal.crop && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Crop Type">{viewModal.crop.cropType}</Descriptions.Item>
            <Descriptions.Item label="Quantity">{viewModal.crop.quantity} quintals</Descriptions.Item>
            <Descriptions.Item label="Expected Price">₹{viewModal.crop.expectedPrice}</Descriptions.Item>
            <Descriptions.Item label="AI Predicted Price">₹{viewModal.crop.aiPredictedPrice}</Descriptions.Item>
            <Descriptions.Item label="Suggested Price">₹{viewModal.crop.suggestedPrice}</Descriptions.Item>
            <Descriptions.Item label="Grade">
              <span className={`quality-badge quality-grade-${viewModal.crop.grade?.toLowerCase()}`}>
                {viewModal.crop.grade}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Location">{viewModal.crop.location}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={viewModal.crop.status === 'available' ? 'green' : 'blue'}>
                {viewModal.crop.status === 'available' ? 'Available' : 'Sold'}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  )
}

export default MyCrops

