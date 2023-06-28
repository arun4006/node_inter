const express=require('express')
const router=express.Router()
const bootcampData=require('../controllers/bootcamp.controller')
const {protect,authorize}=require('../middleware/auth')

router.get('/api/v1/bootcamp',bootcampData.getAllData)

router.get('/api/v1/bootcamp/:id',bootcampData.getDataById)


router.post('/api/v1/bootcamp',protect,authorize('publisher'),bootcampData.sendData)

router.put('/api/v1/bootcamp/:id',protect,authorize('publisher'),bootcampData.updateDataById)

router.delete('/api/v1/bootcamp/:id',protect,authorize('publisher'),bootcampData.deleteDataById)
 
router.get('/api/v1/bootcamp/radius/:zipcode/:distance',bootcampData.getBootcamps)

module.exports= router 