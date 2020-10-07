const express = require('express')
const Order = require('../models/order')
const Product = require('../models/product')
const { auth } = require('../middleware/auth')

const orderRouter = new express.Router()

orderRouter.get('/orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user_id: req.user._id}).populate('items')

    res.send(orders)
  }
  catch(err) {
    res.status(500).send()
  }
})

orderRouter.post('/orders', auth, async (req, res) => {
  const order =  new Order(req.body)

  try {
    await order.save()
    res.status(201).send({ order })
  }
  catch(err) {
    res.status(500).send() 
  }
})

module.exports = orderRouter