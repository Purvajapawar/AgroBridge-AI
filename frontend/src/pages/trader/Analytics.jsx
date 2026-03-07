import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Typography, Spin, message, Statistic } from 'antd'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { getTraderInventory, getTraderListings } from '../../services/api'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const { Title: TitleText } = Typography

const TraderAnalytics = () => {
  const [loading, setLoading] = useState(true)
  const [inventory, setInventory] = useState([])
  const [listings, setListings] = useState([])

  const userId = localStorage.getItem('userId')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      const inventoryResponse = await getTraderInventory(userId)
      if (inventoryResponse.success) {
        setInventory(inventoryResponse.inventory)
      }

      const listingsResponse = await getTraderListings()
      if (listingsResponse.success) {
        setListings(listingsResponse.listings)
      }
    } catch (error) {
      message.error('Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  // Inventory by crop chart
  const getInventoryChartData = () => {
    const cropTypes = {}
    inventory.forEach(item => {
      cropTypes[item.cropType] = (cropTypes[item.cropType] || 0) + item.quantity
    })

    return {
      labels: Object.keys(cropTypes),
      datasets: [{
        label: 'Inventory (Quintals)',
        data: Object.values(cropTypes),
        backgroundColor: '#1890ff'
      }]
    }
  }

  // Purchase vs Selling Price
  const getPriceComparisonData = () => {
    const crops = {}
    inventory.forEach(item => {
      if (!crops[item.cropType]) {
        crops[item.cropType] = { purchase: 0, listed: 0, count: 0 }
      }
      crops[item.cropType].purchase += item.price * item.quantity
      crops[item.cropType].count += item.quantity
    })

    listings.forEach(item => {
      if (crops[item.cropType]) {
        crops[item.cropType].listed += item.listedPrice * item.quantity
      }
    })

    const labels = Object.keys(crops)
    const purchasePrices = labels.map(c => crops[c].purchase)
    const listedPrices = labels.map(c => crops[c].listed)

    return {
      labels,
      datasets: [
        {
          label: 'Purchase Price',
          data: purchasePrices,
          backgroundColor: '#52c41a'
        },
        {
          label: 'Listed Price',
          data: listedPrices,
          backgroundColor: '#722ed1'
        }
      ]
    }
  }

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' }
    }
  }

  const totalPurchaseValue = inventory.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const totalListedValue = listings.reduce((sum, item) => sum + (item.listedPrice * item.quantity), 0)
  const profit = totalListedValue - totalPurchaseValue

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

      {/* Stats */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Purchase Value"
              value={totalPurchaseValue}
              precision={0}
              prefix="₹"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Listed Value"
              value={totalListedValue}
              precision={0}
              prefix="₹"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Potential Profit"
              value={profit}
              precision={0}
              prefix="₹"
              valueStyle={{ color: profit >= 0 ? '#52c41a' : '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {inventory.length > 0 ? (
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Card title="Inventory by Crop">
              <Bar data={getInventoryChartData()} options={barOptions} />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Purchase vs Selling Price">
              <Bar data={getPriceComparisonData()} options={barOptions} />
            </Card>
          </Col>
        </Row>
      ) : (
        <Card>
          <div style={{ textAlign: 'center', padding: 40 }}>
            <p>No data available for analytics. Accept deals from farmers to see analytics.</p>
          </div>
        </Card>
      )}
    </div>
  )
}

export default TraderAnalytics

