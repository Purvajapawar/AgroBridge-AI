const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const JWT_SECRET = 'agrobridge_ai_secret_key_2024'

// Validation regex patterns
const CONTACT_NUMBER_REGEX = /^[6-9][0-9]{9}$/
const GST_NUMBER_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, contact_number, gst_number, state, district } = req.body

    console.log('Registration request received:', { name, email, role, contact_number, state, district })

    // Validate required fields
    if (!name || !email || !password || !role || !state || !district) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      })
    }

    // Validate contact number (10 digits, starting with 6-9)
    if (!contact_number || !CONTACT_NUMBER_REGEX.test(contact_number)) {
      return res.status(400).json({
        success: false,
        message: 'Contact number must be 10 digits starting with 6-9'
      })
    }

    // Validate GST number for trader and mill
    if ((role === 'trader' || role === 'mill') && (!gst_number || !GST_NUMBER_REGEX.test(gst_number))) {
      return res.status(400).json({
        success: false,
        message: 'GST number is required for traders and mills. Format: 22ABCDE1234F1Z5'
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create new user
    const user = new User({
      name,
      email: email.toLowerCase(),
      phone: contact_number,
      password: hashedPassword,
      role,
      contact_number: contact_number,
      gst_number: (role === 'trader' || role === 'mill') ? gst_number : undefined,
      state,
      district
    })

    await user.save()
    console.log('User saved successfully:', user._id)

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        state: user.state,
        district: user.district,
        contact_number: user.contact_number,
        gst_number: user.gst_number
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Registration failed',
      error: error.message
    })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        state: user.state,
        district: user.district,
        contact_number: user.contact_number,
        gst_number: user.gst_number
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    })
  }
})

// GET /api/auth/me - Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    const user = await User.findById(decoded.id).select('-password')
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.json({
      success: true,
      user
    })
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    })
  }
})

// GET /api/auth/states - Get all Indian states
router.get('/states', async (req, res) => {
  try {
    const states = [
      'Maharashtra',
      'Punjab',
      'Haryana',
      'Uttar Pradesh',
      'Madhya Pradesh',
      'Gujarat',
      'Rajasthan',
      'Karnataka',
      'Tamil Nadu',
      'West Bengal'
    ]

    res.json({
      success: true,
      states
    })
  } catch (error) {
    console.error('Get states error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch states',
      error: error.message
    })
  }
})

// GET /api/auth/districts/:state - Get districts by state
router.get('/districts/:state', async (req, res) => {
  try {
    const { state } = req.params
    
    // District data for Indian states
    const districtsByState = {
      'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Kolhapur', 'Satara', 'Solapur', 'Aurangabad', 'Thane', 'Raigad'],
      'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Hoshiarpur', 'Pathankot', 'Moga', 'Firozpur', 'Kapurthala'],
      'Haryana': ['Gurgaon', 'Faridabad', 'Panipat', 'Rohtak', 'Karnal', 'Hisar', 'Sonipat', 'Rewari', 'Sirsa', 'Panchkula'],
      'Uttar Pradesh': ['Lucknow', 'Agra', 'Varanasi', 'Allahabad', 'Kanpur', 'Ghaziabad', 'Aligarh', 'Bareilly', 'Meerut', 'Moradabad'],
      'Madhya Pradesh': ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain', 'Sagar', 'Dewas', 'Satna', 'Ratlam', 'Rewa'],
      'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Gandhinagar', 'Anand', 'Patan'],
      'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer', 'Pilani', 'Alwar', 'Bhilwara', 'Sikar'],
      'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Dharwad', 'Gulbarga', 'Bellary', 'Tumkur', 'Shimoga'],
      'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tiruppur', 'Vellore', 'Erode', 'Tirunelveli', 'Thoothukudi'],
      'West Bengal': ['Kolkata', 'Howrah', 'Asansol', 'Siliguri', 'Durgapur', 'Bardhaman', 'Malda', 'Kharagpur', 'Berhampore', 'Haldia']
    }

    const districts = districtsByState[state] || []

    res.json({
      success: true,
      districts
    })
  } catch (error) {
    console.error('Get districts error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch districts',
      error: error.message
    })
  }
})

module.exports = router
