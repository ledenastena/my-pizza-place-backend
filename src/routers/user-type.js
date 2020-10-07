const express = require('express')
const UserType = require('../models/user-type')

const userTypeRouter = new express.Router()

userTypeRouter.get('/user-types', async (req, res) => {
  try {
    const userTypes = await UserType.find()
    res.send(userTypes)
  }
  catch(err) {
    res.status(500).send()
  }
})

userTypeRouter.post('/user-types', async (req, res) => {
  const userType = new UserType(req.body)

  try {
    await userType.save()
    res.status(201).send()
  }
  catch(err) {
    res.status(400).send()
  }
})

userTypeRouter.patch('/user-types/:id', async (req, res) => {
  const _id = req.params.id

  try {
    const userType = await UserType.findByIdAndUpdate(_id, req.body, {new: true})

    if (!userType) {
      return res.status(404).send()
    }

    res.send(userType)
  }
  catch(err) {
    res.status(400).send()
  }
})

module.exports = userTypeRouter