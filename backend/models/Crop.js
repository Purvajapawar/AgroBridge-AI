const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  farmer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  farmer_name: {
    type: String,
    default: ''
  },
  crop_type: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  expected_price: {
    type: Number,
    required: true
  },
  // Purchase price (what trader paid)
  purchase_price: {
    type: Number,
    default: 0
  },
  // Keep location for backward compatibility
  location: {
    type: String,
    required: true
  },
  // New state and district fields
  state: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  ai_predicted_price: {
    type: Number,
    default: 0
  },
  suggested_price: {
    type: Number,
    default: 0
  },
  grade: {
    type: String,
    default: 'B'
  },
  broken_percentage: {
    type: Number,
    default: 5
  },
  color_score: {
    type: Number,
    default: 7
  },
  image_url: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['available', 'sold_to_trader', 'sold_to_mill'],
    default: 'available'
  },
  // Deal status for tracking
  deal_status: {
    type: String,
    enum: ['available', 'accepted', 'pending_payment', 'paid', 'delivered', 'completed'],
    default: 'available'
  },
  // When deal was accepted
  accepted_at: {
    type: Date,
    default: null
  },
  // When payment was made
  paid_at: {
    type: Date,
    default: null
  },
  // When delivery was confirmed
  delivered_at: {
    type: Date,
    default: null
  },
  trader_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  trader_name: {
    type: String,
    default: ''
  },
  mill_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  mill_name: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Crop', cropSchema);

