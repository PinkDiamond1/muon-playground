const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')

require('dotenv/config')

app.use(bodyParser.json())
app.use(cors())

const readData = require('./routes/posts')

app.use('/', readData)

app.get('/', (req, res) => {
    res.send('server is run')
})

mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true }, 
    () => {
        console.log('connected to DB!')
    }
)

app.listen(5401, () => {
    console.log('server started on port 3010')
})