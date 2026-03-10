const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['farmer', 'trader', 'mill']
  },
  // Contact number - use this as primary phone field
  contact_number: {
    type: String,
    required: true
  },
  // GST number - only required for trader and mill
  gst_number: {
    type: String,
    required: false,
    default: undefined
  },
  state: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  // Address fields for Address Management System
  address: {
    full_address: {
      type: String,
      default: ''
    },
    village: {
      type: String,
      default: ''
    },
    district: {
      type: String,
      default: ''
    },
    state: {
      type: String,
      default: ''
    },
    pincode: {
      type: String,
      default: ''
    },
    latitude: {
      type: Number,
      default: null
    },
    longitude: {
      type: Number,
      default: null
    }
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('User', userSchema)
