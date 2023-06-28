const express=require('express')
const router=express.Router()
const userData=require('../controllers/auth.controller')
const {getMe}=require('../middleware/auth') 
const {protect}=require('../middleware/auth')   

router.post('/api/v1/user-reg',userData.userRegister)

router.post('/api/v1/user-login',userData.userLogin)

//logout user (that delete token from cookie)
router.get('/api/v1/user-logout',protect,userData.userLogout)

//get current logged in user detail  (that use token from header or cookie)
router.get('/api/v1/get-me',protect,getMe)

//user forgot password 
router.post('/api/v1/forgot-password',userData.forgetPassword)

//user reset password 
router.put('/api/v1/resetpassword/:resettoken',userData.resetPassword)

//update user details such as name,email....(not for password)
router.put('/api/v1/update-userdata',protect,userData.updateUserData)

//update user pasword
router.put('/api/v1/update-user-password',protect,userData.updateUserPassword)



module.exports= router 