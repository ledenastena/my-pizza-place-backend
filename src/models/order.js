const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  items: [    
     {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }    
  ],
  quantities: [
    {
      type: Number,
      validate(value) {
        if (value <= 0) {
          throw new Error('Quantity must be a positive number!')
        }
      }
    }
  ],
  total_quantity: {
    type: Number,
    required: true,
    validate(value) {
      if (value <= 0) {
        throw new Error('The value must be a positive number!')
      }
    }
  },
  total_price_eur: {
    type: Number,
    required: true,
    validate(value) {
      if (value <= 0) {
        throw new Error('The value must be a positive number!')
      }
    }
  },
  total_price_usd: {
    type: Number,
    required: true,
    validate(value) {
      if (value <= 0) {
        throw new Error('The value must be a positive number!')
      }
    }
  }
},{
  timestamps: true
})

const Order = mongoose.model('Order', orderSchema)

module.exports = Order