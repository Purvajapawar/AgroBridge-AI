import React, { useState } from 'react'
import { Form, Input, Button, Card, InputNumber, Select, DatePicker, message, Result, Typography, Row, Col } from 'antd'
import { ShopOutlined } from '@ant-design/icons'
import { createTraderListing, getTraderInventory } from '../../services/api'

const { Title, Text } = Typography
const { Option } = Select

const CreateListing = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [inventory, setInventory] = useState([])
  const [submitted, setSubmitted] = useState(false)

  const userId = localStorage.getItem('userId')

  // Fetch inventory to populate crop types
  React.useEffect(() => {
    fetchInventory()
  }, [])

  const fetchInventory = async () => {
    try {
      const response = await getTraderInventory(userId)
      if (response.success) {
        setInventory(response.inventory)
      }
    } catch (error) {
      console.error('Failed to fetch inventory')
    }
  }

  const cropTypes = [...new Set(inventory.map(item => item.cropType))]

  const onFinish = async (values) => {
    setLoading(true)
    try {
      const listingData = {
        traderId: userId,
        traderName: localStorage.getItem('userName'),
        cropType: values.cropType,
        quantity: values.quantity,
        grade: values.grade,
        listedPrice: values.listedPrice,
        deliveryDate: values.deliveryDate.format('YYYY-MM-DD'),
        status: 'available'
      }

      const response = await createTraderListing(listingData)
      
      if (response.success) {
        setSubmitted(true)
        message.success('Listing created successfully!')
      } else {
        message.error(response.message || 'Failed to create listing')
      }
    } catch (error) {
      message.error('Failed to create listing. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCropTypeChange = (value) => {
    // Get available quantity for selected crop
    const cropItems = inventory.filter(item => item.cropType === value)
    const totalQty = cropItems.reduce((sum, item) => sum + item.quantity, 0)
    
    // Get available grades
    const grades = [...new Set(cropItems.map(item => item.grade))]
    
    form.setFieldsValue({ availableQuantity: totalQty })
  }

  if (submitted) {
    return (
      <div className="fade-in">
        <Card>
          <Result
            status="success"
            title="Listing Created Successfully!"
            subTitle="Your listing is now visible to mills. Wait for them to place orders."
            extra={[
              <Button type="primary" key="another" onClick={() => {
                setSubmitted(false)
                form.resetFields()
              }}>
                Create Another Listing
              </Button>
            ]}
          />
        </Card>
      </div>
    )
  }

  return (
    <div className="fade-in">
      <Title level={3} style={{ marginBottom: 24 }}>Create Listing for Mills</Title>
      
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card title="Listing Details">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              size="large"
            >
              <Form.Item
                name="cropType"
                label="Crop Type"
                rules={[{ required: true, message: 'Please select crop type!' }]}
              >
                <Select 
                  placeholder="Select crop type" 
                  onChange={handleCropTypeChange}
                >
                  {cropTypes.map(crop => (
                    <Option key={crop} value={crop}>{crop}</Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="quantity"
                label="Quantity (Quintal)"
                rules={[
                  { required: true, message: 'Please enter quantity!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const available = getFieldValue('availableQuantity')
                      if (!available || value <= available) {
                        return Promise.resolve()
                      }
                      return Promise.reject(new Error(`Maximum available: ${available} quintals`))
                    }
                  })
                ]}
              >
                <InputNumber 
                  min={1} 
                  style={{ width: '100%' }} 
                  placeholder="Enter quantity in quintals"
                />
              </Form.Item>

              <Form.Item
                name="grade"
                label="Grade"
                rules={[{ required: true, message: 'Please select grade!' }]}
              >
                <Select placeholder="Select grade">
                  <Option value="A">Grade A (Premium)</Option>
                  <Option value="B">Grade B (Standard)</Option>
                  <Option value="C">Grade C (Economy)</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="listedPrice"
                label="Price per Quintal (₹)"
                rules={[{ required: true, message: 'Please enter price!' }]}
              >
                <InputNumber 
                  min={100} 
                  max={100000} 
                  style={{ width: '100%' }} 
                  placeholder="Enter selling price"
                  prefix="₹"
                />
              </Form.Item>

              <Form.Item
                name="deliveryDate"
                label="Expected Delivery Date"
                rules={[{ required: true, message: 'Please select delivery date!' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block size="large">
                  Create Listing
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Tips for Better Sales">
            <div style={{ padding: 8 }}>
              <p><strong>1. Competitive Pricing</strong></p>
              <Text type="secondary">Check market rates and price competitively to attract mills.</Text>
              
              <div style={{ marginTop: 16 }}>
                <p><strong>2. Quality Matters</strong></p>
                <Text type="secondary">Clearly mention the grade - mills prefer transparency.</Text>
              </div>
              
              <div style={{ marginTop: 16 }}>
                <p><strong>3. Delivery Timeline</strong></p>
                <Text type="secondary">Be realistic about delivery dates to build trust.</Text>
              </div>
              
              <div style={{ marginTop: 16 }}>
                <p><strong>4. Bulk Discounts</strong></p>
                <Text type="secondary">Consider offering discounts for larger quantities.</Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default CreateListing

