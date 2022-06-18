const Data = require('../models/Data')


const store = (req, res, next) => {
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
}

module.exports = store