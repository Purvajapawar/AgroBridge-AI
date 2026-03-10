const express = require('express')
const router = express.Router()
const Payment = require('../models/Payment')
const Crop = require('../models/Crop')
const User = require('../models/User')

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

// POST /api/payments/create - Create escrow payment
router.post('/create', async (req, res) => {
  try {
    const { 
      from_user_id, 
      from_user_name, 
      from_user_role,
      to_user_id, 
      to_user_name,
      to_user_role,
      crop_id, 
      amount,
      deal_id 
    } = req.body

    // Validate required fields
    if (!from_user_id || !to_user_id || !crop_id || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      })
    }

    // Validate user roles for security
    if (from_user_role === 'trader' && to_user_role !== 'farmer') {
      return res.status(400).json({
        success: false,
        message: 'Trader can only pay farmers'
      })
    }

    if (from_user_role === 'mill' && to_user_role !== 'trader') {
      return res.status(400).json({
        success: false,
        message: 'Mill can only pay traders'
      })
    }

    // Generate unique payment ID
    const payment_id = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Create payment record
    const payment = new Payment({
      payment_id,
      deal_id: deal_id || payment_id,
      crop_id,
      from_user: from_user_id,
      from_user_name,
      from_user_role,
      to_user: to_user_id,
      to_user_name,
      to_user_role,
      amount,
      status: 'Escrow_Held',
      delivery_status: 'Pending'
    })

    await payment.save()

    res.status(201).json({
      success: true,
      message: 'Payment created and held in escrow',
      payment: toCamelCase(payment.toObject())
    })
  } catch (error) {
    console.error('Create payment error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create payment',
      error: error.message
    })
  }
})

// POST /api/payments/release - Release escrow payment
router.post('/release', async (req, res) => {
  try {
    const { payment_id, delivery_status } = req.body

    if (!payment_id) {
      return res.status(400).json({
        success: false,
        message: 'Payment ID is required'
      })
    }

    const payment = await Payment.findOne({ payment_id })
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      })
    }

    if (payment.status !== 'Escrow_Held') {
      return res.status(400).json({
        success: false,
        message: 'Payment is not in escrow'
      })
    }

    // Update payment status
    payment.status = 'Released'
    payment.delivery_status = delivery_status || 'Delivered'
    payment.released_at = new Date()

    await payment.save()

    res.json({
      success: true,
      message: 'Payment released successfully',
      payment: toCamelCase(payment.toObject())
    })
  } catch (error) {
    console.error('Release payment error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to release payment',
      error: error.message
    })
  }
})

// POST /api/payments/confirm-delivery - Confirm delivery
router.post('/confirm-delivery', async (req, res) => {
  try {
    const { payment_id, user_id, user_role } = req.body

    const payment = await Payment.findOne({ payment_id })
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      })
    }

    // Only the recipient can confirm delivery
    if (payment.to_user.toString() !== user_id) {
      return res.status(403).json({
        success: false,
        message: 'Only the recipient can confirm delivery'
      })
    }

    payment.delivery_status = 'Confirmed'
    await payment.save()

    res.json({
      success: true,
      message: 'Delivery confirmed',
      payment: toCamelCase(payment.toObject())
    })
  } catch (error) {
    console.error('Confirm delivery error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to confirm delivery',
      error: error.message
    })
  }
})

// GET /api/payments/:paymentId - Get payment details
router.get('/:paymentId', async (req, res) => {
  try {
    const payment = await Payment.findOne({ payment_id: req.params.paymentId })
      .populate('from_user', 'name email role')
      .populate('to_user', 'name email role')
      .populate('crop_id')

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      })
    }

    res.json({
      success: true,
      payment: toCamelCase(payment.toObject())
    })
  } catch (error) {
    console.error('Get payment error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get payment',
      error: error.message
    })
  }
})

// GET /api/payments/deal/:dealId - Get payment by deal ID
router.get('/deal/:dealId', async (req, res) => {
  try {
    const payment = await Payment.findOne({ deal_id: req.params.dealId })
      .populate('from_user', 'name email role')
      .populate('to_user', 'name email role')

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      })
    }

    res.json({
      success: true,
      payment: toCamelCase(payment.toObject())
    })
  } catch (error) {
    console.error('Get payment by deal error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get payment',
      error: error.message
    })
  }
})

// GET /api/payments/user/:userId - Get all payments for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const payments = await Payment.find({
      $or: [
        { from_user: req.params.userId },
        { to_user: req.params.userId }
      ]
    })
      .populate('from_user', 'name email role')
      .populate('to_user', 'name email role')
      .sort({ created_at: -1 })

    res.json({
      success: true,
      payments: payments.map(p => toCamelCase(p.toObject()))
    })
  } catch (error) {
    console.error('Get user payments error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get payments',
      error: error.message
    })
  }
})

// GET /api/payments/user/:userId/outgoing - Get outgoing payments
router.get('/user/:userId/outgoing', async (req, res) => {
  try {
    const payments = await Payment.find({ from_user: req.params.userId })
      .populate('to_user', 'name email role')
      .sort({ created_at: -1 })

    res.json({
      success: true,
      payments: payments.map(p => toCamelCase(p.toObject()))
    })
  } catch (error) {
    console.error('Get outgoing payments error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get payments',
      error: error.message
    })
  }
})

// GET /api/payments/user/:userId/incoming - Get incoming payments
router.get('/user/:userId/incoming', async (req, res) => {
  try {
    const payments = await Payment.find({ to_user: req.params.userId })
      .populate('from_user', 'name email role')
      .sort({ created_at: -1 })

    res.json({
      success: true,
      payments: payments.map(p => toCamelCase(p.toObject()))
    })
  } catch (error) {
    console.error('Get incoming payments error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get payments',
      error: error.message
    })
  }
})

module.exports = router

