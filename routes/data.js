const express = require('express')

const router = express.Router()

const DataController = require('../controllers/DataControllers')

router.get('/', DataController.index)
// router.post('/show', DataController.show)
router.post('/store', DataController.store)
// router.post('/update', DataController.update)
// router.post('/delete', DataController.destroy)

module.exports = router