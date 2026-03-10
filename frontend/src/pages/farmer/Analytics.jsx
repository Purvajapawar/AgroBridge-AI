import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Typography, Spin, message } from 'antd'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { getFarmerCrops } from '../../services/api'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const { Title: TitleText } = Typography

const FarmerAnalytics = () => {
  const [loading, setLoading] = useState(true)
  const [crops, setCrops] = useState([])
  
  const userId = localStorage.getItem('userId')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await getFarmerCrops(userId)
      if (response.success) {
        setCrops(response.crops)
      }
    } catch (error) {
      message.error('Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  // Calculate crop price trends
  const getPriceTrendData = () => {
    const cropTypes = [...new Set(crops.map(c => c.cropType))]
    const labels = cropTypes
    const expectedPrices = cropTypes.map(type => {
      const typeCrops = crops.filter(c => c.cropType === type)
      return typeCrops.length > 0 ? typeCrops[0].expectedPrice : 0
    })
    const predictedPrices = cropTypes.map(type => {
      const typeCrops = crops.filter(c => c.cropType === type)
      return typeCrops.length > 0 ? typeCrops[0].aiPredictedPrice : 0
    })

    return {
      labels,
      datasets: [
        {
          label: 'Expected Price',
          data: expectedPrices,
          borderColor: '#52c41a',
          backgroundColor: 'rgba(82, 196, 26, 0.1)',
          tension: 0.4
        },
        {
          label: 'AI Predicted Price',
          data: predictedPrices,
          borderColor: '#1890ff',
          backgroundColor: 'rgba(24, 144, 255, 0.1)',
          tension: 0.4
        }
      ]
    }
  }

  // Calculate crop distribution
  const getCropDistribution = () => {
    const cropTypes = {}
    crops.forEach(crop => {
      cropTypes[crop.cropType] = (cropTypes[crop.cropType] || 0) + 1
    })
    
    return {
      labels: Object.keys(cropTypes),
      datasets: [{
        data: Object.values(cropTypes),
        backgroundColor: [
          '#52c41a',
          '#1890ff',
          '#722ed1',
          '#faad14',
          '#ff4d4f',
          '#13c2c2'
        ]
      }]
    }
  }

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Price Trends by Crop Type' }
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div className="fade-in">
      <TitleText level={3} style={{ marginBottom: 24 }}>Analytics</TitleText>
      
      {crops.length > 0 ? (
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card title="Price Trends">
              <Line data={getPriceTrendData()} options={lineOptions} />
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card title="Crop Distribution">
              <div style={{ height: 300 }}>
                {/* Simple display since we're using Line chart primarily */}
                <div style={{ padding: 20 }}>
                  <p><strong>Total Crops:</strong> {crops.length}</p>
                  <p><strong>Crop Types:</strong> {[...new Set(crops.map(c => c.cropType))].join(', ')}</p>
                  <p><strong>Available:</strong> {crops.filter(c => c.status === 'available').length}</p>
                  <p><strong>Sold:</strong> {crops.filter(c => c.status === 'sold_to_trader').length}</p>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      ) : (
        <Card>
          <div style={{ textAlign: 'center', padding: 40 }}>
            <p>No data available for analytics. Upload some crops to see your analytics.</p>
          </div>
        </Card>
      )}
    </div>
  )
}

export default FarmerAnalytics

