import React, { useState, useEffect } from 'react'
import { Table, Tag, Card, Typography, Button, message, Modal, Descriptions } from 'antd'
import { CheckOutlined, EyeOutlined } from '@ant-design/icons'
import { getAvailableCrops, acceptDeal } from '../../services/api'

const { Title, Text } = Typography

const FarmerCrops = () => {
  const [loading, setLoading] = useState(true)
  const [crops, setCrops] = useState([])
  const [viewModal, setViewModal] = useState({ visible: false, crop: null })
  const [accepting, setAccepting] = useState(false)

  const userId = localStorage.getItem('userId')

  useEffect(() => {
    fetchCrops()
  }, [])

  const fetchCrops = async () => {
    try {
      setLoading(true)
      const response = await getAvailableCrops()
      if (response.success) {
        setCrops(response.crops)
      }
    } catch (error) {
      message.error('Failed to fetch crops')
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptDeal = async (cropId) => {
    if (!cropId) {
      message.error('Error: Crop ID is missing!')
      return
    }
    
    if (!userId) {
      message.error('Error: User not logged in!')
      return
    }

    Modal.confirm({
      title: 'Accept Deal',
      content: 'Are you sure you want to accept this deal? The crop will be added to your inventory.',
      onOk: async () => {
        try {
          setAccepting(true)
          const response = await acceptDeal(cropId, userId)
          if (response.success) {
            message.success('Deal accepted successfully!')
            fetchCrops()
          } else {
            message.error(response.message || 'Failed to accept deal')
          }
        } catch (error) {
          message.error('Failed to accept deal')
        } finally {
          setAccepting(false)
        }
      }
    })
  }

  const columns = [
    {
      title: 'Farmer',
      dataIndex: 'farmerName',
      key: 'farmerName'
    },
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
      title: 'Grade',
      dataIndex: 'grade',
      key: 'grade'
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
      title: 'Location',
      dataIndex: 'location',
      key: 'location'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button 
          type="primary" 
          icon={<CheckOutlined />} 
          onClick={() => handleAcceptDeal(record.id || record._id)} 
          loading={accepting}
        >
          Accept Deal
        </Button>
      )
    }
  ]

  return (
    <div className="fade-in">
      <Title level={3} style={{ marginBottom: 24 }}>Available Crops from Farmers</Title>
      
      <Card>
        {crops.length > 0 ? (
          <Table 
            columns={columns} 
            dataSource={crops} 
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Text type="secondary">No crops available from farmers at the moment.</Text>
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
          </Button>,
          <Button key="accept" type="primary" onClick={() => {
            handleAcceptDeal(viewModal.crop?.id || viewModal.crop?._id)
            setViewModal({ visible: false, crop: null })
          }}>
            Accept Deal
          </Button>
        ]}
      >
        {viewModal.crop && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Farmer">{viewModal.crop.farmerName}</Descriptions.Item>
            <Descriptions.Item label="Crop Type">{viewModal.crop.cropType}</Descriptions.Item>
            <Descriptions.Item label="Quantity">{viewModal.crop.quantity} quintals</Descriptions.Item>
            <Descriptions.Item label="Expected Price">₹{viewModal.crop.expectedPrice}</Descriptions.Item>
            <Descriptions.Item label="AI Predicted Price">₹{viewModal.crop.aiPredictedPrice}</Descriptions.Item>
            <Descriptions.Item label="Grade">{viewModal.crop.grade}</Descriptions.Item>
            <Descriptions.Item label="Location">{viewModal.crop.location}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  )
}

export default FarmerCrops
