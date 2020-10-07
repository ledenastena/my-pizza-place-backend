const express = require('express')
const Product = require('../models/product')
const ProductType = require('../models/product-type')
const { auth, authAdmin } = require('../middleware/auth')
const multer = require('multer')

const productRouter = new express.Router()

const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please provide a jpg/jpeg/png file!'))
    }
    cb(undefined, true)
  }
})

productRouter.get('/products', async (req, res) => {
  try {
    if (req.query.type) {
      const requestedType = await ProductType.findOne({ name: req.query.type})

      if (requestedType) {
        await requestedType.populate('products').execPopulate()
        return res.send(requestedType.products)
      }
    }

    const products = await Product.find()
    res.send(products)
  }
  catch(err) {
    res.status(500).send()
  }
})

// Url for product image to use on frontend
productRouter.get('/products/:_id/:image_name', async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params._id, image_name: req.params.image_name})

    if (!product || !product.image) {
      throw new Error()
    }
    res.set('Content-Type', 'image/png')
    res.send(product.image)
  }
  catch(err) {
    res.status(404).send()
  }
})

productRouter.post('/products', auth, authAdmin, upload.single('image'), async (req, res) => {
  const product = new Product(req.body)
  
  try {
    
    if (req.file.buffer) {
      product.image = req.file.buffer
      product.image_name = req.file.originalname
    }

    await product.save()
    res.status(201).send()
  }
  catch(err) {
    res.status(400).send('Invalid data.')
  }
}, (error, req, res, next) => {
  res.status(400).send('Invalid file upload.')
})

productRouter.patch('/products/:id', auth, authAdmin, upload.single('image'), async (req, res) => {
  const _id = req.params.id
  
  try {
    const updateObj = req.body
    if (req.file) {
      updateObj.image = req.file.buffer
      updateObj.image_name = req.file.originalname
    }
    const product = await Product.findByIdAndUpdate(_id, updateObj, {new: true, runValidators: true })

    if (!product) {
      return res.status(404).send('Product not found.')
    }

    res.send(product)
  }
  catch(err) {
    res.status(400).send('Invalid data.')
  }
})

productRouter.delete('/products/:id', auth, authAdmin, async (req, res) => {
  const _id = req.params.id

  try {
    const product = await Product.findByIdAndDelete(_id)

    if (!product) {
      return res.status(404).send('Product not found.')
    }

    res.send(product)
  }
  catch(err) {
    res.status(500).send()
  }
})

module.exports = productRouter