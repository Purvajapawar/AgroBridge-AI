const express = require('express')
const router = express.Router()
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

// POST /api/profile/address - Save user address
router.post('/address', async (req, res) => {
  try {
    const { userId, full_address, village, district, state, pincode, latitude, longitude } = req.body

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Update address
    user.address = {
      full_address: full_address || '',
      village: village || '',
      district: district || user.district || '',
      state: state || user.state || '',
      pincode: pincode || '',
      latitude: latitude || null,
      longitude: longitude || null
    }

    await user.save()

    res.json({
      success: true,
      message: 'Address saved successfully',
      address: toCamelCase(user.address)
    })
  } catch (error) {
    console.error('Save address error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to save address',
      error: error.message
    })
  }
})

// GET /api/profile/address/:userId - Get user address
router.get('/address/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password')
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.json({
      success: true,
      address: toCamelCase(user.address),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        state: user.state,
        district: user.district
      }
    })
  } catch (error) {
    console.error('Get address error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get address',
      error: error.message
    })
  }
})

// GET /api/profile/:userId - Get user profile with address
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password')
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        state: user.state,
        district: user.district,
        contact_number: user.contact_number,
        gst_number: user.gst_number,
        address: toCamelCase(user.address)
      }
    })
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: error.message
    })
  }
})

// GET /api/profile/user/:userId/address - Get farmer/trader address for display
router.get('/user/:userId/address', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('name role address state district')
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Return public address info (for display in other dashboards)
    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        role: user.role,
        address: {
          full_address: user.address?.full_address || '',
          village: user.address?.village || '',
          district: user.address?.district || user.district || '',
          state: user.address?.state || user.state || '',
          pincode: user.address?.pincode || '',
          latitude: user.address?.latitude || null,
          longitude: user.address?.longitude || null
        }
      }
    })
  } catch (error) {
    console.error('Get user address error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get user address',
      error: error.message
    })
  }
})

module.exports = router

