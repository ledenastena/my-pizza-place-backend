const mongoose = require('mongoose')

const productTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  }
},{
  timestamps: true
})

productTypeSchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'product_type_id'
})

const ProductType = mongoose.model('Product_type', productTypeSchema)

module.exports = ProductType