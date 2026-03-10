const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
  payment_id: {
    type: String,
    required: true,
    unique: true
  },
  deal_id: {
    type: String,
    required: true
  },
  crop_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crop',
    required: true
  },
  from_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  from_user_name: {
    type: String,
    required: true
  },
  from_user_role: {
    type: String,
    enum: ['trader', 'mill'],
    required: true
  },
  to_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  to_user_name: {
    type: String,
    required: true
  },
  to_user_role: {
    type: String,
    enum: ['farmer', 'trader'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Escrow_Held', 'Released', 'Cancelled'],
    default: 'Pending'
  },
  delivery_status: {
    type: String,
    enum: ['Pending', 'In_Transit', 'Delivered', 'Confirmed'],
    default: 'Pending'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  released_at: {
    type: Date,
    default: null
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Payment', paymentSchema)

