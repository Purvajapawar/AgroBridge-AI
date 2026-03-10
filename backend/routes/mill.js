const express = require('express')
const router = express.Router()

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
if (!global.orders) {
  global.orders = []
}
if (!global.traderListings) {
  global.traderListings = []
}

// GET /api/mill/products - Get all trader listings (available products for mills)
router.get('/products', async (req, res) => {
  try {
    const listings = global.traderListings || []
    const availableListings = listings.filter(l => l.status === 'available')
    res.json({
      success: true,
      products: availableListings.map(l => toCamelCase(l))
    })
  } catch (error) {
    console.error('Get products error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    })
  }
})

// POST /api/mill/secure-deal - Mill secures deal (Buy from trader)
router.post('/secure-deal', async (req, res) => {
  try {
    const { millId, millName, listingId } = req.body

    if (!millId || !listingId) {
      return res.status(400).json({
        success: false,
        message: 'millId and listingId are required'
      })
    }

    // Find the listing
    const listingIndex = global.traderListings.findIndex(
      l => l._id === listingId && l.status === 'available'
    )

    if (listingIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found or already sold'
      })
    }

    const listing = global.traderListings[listingIndex]

    // Update listing status
    listing.status = 'sold'
    listing.deal_status = 'accepted_by_mill'
    listing.mill_id = millId
    listing.mill_name = millName || ''
    listing.accepted_at = new Date()

    // Create order
    const order = {
      _id: `order_${Date.now()}`,
      mill_id: millId,
      mill_name: millName || '',
      trader_id: listing.trader_id,
      trader_name: listing.trader_name,
      crop: listing.crop_type,
      quantity: listing.quantity,
      price: listing.listed_price,
      delivery_date: listing.delivery_date,
      status: 'accepted',
      deal_status: 'accepted',
      listing_id: listingId,
      created_at: new Date(),
      accepted_at: new Date()
    }

    global.orders.push(order)

    res.status(201).json({
      success: true,
      message: 'Deal secured successfully',
      order: toCamelCase(order),
      listing: toCamelCase(listing)
    })
  } catch (error) {
    console.error('Secure deal error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to secure deal',
      error: error.message
    })
  }
})

// POST /api/orders/create - Create order (Mill places order) - Legacy
router.post('/orders/create', async (req, res) => {
  try {
    const { millId, millName, traderId, traderName, crop, quantity, price, deliveryDate } = req.body

    const order = {
      _id: `order_${Date.now()}`,
      mill_id: millId,
      mill_name: millName || '',
      trader_id: traderId,
      trader_name: traderName || '',
      crop,
      quantity,
      price,
      delivery_date: deliveryDate,
      status: 'pending',
      deal_status: 'pending',
      created_at: new Date()
    }

    if (!global.orders) {
      global.orders = []
    }
    global.orders.push(order)

    // Also update the listing status if it exists
    if (global.traderListings) {
      const listing = global.traderListings.find(l => l.trader_id === traderId && l.crop_type === crop && l.status === 'available')
      if (listing) {
        listing.status = 'sold'
      }
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: toCamelCase(order)
    })
  } catch (error) {
    console.error('Create order error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    })
  }
})

// GET /api/orders - Get all orders
router.get('/orders', async (req, res) => {
  try {
    const orders = global.orders || []
    res.json({
      success: true,
      orders: orders.map(o => toCamelCase(o))
    })
  } catch (error) {
    console.error('Get orders error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    })
  }
})

// GET /api/orders/mill/:millId - Get mill's orders
router.get('/orders/mill/:millId', async (req, res) => {
  try {
    const orders = (global.orders || []).filter(o => o.mill_id === req.params.millId)
    res.json({
      success: true,
      orders: orders.map(o => toCamelCase(o))
    })
  } catch (error) {
    console.error('Get mill orders error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    })
  }
})

// GET /api/mill/deals/:millId - Get mill's deals
router.get('/deals/:millId', async (req, res) => {
  try {
    const orders = (global.orders || []).filter(o => o.mill_id === req.params.millId)
    
    // Also get listings that this mill bought
    const listings = (global.traderListings || []).filter(
      l => l.mill_id === req.params.millId
    )

    res.json({
      success: true,
      deals: [
        ...orders.map(o => ({ ...o, dealType: 'order' })),
        ...listings.map(l => ({ ...l, dealType: 'listing' }))
      ].map(d => toCamelCase(d))
    })
  } catch (error) {
    console.error('Get mill deals error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch deals',
      error: error.message
    })
  }
})

module.exports = router

