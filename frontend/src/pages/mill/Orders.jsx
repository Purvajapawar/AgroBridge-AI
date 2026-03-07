import React, { useState, useEffect } from 'react'
import { Table, Tag, Card, Typography, Button, message, Modal, Descriptions } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import { getMillOrders } from '../../services/api'

const { Title, Text } = Typography

const Orders = () => {
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [viewModal, setViewModal] = useState({ visible: false, order: null })

  const userId = localStorage.getItem('userId')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await getMillOrders(userId)
      if (response.success) {
        setOrders(response.orders)
      }
    } catch (error) {
      message.error('Failed to fetch orders')
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
      title: 'Delivery Date',
      dataIndex: 'deliveryDate',
      key: 'deliveryDate'
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
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button type="link" icon={<EyeOutlined />} onClick={() => setViewModal({ visible: true, order: record })}>
          View
        </Button>
      )
    }
  ]

  return (
    <div className="fade-in">
      <Title level={3} style={{ marginBottom: 24 }}>My Orders</Title>
      
      <Card>
        {orders.length > 0 ? (
          <Table 
            columns={columns} 
            dataSource={orders} 
            rowKey="_id"
            pagination={{ pageSize: 10 }}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Text type="secondary">No orders placed yet.</Text>
          </div>
        )}
      </Card>

      <Modal
        title="Order Details"
        open={viewModal.visible}
        onCancel={() => setViewModal({ visible: false, order: null })}
        footer={[
          <Button key="close" onClick={() => setViewModal({ visible: false, order: null })}>
            Close
          </Button>
        ]}
      >
        {viewModal.order && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Order ID">{viewModal.order._id}</Descriptions.Item>
            <Descriptions.Item label="Crop">{viewModal.order.crop}</Descriptions.Item>
            <Descriptions.Item label="Quantity">{viewModal.order.quantity} quintals</Descriptions.Item>
            <Descriptions.Item label="Price per Quintal">₹{viewModal.order.price}</Descriptions.Item>
            <Descriptions.Item label="Total Price">₹{viewModal.order.price * viewModal.order.quantity}</Descriptions.Item>
            <Descriptions.Item label="Trader">{viewModal.order.traderName}</Descriptions.Item>
            <Descriptions.Item label="Delivery Date">{viewModal.order.deliveryDate}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={viewModal.order.status === 'completed' ? 'green' : 'orange'}>
                {viewModal.order.status.charAt(0).toUpperCase() + viewModal.order.status.slice(1)}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  )
}

export default Orders

