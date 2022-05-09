const express = require('express')
const app = express()
const mongoose = require('mongoose')
slug = require('mongoose-slug-generator')
mongoose.plugin(slug)
const bodyParser = require('body-parser')
const DataRoute = require('./routes/data')
const Data = require('./models/Data')
require('dotenv').config()

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', (err) => {
    console.log(err)
})

db.once('open', () => {
    console.log('Database Connection Established!')
})

app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'))
app.use('/api/data', DataRoute)


app.get('/:slug', function (req, res, next) {
    res.sendFile(__dirname + '/index.html')
 });

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html')
})

app.post('/getDataByName', function(req, res) {
    console.log('find by slug')
    Data.findOne({name: req.body.name})
     .then(response => {
         res.json({
             response
         })
     })
     .catch(error => {
         res.json({
             message: 'An error Occured!'
         })
     })
})

app.post('/deleteDataById', function(req, res) {
    console.log('data delete')
    let dataID = req.body.id
    Data.findByIdAndRemove(dataID)
    .then(() => {
        res.json({
            message: 'Data delete successfully!'
        })
    })
    .catch(error => {
        res.json({
            message: 'An error Occured!'
        })
    })
})

app.post('/save', function(req, res) {
    console.log('saved')
    let data = new Data({
        name: req.body.name,
        url: req.body.url,
        method: req.body.method,
        data: req.body.data,
        title:req.body.name,
        slug:req.body.name
    })
    data.save()
    .then(response => {
        res.json({
            response
        })
    })
    .catch(error => {
        res.json({
            message: 'An error Occured!'
        })
    })
})

const PORT = process.env.PORT || 3009

app.listen(PORT, function() {
    console.log('server is running on 3009')
})



