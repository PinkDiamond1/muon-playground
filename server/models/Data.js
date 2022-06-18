const mongoose = require('mongoose')

const DataSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    method: {
        type: String,
        required: true
    },
    data: {
        type: Object,
        required: true
    },
    slug: {
        type: String,
        required: true
    }
    
})


const Data = mongoose.model('DataSchema', DataSchema)

module.exports = Data