const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
  try {
    // Authorization header has the content of 'Bearer' followed by a space and the token so we extract the token only
    const token = req.header('Authorization').replace('Bearer ', '')  
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findOne({_id: decoded._id, 'tokens.token': token})

    if (!user) {
      throw new Error()
    }

    req.user = user
    req.token = token
    next()
  }
  catch(err) {
    res.status(401).send()
  }
}

const authAdmin = async (req, res, next) => {
  try {
    await req.user.populate('user_type_id').execPopulate()
    if (req.user.user_type_id.name !== 'admin') {
      throw new Error()
    }
    next()
  }
  catch(err) {
    res.status(401).send()
  }
}

module.exports = {
  auth,
  authAdmin
}