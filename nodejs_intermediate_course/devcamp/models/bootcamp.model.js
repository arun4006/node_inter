const mongoose = require('mongoose')
const validator = require('validator')
const slugify=require('slugify')
const geocoder=require('../utils/geocoder')
const User=require('../models/user.model')
//const jwt = require('jsonwebtoken')


const BootcampSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    Website:{
        type:String,
        match:[/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,'please add valid  http url']
    },
    phone:{
        type:String
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
    address: {
        type: String,
        required:true
    },
    location: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'] // 'location.type' must be 'Point'
         // required: true
        },
        coordinates: {
          type: [Number],
          //required: true,
          index:'2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String
    },
    careers:{
        type:[String],
        required:true,
        enum:["Web Development", "UI/UX", "Business", "Mobile Development","Data Science"]
   },
   averageRating:{
     type:Number,
     min:1,
     max:10  
   },
   averageCost:Number,
   photo:{
       type:String,
       default:'no-photo.jpg'
   },
   housing:{
       type:Boolean,
       default:false
   },
   averagecost:{
    type:Number
   },
   jobAssistance:{
       type:Boolean,
       default:false
   },
   jobGuarantee:{
       type:Boolean,
       default:false
   },
   acceptGi:{
    type:Boolean,
    default:false 
   },
   user:{
    type:mongoose.Schema.ObjectId,
    ref:'User',
    required:true
   },
   createdAt:{
       type:Date,
       default:Date.now
   }
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})


//



//reverse populate with virtuals
BootcampSchema.virtual('courses',{
    ref:'Course',
    localField:'_id',
    foreignField:'bootcamp',
    justOne:false
})

//
BootcampSchema.pre('remove',async function(next){
  
})    

BootcampSchema.pre('save',async function(next){
     const loc=await geocoder.geocode(this.address)
     console.log(loc);
     this.location={
         type:'Point',
         coordinates:[loc[0].longitude,loc[0].latitude],
         formattedAddress:loc[0].formattedAddress,
         street:loc[0].streetName,
         city:loc[0].city,
         state:loc[0].stateCode,
         zipcode:loc[0].zipcode,
         country:loc[0].countryCode,
     };
     this.address=undefined
     next();
     })

const Bootcamp = mongoose.model('Bootcamp', BootcampSchema)

module.exports = Bootcamp
// module.exports = mongoose.model('User', iccSchema);