const mongoose = require('mongoose')


const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price_eur: {
    type: Number,
    required: true,
    validate(value) {
      if (value <=0) {
        throw new Error('The price value must be a positive amount')
      }
    }
  },
  price_usd: {
    type: Number,
    required: true,
    validate(value) {
      if (value <=0) {
        throw new Error('The price value must be a positive amount')
      }
    }
  },
  product_type_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product_type'
  },
  image: {
    type: Buffer
  },
  image_name: {
    type: String
  }
},{
  timestamps: true
})

// We are removing the image field from the product object so we don't send it as a response because it is big, instead we
// are providing urls for all products images
productSchema.methods.toJSON = function () {
  const product = this
  const productObject = product.toObject()

  delete productObject.image

  return productObject
}

const Product = mongoose.model('Product', productSchema)

module.exports = Product