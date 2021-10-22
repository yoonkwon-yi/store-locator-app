const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')

//CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.In other words, CORS is a browser security feature that restricts cross-origin HTTP requests with other servers and specifies which domains access your resources.
const cors = require('cors')

//load env variables
dotenv.config({ path: './config/config.env' })
const app = express()

//Connect to database
connectDB()

//Body parser Middleware (send data to API)
app.use(express.json())

//Enable cors
app.use(cors())

//Set static folder
app.use(express.static(path.join(__dirname, 'public')))

//Routes
app.use('/api/v1/stores', require('./routes/stores'))

const PORT = process.env.PORT || 5000

app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)
