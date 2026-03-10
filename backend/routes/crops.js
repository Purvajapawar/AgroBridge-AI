const express = require('express')
const router = express.Router()
const Crop = require('../models/Crop')
const User = require('../models/User')
const axios = require('axios')

const toSnakeCase = (obj) => {
  const result = {}
  for (const key in obj) {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
    result[snakeKey] = obj[key]
  }
  return result
}

const toCamelCase = (obj) => {
  if (!obj) return obj
  const result = {}
  for (const key in obj) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
    result[camelKey] = obj[key]
  }
  return result
}

const getFallbackPricePrediction = (cropType, expectedPrice, location) => {
  const cropMultipliers = { 'wheat': 1.15, 'rice': 1.20, 'corn': 1.10, 'soybean': 1.18, 'cotton': 1.22, 'sugarcane': 1.08, 'potato': 1.12, 'tomato': 1.25, 'onion': 1.30, 'mustard': 1.14 }
  const locationMultipliers = { 'punjab': 1.10, 'maharashtra': 1.05, 'haryana': 1.08, 'uttar pradesh': 1.03, 'madhya pradesh': 1.02, 'gujarat': 1.04, 'karnataka': 1.06, 'tamil nadu': 1.07, 'west bengal': 1.05, 'rajasthan': 1.01 }
  const cropMultiplier = cropMultipliers[cropType?.toLowerCase()] || 1.15
  const locationMultiplier = locationMultipliers[location?.toLowerCase()] || 1.0
  const predictedPrice = Math.round(expectedPrice * cropMultiplier * locationMultiplier)
  const suggestedPrice = Math.round(predictedPrice * 0.97)
  return { predicted_price: predictedPrice, suggested_price: suggestedPrice, recommendation: predictedPrice > expectedPrice ? 'increase' : 'hold', diff: predictedPrice - expectedPrice, source: 'fallback_model' }
}

