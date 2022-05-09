const Data = require('../models/Data')

const index = (req, res, next) => {
    Data.find()
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
}

// const show = (req, res, next) => {
//     let employeeID = req.body.employeeID
//     Data.findById(employeeID)
//      .then(response => {
//          res.json({
//              response
//          })
//      })
//      .catch(error => {
//          res.json({
//              message: 'An error Occured!'
//          })
//      })
// }

const store = (req, res, next) => {
    let data = new Data({
        name: req.body.name,
        url: req.body.url,
        method: req.body.method,
        data: req.body.data,
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

// const update = (req, res, next) => {
//     let employeeID = req.body.employeeID

//     let data = new Data({
//         name: req.body.name,
//         url: req.body.url,
//         method: req.body.method,
//         data: req.body.data,
//     })

//     Data.findByIdAndUpdate(employeeID, {$set: updateData})
//     .then(() => {
//         res.json({
//             message: 'Employee update successfully!'
//         })
//     })
//     .catch(error => {
//         res.json({
//             message: 'An error Occured!'
//         })
//     })
// }

// const destroy = (req, res, next) => {
//     let employeeID = req.body.employeeID
//     Employee.findByIdAndRemove(employeeID)
//     .then(() => {
//         res.json({
//             message: 'Employee delete successfully!'
//         })
//     })
//     .catch(error => {
//         res.json({
//             message: 'An error Occured!'
//         })
//     })
// }

module.exports = {
    index, store
}