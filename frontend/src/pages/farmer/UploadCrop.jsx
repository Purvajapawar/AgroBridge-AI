import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Card, InputNumber, Select, Upload, message, Result, Row, Col, Typography, Divider, Spin, Alert } from 'antd'
import { UploadOutlined, RobotOutlined, SafetyCertificateOutlined, DollarOutlined } from '@ant-design/icons'
import { createCrop, getPricePrediction, detectQuality, getStates, getDistricts } from '../../services/api'
import FarmerVoiceAssistant from '../../components/FarmerVoiceAssistant'

const { Title, Text } = Typography
const { Option } = Select

const UploadCrop = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const [pricePrediction, setPricePrediction] = useState(null)
  const [qualityResult, setQualityResult] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [cropSubmitted, setCropSubmitted] = useState(false)
  
  // State and District dropdowns
  const [states, setStates] = useState([])
  const [districts, setDistricts] = useState([])
  const [selectedState, setSelectedState] = useState(null)

  // Load states on mount
  useEffect(() => {
    loadStates()
  }, [])

  const loadStates = async () => {
    try {
      const response = await getStates()
      if (response.success) {
        setStates(response.states)
      }
    } catch (error) {
      console.error('Failed to load states:', error)
      setStates([
        'Maharashtra', 'Punjab', 'Haryana', 'Uttar_Pradesh', 'Madhya_Pradesh',
        'Gujarat', 'Rajasthan', 'Karnataka', 'Tamil_Nadu', 'West_Bengal'
      ])
    }
  }

  const handleStateChange = async (value) => {
    setSelectedState(value)
    form.setFieldValue('district', undefined)
    setDistricts([])
    
    if (value) {
      try {
        const response = await getDistricts(value)
        if (response.success) {
          setDistricts(response.districts)
        }
      } catch (error) {
        console.error('Failed to load districts:', error)
      }
    }
  }

  const cropTypes = [
    'Wheat', 'Rice', 'Corn', 'Soybean', 'Cotton', 
    'Sugarcane', 'Potato', 'Tomato', 'Onion', 'Mustard'
  ]

  // Handle AI Price Prediction using live API
  const handlePriceChange = async (value) => {
    if (!value || value <= 0) {
      setPricePrediction(null)
      return
    }

    const cropType = form.getFieldValue('cropType')
    const state = form.getFieldValue('state')
    const district = form.getFieldValue('district')

    if (!cropType) {
      message.warning('Please select crop type first')
      return
    }

    try {
      // Use live price prediction API
      const response = await getPricePrediction(
        cropType,
        state?.replace(/_/g, ' ') || '',
        district || '',
        value
      )
      
      if (response.success) {
        setPricePrediction({
          predicted_price: response.predicted_price,
          suggested_price: response.suggested_price,
          recommendation: response.recommendation,
          diff: response.diff,
          source: response.source || 'live_api'
        })
        
        if (response.source === 'fallback' || response.source === 'safe_default') {
          message.info('Using offline price prediction')
        }
      }
    } catch (error) {
      console.error('Price prediction error:', error)
      // Fallback prediction
      const predicted = Math.round(value * 1.15)
      const suggested = Math.round(value * 1.1)
      setPricePrediction({
        predicted_price: predicted,
        suggested_price: suggested,
        recommendation: 'increase',
        diff: predicted - value,
        source: 'local_fallback'
      })
    }
  }

  // Handle crop type change - reset prediction
  const handleCropTypeChange = () => {
    setPricePrediction(null)
    const expectedPrice = form.getFieldValue('expectedPrice')
    if (expectedPrice) {
      handlePriceChange(expectedPrice)
    }
  }

  // Handle AI Quality Detection
  const handleImageUpload = async (file) => {
    if (!file) return false
    
    setImageFile(file)
    setImageLoading(true)

    try {
      const response = await detectQuality(file)
      
      if (response.success) {
        setQualityResult({
          grade: response.grade || 'A',
          broken_percentage: response.broken_percentage || 2,
          color_score: response.color_score || 8.5
        })
        message.success('AI Quality detection completed!')
      }
    } catch (error) {
      console.error('Quality detection error:', error)
      // Mock quality result for demo
      setQualityResult({
        grade: 'A',
        broken_percentage: 3,
        color_score: 8.5
      })
    } finally {
      setImageLoading(false)
    }

    return false // Prevent default upload behavior
  }

  // Handle form submission
  const onFinish = async (values) => {
    setLoading(true)
    try {
      const formattedState = values.state?.replace(/_/g, ' ')
      
      const cropData = {
        farmerId: localStorage.getItem('userId'),
        farmerName: localStorage.getItem('userName'),
        cropType: values.cropType,
        quantity: values.quantity,
        expectedPrice: values.expectedPrice,
        location: formattedState || values.location,
        state: formattedState || values.state,
        district: values.district,
        aiPredictedPrice: pricePrediction?.predicted_price || values.expectedPrice,
        suggestedPrice: pricePrediction?.suggested_price || values.expectedPrice,
        grade: qualityResult?.grade || 'B',
        brokenPercentage: qualityResult?.broken_percentage || 5,
        colorScore: qualityResult?.color_score || 7,
        status: 'available'
      }

      const response = await createCrop(cropData)
      
      if (response.success) {
        setCropSubmitted(true)
        message.success('Crop uploaded successfully!')
      } else {
        message.error(response.message || 'Failed to upload crop')
      }
    } catch (error) {
      message.error('Failed to upload crop. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (cropSubmitted) {
    return (
      <div className="fade-in">
        <Card>
          <Result
            status="success"
            title="Crop Uploaded Successfully!"
            subTitle="Your crop is now visible to traders. AI has predicted the best price for you."
            extra={[
              <Button type="primary" key="another" onClick={() => {
                setCropSubmitted(false)
                setPricePrediction(null)
                setQualityResult(null)
                form.resetFields()
              }}>
                Upload Another Crop
              </Button>
            ]}
          />
        </Card>
      </div>
    )
  }

  return (
    <div className="fade-in">
      <Title level={3} style={{ marginBottom: 24 }}>Upload Crop</Title>
      
      {/* Voice Assistant Component */}
      <FarmerVoiceAssistant 
        onFieldComplete={(field, value) => {
          form.setFieldValue(field, value)
          if (field === 'cropType') {
            handleCropTypeChange()
          } else if (field === 'expectedPrice') {
            handlePriceChange(value)
          } else if (field === 'state') {
            handleStateChange(value)
          }
        }}
        language="en"
      />
      
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card title="Crop Details">
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
                onChange={handleCropTypeChange}
              >
                <Select placeholder="Select crop type">
                  {cropTypes.map(crop => (
                    <Option key={crop} value={crop}>{crop}</Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="quantity"
                label="Quantity (Quintal)"
                rules={[{ required: true, message: 'Please enter quantity!' }]}
              >
                <InputNumber 
                  min={1} 
                  max={10000} 
                  style={{ width: '100%' }} 
                  placeholder="Enter quantity in quintals"
                />
              </Form.Item>

              <Form.Item
                name="expectedPrice"
                label="Expected Price (₹ per Quintal)"
                rules={[{ required: true, message: 'Please enter expected price!' }]}
              >
                <InputNumber 
                  min={100} 
                  max={100000} 
                  style={{ width: '100%' }} 
                  placeholder="Enter expected price"
                  prefix={<DollarOutlined />}
                  onChange={handlePriceChange}
                />
              </Form.Item>

              {/* State Dropdown */}
              <Form.Item
                name="state"
                label="State"
                rules={[{ required: true, message: 'Please select state!' }]}
                onChange={handleStateChange}
              >
                <Select 
                  placeholder="Select State"
                  onChange={handleStateChange}
                  showSearch
                >
                  {states.map(state => (
                    <Option key={state} value={state}>
                      {state.replace(/_/g, ' ')}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {/* District Dropdown */}
              <Form.Item
                name="district"
                label="District"
                rules={[{ required: true, message: 'Please select district!' }]}
              >
                <Select 
                  placeholder="Select District"
                  disabled={!selectedState}
                  showSearch
                >
                  {districts.map(district => (
                    <Option key={district} value={district}>
                      {district.replace(/_/g, ' ')}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="image"
                label="Upload Grain Image"
                tooltip="Upload an image of your grains for AI quality detection"
              >
                <Upload 
                  accept="image/*"
                  maxCount={1}
                  beforeUpload={handleImageUpload}
                  showUploadList={false}
                >
                  <Button icon={<UploadOutlined />}>
                    {imageFile ? imageFile.name : 'Click to Upload Image'}
                  </Button>
                </Upload>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block size="large">
                  Submit Crop
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          {/* AI Price Prediction Card */}
          <Card 
            title={
              <span>
                <RobotOutlined style={{ marginRight: 8 }} />
                AI Price Prediction
              </span>
            }
            style={{ marginBottom: 24 }}
          >
            {pricePrediction ? (
              <div className="ai-result-box">
                <Row gutter={16}>
                  <Col span={12}>
                    <div style={{ textAlign: 'center' }}>
                      <Text type="secondary">AI Predicted Price</Text>
                      <Title level={3} style={{ color: '#52c41a', margin: '8px 0' }}>
                        ₹{pricePrediction.predicted_price}
                      </Title>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ textAlign: 'center' }}>
                      <Text type="secondary">Suggested Price</Text>
                      <Title level={3} style={{ color: '#1890ff', margin: '8px 0' }}>
                        ₹{pricePrediction.suggested_price}
                      </Title>
                    </div>
                  </Col>
                </Row>
                <Divider style={{ margin: '16px 0' }} />
                <Alert
                  message={
                    pricePrediction.recommendation === 'increase' 
                      ? `💡 Recommendation: Increase price by ₹${pricePrediction.diff}`
                      : `💡 Recommendation: Current price is optimal`
                  }
                  type={pricePrediction.recommendation === 'increase' ? 'success' : 'info'}
                  showIcon
                />
                {pricePrediction.source && (
                  <Text type="secondary" style={{ display: 'block', marginTop: 8, fontSize: 12 }}>
                    Source: {pricePrediction.source}
                  </Text>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 20 }}>
                <Spin />
                <div style={{ marginTop: 12 }}>
                  <Text type="secondary">Enter expected price to get AI prediction</Text>
                </div>
              </div>
            )}
          </Card>

          {/* AI Quality Detection Card */}
          <Card 
            title={
              <span>
                <SafetyCertificateOutlined style={{ marginRight: 8 }} />
                AI Quality Detection
              </span>
            }
          >
            {imageLoading ? (
              <div style={{ textAlign: 'center', padding: 20 }}>
                <Spin size="large" />
                <div style={{ marginTop: 12 }}>
                  <Text>Analyzing grain image...</Text>
                </div>
              </div>
            ) : qualityResult ? (
              <div className="ai-result-box">
                <Row gutter={16}>
                  <Col span={8}>
                    <div style={{ textAlign: 'center' }}>
                      <Text type="secondary">Grade</Text>
                      <Title level={2} style={{ 
                        color: qualityResult.grade === 'A' ? '#52c41a' : qualityResult.grade === 'B' ? '#faad14' : '#ff4d4f',
                        margin: '8px 0' 
                      }}>
                        {qualityResult.grade}
                      </Title>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{ textAlign: 'center' }}>
                      <Text type="secondary">Broken %</Text>
                      <Title level={3} style={{ margin: '8px 0' }}>
                        {qualityResult.broken_percentage}%
                      </Title>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{ textAlign: 'center' }}>
                      <Text type="secondary">Color Score</Text>
                      <Title level={3} style={{ margin: '8px 0' }}>
                        {qualityResult.color_score}/10
                      </Title>
                    </div>
                  </Col>
                </Row>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 20 }}>
                <Text type="secondary">Upload an image to detect grain quality</Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default UploadCrop

