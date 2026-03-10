const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/agrobridge')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Error:', err))

// JWT Secret
const JWT_SECRET = 'agrobridge_ai_secret_key_2024'

// Import Models
const User = require('./models/User')
const Crop = require('./models/Crop')
const Payment = require('./models/Payment')

// Import Routes
const authRoutes = require('./routes/auth')
const cropRoutes = require('./routes/crops')
const traderRoutes = require('./routes/trader')
const millRoutes = require('./routes/mill')
const profileRoutes = require('./routes/profile')
const paymentRoutes = require('./routes/payments')
const routeRoutes = require('./routes/routes')

// Use Routes
app.use('/api/auth', authRoutes)
app.use('/api/crops', cropRoutes)
app.use('/api/trader', traderRoutes)
app.use('/api/mill', millRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/routes', routeRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err)
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  })
})

// SEED DATA - Create sample users
app.post('/api/seed', async (req, res) => {
  try {
    // Clear existing data
    await User.deleteMany({})
    await Crop.deleteMany({})

    // Create sample farmers
    const farmer1 = new User({
      name: 'Ramesh Kumar',
      email: 'ramesh@farmer.com',
      phone: '9876543210',
      password: await bcrypt.hash('123456', 10),
      role: 'farmer',
      contact_number: '9876543210',
      state: 'Maharashtra',
      district: 'Pune'
    })
    await farmer1.save()

    const farmer2 = new User({
      name: 'Suresh Patel',
      email: 'suresh@farmer.com',
      phone: '9876543211',
      password: await bcrypt.hash('123456', 10),
      role: 'farmer',
      contact_number: '9876543211',
      state: 'Punjab',
      district: 'Ludhiana'
    })
    await farmer2.save()

    // Create sample trader
    const trader1 = new User({
      name: 'Trader Amit',
      email: 'amit@trader.com',
      phone: '9876543213',
      password: await bcrypt.hash('123456', 10),
      role: 'trader',
      contact_number: '9876543213',
      gst_number: '22ABCDE1234F1Z5',
      state: 'Maharashtra',
      district: 'Mumbai'
    })
    await trader1.save()

    // Create sample mill
    const mill1 = new User({
      name: 'ABC Flour Mill',
      email: 'abc@mill.com',
      phone: '9876543215',
      password: await bcrypt.hash('123456', 10),
      role: 'mill',
      contact_number: '9876543215',
      gst_number: '27ABCDE1234F1Z5',
      state: 'Maharashtra',
      district: 'Pune'
    })
    await mill1.save()

    // Create sample crops
    await Crop.create([
      {
        farmer_id: farmer1._id,
        farmer_name: farmer1.name,
        crop_type: 'Wheat',
        quantity: 50,
        expected_price: 2200,
        ai_predicted_price: 2350,
        suggested_price: 2300,
        grade: 'A',
        broken_percentage: 2,
        color_score: 8.5,
        location: 'Maharashtra',
        state: 'Maharashtra',
        district: 'Pune',
        status: 'available'
      },
      {
        farmer_id: farmer2._id,
        farmer_name: farmer2.name,
        crop_type: 'Rice',
        quantity: 30,
        expected_price: 2100,
        ai_predicted_price: 2250,
        suggested_price: 2200,
        grade: 'A',
        broken_percentage: 3,
        color_score: 8.0,
        location: 'Punjab',
        state: 'Punjab',
        district: 'Ludhiana',
        status: 'available'
      },
      {
        farmer_id: farmer1._id,
        farmer_name: farmer1.name,
        crop_type: 'Soybean',
        quantity: 25,
        expected_price: 4500,
        ai_predicted_price: 4800,
        suggested_price: 4700,
        grade: 'B',
        broken_percentage: 4,
        color_score: 7.5,
        location: 'Madhya Pradesh',
        state: 'Madhya_Pradesh',
        district: 'Bhopal',
        status: 'available'
      }
    ])

    res.json({
      success: true,
      message: 'Database seeded successfully',
      sampleAccounts: [
        { role: 'Farmer', email: 'ramesh@farmer.com', password: '123456' },
        { role: 'Farmer', email: 'suresh@farmer.com', password: '123456' },
        { role: 'Trader', email: 'amit@trader.com', password: '123456' },
        { role: 'Mill', email: 'abc@mill.com', password: '123456' }
      ]
    })
  } catch (error) {
    console.error('Seed error:', error)
    res.status(500).json({
      success: false,
      message: 'Seed failed',
      error: error.message
    })
  }
})

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' })
})

// Debug route to check crops
app.get('/api/debug/crops', async (req, res) => {
  try {
    const crops = await Crop.find({}).limit(10)
    res.json({ 
      success: true, 
      count: crops.length,
      crops: crops.map(c => ({
        _id: c._id,
        crop_type: c.crop_type,
        farmer_name: c.farmer_name,
        status: c.status,
        expected_price: c.expected_price
      }))
    })
  } catch (error) {
    res.json({ success: false, error: error.message })
  }
})

// Simple test accept deal (for testing without proper auth)
app.post('/api/debug/accept-deal', async (req, res) => {
  try {
    const { cropId, traderId, traderName } = req.body
    
    console.log('DEBUG accept deal:', { cropId, traderId, traderName })
    
    const crop = await Crop.findById(cropId)
    if (!crop) {
      return res.json({ success: false, message: 'Crop not found' })
    }
    
    if (crop.status !== 'available') {
      return res.json({ success: false, message: 'Crop not available, status: ' + crop.status })
    }
    
    crop.status = 'sold_to_trader'
    crop.deal_status = 'accepted'
    crop.trader_id = traderId
    crop.trader_name = traderName || 'Test Trader'
    crop.accepted_at = new Date()
    crop.purchase_price = crop.expected_price
    
    await crop.save()
    
    res.json({ success: true, message: 'Deal accepted!', crop: {
      _id: crop._id,
      crop_type: crop.crop_type,
      status: crop.status,
      trader_name: crop.trader_name
    }})
  } catch (error) {
    res.json({ success: false, error: error.message })
  }
})

// Start Server
const PORT = 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