// DEBUG endpoint - Get raw crop data
router.get('/debug/available', async (req, res) => {
  try {
    const crops = await Crop.find({ status: 'available' }).sort({ createdAt: -1 })
    const rawData = crops.map(c => ({
      _id: c._id ? c._id.toString() : null,
      id: c._id ? c._id.toString() : null,
      cropType: c.crop_type,
      farmerName: c.farmer_name,
      quantity: c.quantity,
      expectedPrice: c.expected_price,
      grade: c.grade,
      location: c.location,
      state: c.state,
      district: c.district
    }))
    res.json({ success: true, count: crops.length, crops: rawData })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

router.post('/upload', async (req, res) => {
  try {
    const data = toSnakeCase(req.body)
    const { farmer_id, farmer_name, crop_type, quantity, expected_price, location, state, district, ai_predicted_price, suggested_price, grade, broken_percentage, color_score, image_url } = data
    if (!crop_type || !quantity || !expected_price) {
      return res.status(400).json({ success: false, message: 'Missing required fields' })
    }
    const cropState = state || location || ''
    const cropDistrict = district || ''
    let validFarmerId = null
    if (farmer_id && farmer_id.length === 24) {
      try {
        const mongoose = require('mongoose')
        if (mongoose.Types.ObjectId.isValid(farmer_id)) validFarmerId = farmer_id
      } catch (e) { validFarmerId = null }
    }
    const crop = new Crop({
      farmer_id: validFarmerId, farmer_name: farmer_name || '', crop_type, quantity, expected_price,
      location: cropState, state: cropState, district: cropDistrict,
      ai_predicted_price: ai_predicted_price || expected_price, suggested_price: suggested_price || expected_price,
      grade: grade || 'B', broken_percentage: broken_percentage || 5, color_score: color_score || 7, image_url: image_url || '', status: 'available'
    })
    await crop.save()
    res.status(201).json({ success: true, message: 'Crop uploaded successfully', crop: toCamelCase(crop.toObject()) })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to upload crop', error: error.message })
  }
})

router.get('/', async (req, res) => {
  try {
    const crops = await Crop.find({ status: 'available' }).sort({ createdAt: -1 })
    res.json({ success: true, crops: crops.map(c => toCamelCase(c.toObject())) })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch crops', error: error.message })
  }
})

router.get('/available', async (req, res) => {
  try {
    const crops = await Crop.find({ status: 'available' }).sort({ createdAt: -1 })
    const cropsData = crops.map(c => {
      const obj = c.toObject()
      const camelObj = toCamelCase(obj)
      // Ensure id field is set for frontend compatibility
      camelObj.id = obj._id ? obj._id.toString() : null
      return camelObj
    })
    res.json({ success: true, crops: cropsData })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch crops', error: error.message })
  }
})

router.get('/farmer/:farmerId', async (req, res) => {
  try {
    const crops = await Crop.find({ farmer_id: req.params.farmerId }).sort({ createdAt: -1 })
    res.json({ success: true, crops: crops.map(c => toCamelCase(c.toObject())) })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch crops', error: error.message })
  }
})

router.post('/accept', async (req, res) => {
  try {
    const { cropId, traderId, traderName } = req.body
    console.log('=== POST /api/crops/accept ===')
    console.log('cropId:', cropId, 'traderId:', traderId)
    
    if (!cropId) return res.status(400).json({ success: false, message: 'cropId is required' })
    if (!traderId) return res.status(400).json({ success: false, message: 'traderId is required' })

    let finalTraderName = traderName
    if (!finalTraderName && traderId) {
      try {
        const trader = await User.findById(traderId)
        if (trader) finalTraderName = trader.name
      } catch (err) { finalTraderName = 'Trader' }
    }

    const crop = await Crop.findById(cropId)
    if (!crop) return res.status(404).json({ success: false, message: 'Crop not found' })
    if (crop.status !== 'available') return res.status(400).json({ success: false, message: `Crop is not available. Current status: ${crop.status}` })

    crop.status = 'sold_to_trader'
    crop.deal_status = 'accepted'
    crop.trader_id = traderId
    crop.trader_name = finalTraderName || 'Trader'
    crop.accepted_at = new Date()
    crop.purchase_price = crop.expected_price

    await crop.save()
    console.log('SUCCESS: Deal accepted! Crop ID:', crop._id)

    res.json({ success: true, message: 'Deal accepted successfully', crop: toCamelCase(crop.toObject()) })
  } catch (error) {
    console.error('Accept deal error:', error)
    res.status(500).json({ success: false, message: 'Failed to accept deal: ' + error.message })
  }
})

router.post('/accept-with-price', async (req, res) => {
  try {
    const { cropId, traderId, traderName, price } = req.body
    if (!cropId || !traderId || !price) return res.status(400).json({ success: false, message: 'cropId, traderId and price are required' })
    const crop = await Crop.findById(cropId)
    if (!crop) return res.status(404).json({ success: false, message: 'Crop not found' })
    if (crop.status !== 'available') return res.status(400).json({ success: false, message: 'Crop is not available' })
    crop.status = 'sold_to_trader'
    crop.deal_status = 'accepted'
    crop.trader_id = traderId
    crop.trader_name = traderName || ''
    crop.purchase_price = price
    crop.accepted_at = new Date()
    await crop.save()
    res.json({ success: true, message: 'Deal accepted successfully', crop: toCamelCase(crop.toObject()) })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to accept deal', error: error.message })
  }
})

router.get('/farmer/:farmerId/deals', async (req, res) => {
  try {
    const crops = await Crop.find({ farmer_id: req.params.farmerId, status: { $ne: 'available' } }).sort({ accepted_at: -1 })
    res.json({ success: true, deals: crops.map(c => toCamelCase(c.toObject())) })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch deals', error: error.message })
  }
})

router.get('/deal/:dealId', async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.dealId)
    if (!crop) return res.status(404).json({ success: false, message: 'Deal not found' })
    res.json({ success: true, deal: toCamelCase(crop.toObject()) })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch deal', error: error.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id)
    if (!crop) return res.status(404).json({ success: false, message: 'Crop not found' })
    res.json({ success: true, crop: toCamelCase(crop.toObject()) })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch crop', error: error.message })
  }
})

router.get('/price-prediction', async (req, res) => {
  try {
    const { crop, state, expectedPrice } = req.query
    if (!crop || !expectedPrice) return res.status(400).json({ success: false, message: 'Crop type and expected price are required' })
    try {
      const mlResponse = await axios.post('http://localhost:5001/predict-price', { cropType: crop, expectedPrice: parseInt(expectedPrice), location: state || '' }, { timeout: 5000 })
      if (mlResponse.data && mlResponse.data.success) return res.json({ success: true, predicted_price: mlResponse.data.predicted_price, suggested_price: mlResponse.data.suggested_price, recommendation: mlResponse.data.recommendation, diff: mlResponse.data.diff, source: 'primary_model' })
    } catch (mlError) { console.log('ML service unavailable, using fallback model') }
    const fallbackResult = getFallbackPricePrediction(crop, parseInt(expectedPrice), state || '')
    res.json({ success: true, ...fallbackResult })
  } catch (error) {
    const safeDefault = getFallbackPricePrediction(req.query.crop || 'wheat', parseInt(req.query.expectedPrice) || 2000, req.query.state || '')
    res.json({ success: true, ...safeDefault, source: 'safe_default' })
  }
})

module.exports = router
