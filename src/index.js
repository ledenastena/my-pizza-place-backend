const express = require('express')
require('./db/mongoose')
const productTypeRouter = require('./routers/product-type')
const productRouter = require('./routers/product')
const userTypeRouter = require('./routers/user-type')
const userRouter = require('./routers/user')
const orderRouter = require('./routers/order')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(productTypeRouter)
app.use(productRouter)
app.use(userTypeRouter)
app.use(userRouter)
app.use(orderRouter)

app.listen(port, () => {
  console.log('Server is running on port ' + port)
})