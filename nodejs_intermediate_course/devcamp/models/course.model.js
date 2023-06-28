const mongoose = require('mongoose')
const validator = require('validator')
const slugify=require('slugify')
const geocoder=require('../utils/geocoder')
//const jwt = require('jsonwebtoken')


const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    weeks:{
        type:String,
        required:true
    },
    tuition:{
        type:Number,
        required:true
    }, 
    minimumSkill:{
        type:String,
        required:true,
        enum:['beginner', 'intermediate', 'advanced']
   },
   scholarhipsAvailable:{
     type:Boolean,
     default:false  
   },
   createdAt:{
       type:Date,
       default:Date.now
   },
   bootcamp:{
       type:mongoose.Schema.ObjectId,
       ref:'Bootcamp',
       required:true
   },
   user:{
    type:mongoose.Schema.ObjectId,
    ref:'User',
    required:true
  }
})




const Course = mongoose.model('Course', courseSchema)

module.exports = Course
// module.exports = mongoose.model('User', iccSchema);