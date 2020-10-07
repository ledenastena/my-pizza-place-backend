const express = require('express')
const ProductType = require('../models/product-type')
const { auth, authAdmin } = require('../middleware/auth')

const productTypeRouter = new express.Router()

productTypeRouter.get('/product-types', auth, authAdmin, async (req, res) => {
  try {
    const productTypes = await ProductType.find()
    res.send(productTypes)
  }
  catch(err) {
    res.status(500).send()
  }
})

productTypeRouter.post('/product-types', auth, authAdmin, async (req, res) => {
  const productType = new ProductType(req.body)

  try {
    await productType.save()
    res.status(201).send(productType)
  }
  catch(err) {
    res.status(400).send()
  }
})

productTypeRouter.patch('/product-types/:id', auth, authAdmin, async (req, res) => {
  const _id = req.params.id

  try {
    const productType = await ProductType.findByIdAndUpdate(_id, req.body, { new: true })

    if (!productType) {
      return res.status(404).send()
    }

    res.send(productType)
  }
  catch(err) {
    res.status(400).send()
  }
})

module.exports = productTypeRouter