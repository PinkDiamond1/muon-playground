const express = require('express')
const router = express.Router()
const Data = require('../models/Data')

router.get('/', (req, res) => {
    res.send('We are on posts')
})

router.post('/store', (req, res) => {
    let data = new Data({
        name: req.body.name,
        url: req.body.url,
        method: req.body.method,
        data: req.body.data,
        slug: req.body.slug,
    })
    data.save()
    .then(response => {
        res.json({
            message: 'data Added Successfully'
        })
    })
    .catch(error => {
        res.json({
            message: 'An error Occured!'
        })
    })
})

router.post('/getDataByName', function(req, res) {
    console.log('find by slug', req.body)
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

router.post('/deleteDataById', function(req, res) {
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


module.exports = router