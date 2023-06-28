const User = require("../models/user.model");
const ErrorResponse=require('../utils/ErrorResponse')
const asyncHandler=require('../middleware/async')
const sendEmail=require('../utils/sendEmail')
const crypto=require('crypto')

exports.userRegister=asyncHandler(async (req, res, next) => {

    const {name,email,password,role}=req.body;

    const user=await User.create({name,email,password,role})

    const token=user.getSignedJwtToken();

    res.status(200).json({success:true,tokens:token})
})


exports.userLogin=asyncHandler(async (req, res, next) => {

   const {email,password}=req.body;
   console.log(typeof email);

   //it prevents from attack e.g "email":{"$gt":""} 
   if (typeof email === 'object') { 
     return next(new ErrorResponse('Please provide an email and password', 400));   
    }

   if(!email | !password)
   {
    return next(new ErrorResponse('please provide email and password',400))
   }

    const user=await User.findOne({email:email}).select('+password')
    console.log(user);

    if(!user)
   {
    return next(new ErrorResponse('user not found',401))
   }

//password checking
 const isMatch=await user.matchPassword(password)

 if(!isMatch)
 {
  return next(new ErrorResponse('Invalid credentials',401))
 }

 sendTokenResponse(user,200,res);
})

//get token from model,create cookie, send response
const sendTokenResponse=(user,statusCode,res)=>{
 
    const token=user.getSignedJwtToken();
    const options={
        httpOnly:true
    }
    
    res.status(statusCode)
    .cookie('token',token,options)
    .json({
        success:true,
        token
    })

}


//forgot password
exports.forgetPassword=asyncHandler(async (req, res, next) => {
  const user=await User.findOne({email:req.body.email});
  
  if(!user)
  {
   return next(new ErrorResponse('There is no user with this email',404))
  }
//get reset token
const resetToken=user.getResetPasswordToken();
console.log(resetToken);

await user.save({validateBeforeSave:false}) 

const resetUrl=`${req.protocol}://${req.get('host')}/api/v1/resetpassword/${resetToken}`

const message=`You are receiving this email,because you are requested to reset your password..
              please make a PUT request to: \n\n ${resetUrl}`

 try{
  await sendEmail({
      email:user.email,
      subject:'password reset',
      message
  })
  }
  catch(e){
    console.log(e);
    user.resetPasswordToken=undefined
    user.resetPasswordExpire=undefined

    await user.save({validateBeforeSave:false})
    return next(new ErrorResponse('Email could not sent',500))
  }      
res.status(200).json({
    success:true,
    data:'Email sent successfully..!'
})

})


//reset password by reset token
exports.resetPassword=asyncHandler(async (req, res, next) => {
    const resetPasswordToken=crypto.createHash('sha256').update(req.params.resettoken).digest('hex')

    const user=await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt: Date.now()}
    })
    console.log(user);

    if(!user){
        return next(new ErrorResponse('Invalid token',400))  
    }

    //set new password
    user.password=req.body.password
    user.resetPasswordToken=undefined
    user.resetPasswordExpire=undefined

    await user.save()
    
    sendTokenResponse(user,200,res);
  })  

  exports.updateUserData=asyncHandler(async (req, res, next) => {
    const fielsToupdate={name:req.body.name,email:req.body.email}
    
    const user = await User.findByIdAndUpdate(req.user.id, fielsToupdate, {
        new: true,
        runValidators: true,
      });

     res.status(200).json({
         success:true,
         data:user
     }) 
})

//update password
exports.updateUserPassword=asyncHandler(async (req, res, next) => {
  const user=await User.findById(req.user.id).select('+password')
  console.log(user);
  
  //this.password=await bcrypt.hash(this.password,salt);
  if(!(await user.matchPassword(req.body.currentPassword))){
    return next(new ErrorResponse('Incorrect password',401))      
  }
  user.password=req.body.newPassword;
  await user.save();

  res.status(200).json({
      success:true,
      data:user
  })

  sendTokenResponse(user,200,res);
})

//logout user (that delete token from cookie)
exports.userLogout = asyncHandler(async (req, res, next) => {
  console.log(req.user);
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 + 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    logout: req.user.name
  });
});