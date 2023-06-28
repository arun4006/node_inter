const jwt=require('jsonwebtoken')
const User = require("../models/user.model");
const ErrorResponse=require('../utils/ErrorResponse')
const asyncHandler=require('../middleware/async')
const crypto=require('crypto')

//protect routes
exports.protect=asyncHandler(async (req, res, next) => {

    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
    {
        token=req.headers.authorization.split(' ')[1];
    }

    else if(req.cookies.token){
        token=req.cookies.token
    }


// make sure token is exist or not
    if(!token){
        return next(new ErrorResponse('not authorized to access this route',401))
    }

    try{
      const decoded=jwt.verify(token,process.env.JWT_SECRET)
      console.log(decoded);
      
      req.user=await User.findById(decoded._id)
    // console.log(req.user);
      next()
    }
    catch(e){
        return next(new ErrorResponse('Not authorized to access this route',401))
    }
})


//get current logged in user detail
exports.getMe=asyncHandler(async (req, res, next) => {
  const user=await User.findById(req.user.id)
  console.log(user);
  res.status(200).json({
      success:true,
      data:user
  })
})    

//grant access to route based on user role

exports.authorize=(...roles)=>{
    console.log(roles);
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorResponse(`user role:${req.user.role} so not authorized to access this route`,403))
        }
        next()
    }
  
}

