const express = require('express')
require('./db/mongoose')
const productTypeRouter = require('./routers/product-type')
const productRouter = require('./routers/product')
const userTypeRouter = require('./routers/user-type')
const userRouter = require('./routers/user')
const orderRouter = require('./routers/order')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 3000

const corsOptions = {
  origin: 'https://my-pizza-place-frontend.herokuapp.com',
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
app.options('*', cors(corsOptions))

app.use(express.json())
app.use(productTypeRouter)
app.use(productRouter)
app.use(userTypeRouter)
app.use(userRouter)
app.use(orderRouter)

app.listen(port, () => {
  console.log('Server is running on port ' + port)
})