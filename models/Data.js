const mongoose = require('mongoose')
slug = require('mongoose-slug-generator')
mongoose.plugin(slug)
const Schema = mongoose.Schema

const DataSchema = new Schema({
    name: {
        type: String
    },
    url: {
        type: String
    },
    method: {
        type: String
    },
    data:{
        type: Object
    },
    title: {
        type: String
    },
    slug: {type: String, slug: 'title'}

})

const Data = mongoose.model('Data', DataSchema)

module.exports = Data