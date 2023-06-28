const express=require('express')
const router=express.Router()
const userData=require('../controllers/user.controller')
const {protect,authorize}=require('../middleware/auth')

// get all users by admin
router.get('/api/v1/auth/all-user',protect,authorize('publisher'),userData.getAllUsers)

//get single user by admin 
router.get('/api/v1/auth-user/:userId',protect,authorize("publisher"),userData.getUser)

//create user by admin
router.post('/api/v1/auth/create-user',protect,authorize("publisher"),userData.createUser)

//update user by admin
router.put('/api/v1/auth/update-user/:userId',protect,authorize("publisher"),userData.updateUser)

//delete user by admin
router.delete('/api/v1/auth/delete-user/:userId',protect,authorize("publisher"),userData.deleteUser)

module.exports= router 