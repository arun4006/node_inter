const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt=require('bcryptjs')
//const geocoder=require('../utils/geocoder')
const jwt = require('jsonwebtoken')
const crypto=require('crypto')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique:true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    role: {
        type: String,
        required: true,
        enum: ['user','publisher'],
        default:'user'
    },
    password:{
        type:String,
        required:true,
        minlength:6,
        select:false
    },
   resetPasswordToken:String,
   resetPasswordExpire:Date, 
   createdAt:{
       type:Date,
       default:Date.now
   }
})

userSchema.pre('save',async function(next){
 if(!this.isModified('password')){
     next()
 }

const salt=await bcrypt.genSalt(10)
this.password=await bcrypt.hash(this.password,salt);

})   

//generate token
userSchema.methods.getSignedJwtToken=function(){
    return jwt.sign({_id:this._id,name:this.name},process.env.JWT_SECRET,{
        expiresIn:'30d'
    });
}

//password checking 
userSchema.methods.matchPassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}

//generate hash password and token
userSchema.methods.getResetPasswordToken= function(){
    //generate token
    const resetToken=crypto.randomBytes(20).toString('hex')

    
    //hash token and set into resetpasswordtoken field
    this.resetPasswordToken=crypto.createHash('sha256').update(resetToken).digest('hex')
    this.resetPasswordExpire=Date.now()+10*60*1000

   return resetToken;

}

const User = mongoose.model('User',userSchema)

module.exports = User
// module.exports = mongoose.model('User', iccSchema);