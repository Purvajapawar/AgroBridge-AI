const express = require('express')
const router = express.Router()
const Crop = require('../models/Crop')

// Helper to convert snake_case to camelCase
const toCamelCase = (obj) => {
  if (!obj) return obj
  const result = {}
  for (const key in obj) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
    result[camelKey] = obj[key]
  }
  return result
}

// Initialize global storage if not exists
if (!global.traderListings) {
  global.traderListings = []
}

// GET /api/trader/inventory/:traderId - Get trader's inventory
router.get('/inventory/:traderId', async (req, res) => {
  try {
    const inventory = await Crop.find({ 
      trader_id: req.params.traderId,
      status: 'sold_to_trader'
    }).sort({ accepted_at: -1 })

    res.json({
      success: true,
      inventory: inventory.map(c => {
        const item = c.toObject()
        // Calculate price from purchase_price (what trader paid)
        item.price = item.purchase_price || item.expected_price
        return toCamelCase(item)
      })
    })
  } catch (error) {
    console.error('Get inventory error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inventory',
      error: error.message
    })
  }
})

// GET /api/trader/deals/:traderId - Get trader's all deals (with farmers and mills)
router.get('/deals/:traderId', async (req, res) => {
  try {
    // Get crops bought from farmers
    const farmerDeals = await Crop.find({ 
      trader_id: req.params.traderId,
      status: 'sold_to_trader'
    }).sort({ accepted_at: -1 })

    // Get listings sold to mills
    const millDeals = global.traderListings.filter(
      l => l.trader_id === req.params.traderId && l.status === 'sold'
    )

    res.json({
      success: true,
      farmerDeals: farmerDeals.map(d => ({
        ...toCamelCase(d.toObject()),
        dealType: 'farmer'
      })),
      millDeals: millDeals.map(d => toCamelCase(d))
    })
  } catch (error) {
    console.error('Get deals error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch deals',
      error: error.message
    })
  }
})

// POST /api/trader/create-product - Create listing for mills
router.post('/create-product', async (req, res) => {
  try {
    const { traderId, traderName, cropType, quantity, grade, listedPrice, deliveryDate } = req.body

    if (!traderId || !cropType || !quantity || !listedPrice) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      })
    }

    // Find crops in inventory
    const crops = await Crop.find({
      trader_id: traderId,
      status: 'sold_to_trader',
      crop_type: cropType
    })

    if (crops.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No crops found in inventory for this type'
      })
    }

    // Calculate total quantity available
    const totalQuantity = crops.reduce((sum, c) => sum + c.quantity, 0)

    if (totalQuantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient quantity. Available: ${totalQuantity} quintals`
      })
    }

    // Create listing
    const listing = {
      _id: `listing_${Date.now()}`,
      trader_id: traderId,
      trader_name: traderName || '',
      crop_type: cropType,
      quantity,
      grade: grade || 'B',
      listed_price: listedPrice,
      delivery_date: deliveryDate,
      status: 'available',
      deal_status: 'available',
      created_at: new Date()
    }

    global.traderListings.push(listing)

    res.status(201).json({
      success: true,
      message: 'Product listed successfully',
      listing: toCamelCase(listing)
    })
  } catch (error) {
    console.error('Create product error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create listing',
      error: error.message
    })
  }
})

// GET /api/trader/listings - Get trader's listings
router.get('/listings', async (req, res) => {
  try {
    const listings = global.traderListings || []
    res.json({
      success: true,
      listings: listings.map(l => toCamelCase(l))
    })
  } catch (error) {
    console.error('Get listings error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch listings',
      error: error.message
    })
  }
})

// GET /api/trader/listings/:traderId - Get trader's own listings
router.get('/listings/:traderId', async (req, res) => {
  try {
    const listings = (global.traderListings || []).filter(
      l => l.trader_id === req.params.traderId
    )
    res.json({
      success: true,
      listings: listings.map(l => toCamelCase(l))
    })
  } catch (error) {
    console.error('Get listings error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch listings',
      error: error.message
    })
  }
})

module.exports = router

