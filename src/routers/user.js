const express = require('express')
const User = require('../models/user')
const { auth } = require('../middleware/auth')

const userRouter = new express.Router()

userRouter.get('/users/me', auth, (req, res) => {
  res.send(req.user)
})

// Create a new user - sign up
userRouter.post('/users', async (req, res) => {
  try {
    const user = new User(req.body)
    await user.save()    
    const token = await user.generateAuthToken()
    await user.populate('user_type_id').execPopulate()

    res.status(201).send({ 
      user,
      token,
      userType: user.user_type_id.name
    })
  }
  catch(err) {
    res.status(400).send('Invalid data.')
  }
})

// Update a user
userRouter.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body.updates)
  const allowedUpdates = ['name', 'email', 'password']
  const isValidUpdate = updates.every(update => allowedUpdates.includes(update))

  if (!isValidUpdate) {
    res.status(400).send('Invalid data.')
  }

  try {
    if (req.body.updates.password) {
      const user = await User.findByCredentials(req.user.email, req.body.old_password)
    }

    updates.forEach( key => {
      req.user[key] = req.body.updates[key] 
    })

    await req.user.save()
    res.send(req.user)
  }
  catch(err) {
    res.status(400).send('Invalid data.')
  }
})

// User login
userRouter.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    await user.populate('user_type_id').execPopulate()

    res.send({ 
      user,
      token,
      userType: user.user_type_id.name
    })
  }
  catch(err) {
    res.status(400).send('Invalid data.')
  }
})

// User logout
userRouter.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(tokenObj => tokenObj.token !== req.token)
    await req.user.save()
    res.send()
  }
  catch(err) {
    res.status(500).send()
  }
})

module.exports = userRouter