import React, { useState, useEffect } from 'react'
import { Table, Tag, Card, Typography, Button, message, Modal, Descriptions } from 'antd'
import { ShoppingCartOutlined, EyeOutlined } from '@ant-design/icons'
import { getTraderListings, createOrder } from '../../services/api'

const { Title, Text } = Typography

const Products = () => {
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [viewModal, setViewModal] = useState({ visible: false, product: null })
  const [ordering, setOrdering] = useState(false)

  const userId = localStorage.getItem('userId')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await getTraderListings()
      if (response.success) {
        setProducts(response.listings.filter(l => l.status === 'available'))
      }
    } catch (error) {
      message.error('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const handlePlaceOrder = async (product) => {
    Modal.confirm({
      title: 'Place Order',
      content: `Are you sure you want to order ${product.quantity} quintals of ${product.cropType} for ₹${product.listedPrice * product.quantity}?`,
      onOk: async () => {
        try {
          setOrdering(true)
          const orderData = {
            millId: userId,
            millName: localStorage.getItem('userName'),
            traderId: product.traderId,
            traderName: product.traderName,
            crop: product.cropType,
            quantity: product.quantity,
            price: product.listedPrice,
            deliveryDate: product.deliveryDate,
            status: 'pending'
          }

          const response = await createOrder(orderData)
          if (response.success) {
            message.success('Order placed successfully!')
            fetchProducts() // Refresh list
          } else {
            message.error(response.message || 'Failed to place order')
          }
        } catch (error) {
          message.error('Failed to place order')
        } finally {
          setOrdering(false)
        }
      }
    })
  }

  const columns = [
    {
      title: 'Trader',
      dataIndex: 'traderName',
      key: 'traderName'
    },
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
      key: 'grade',
      render: (grade) => (
        <span className={`quality-badge quality-grade-${grade?.toLowerCase()}`}>
          {grade}
        </span>
      )
    },
    {
      title: 'Price/q',
      dataIndex: 'listedPrice',
      key: 'listedPrice',
      render: (price) => `₹${price}`
    },
    {
      title: 'Total',
      key: 'total',
      render: (_, record) => `₹${record.listedPrice * record.quantity}`
    },
    {
      title: 'Delivery',
      dataIndex: 'deliveryDate',
      key: 'deliveryDate'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button type="primary" icon={<ShoppingCartOutlined />} onClick={() => handlePlaceOrder(record)} loading={ordering}>
          Buy Now
        </Button>
      )
    }
  ]

  return (
    <div className="fade-in">
      <Title level={3} style={{ marginBottom: 24 }}>Available Products from Traders</Title>
      
      <Card>
        {products.length > 0 ? (
          <Table 
            columns={columns} 
            dataSource={products} 
            rowKey="_id"
            pagination={{ pageSize: 10 }}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Text type="secondary">No products available from traders at the moment.</Text>
          </div>
        )}
      </Card>

      <Modal
        title="Product Details"
        open={viewModal.visible}
        onCancel={() => setViewModal({ visible: false, product: null })}
        footer={[
          <Button key="close" onClick={() => setViewModal({ visible: false, product: null })}>
            Close
          </Button>,
          <Button key="order" type="primary" onClick={() => {
            handlePlaceOrder(viewModal.product)
            setViewModal({ visible: false, product: null })
          }}>
            Place Order
          </Button>
        ]}
      >
        {viewModal.product && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Trader">{viewModal.product.traderName}</Descriptions.Item>
            <Descriptions.Item label="Crop Type">{viewModal.product.cropType}</Descriptions.Item>
            <Descriptions.Item label="Quantity">{viewModal.product.quantity} quintals</Descriptions.Item>
            <Descriptions.Item label="Grade">{viewModal.product.grade}</Descriptions.Item>
            <Descriptions.Item label="Price per Quintal">₹{viewModal.product.listedPrice}</Descriptions.Item>
            <Descriptions.Item label="Total Price">₹{viewModal.product.listedPrice * viewModal.product.quantity}</Descriptions.Item>
            <Descriptions.Item label="Delivery Date">{viewModal.product.deliveryDate}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  )
}

export default Products

