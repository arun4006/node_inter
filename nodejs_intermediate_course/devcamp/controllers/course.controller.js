const Course = require("../models/course.model");
const ErrorResponse=require('../utils/ErrorResponse')
const asyncHandler=require('../middleware/async');
const Bootcamp = require("../models/bootcamp.model");
const { findByIdAndUpdate } = require("../models/bootcamp.model");

//
exports.getCourses = asyncHandler(async (req, res, next) => {
  
  let query;
  
  if(req.params.bootcampId){
      query=Course.find({ bootcamp:req.params.bootcampId })
  } else{
      query=Course.find()
  }

  const courses=await query;
  res.status(200).json({
      success:true,
      count:courses.length,
      data:courses        
})

})    


exports.getCoursesbyId= asyncHandler(async (req, res, next) => {
    if(req.params.bootcampId){
        query=Course.find({ bootcamp:req.params.bootcampId })
    } else{
        query=Course.find()
    }
  
    const courses=await query;
    res.status(200).json({
        success:true,
        count:courses.length,
        data:courses
  })
})    


// create course by bootcamp id 

exports.addCoursesbyId= asyncHandler(async (req, res, next) => {
    req.body.bootcamp=req.params.bootcampId
    req.body.user=req.user.id

    const bootcamp=await Bootcamp.findById(req.params.bootcampId)

    if(!bootcamp){
        return next(
            new ErrorResponse(`no bootcamp with the id of ${req.params.bootcampId}`),
            404
        )
    }
     
    //check you are owner of the bootcamp
   if(bootcamp.user.toString() !== req.user.id) {
    return next(new ErrorResponse(` ${req.user.id} is not owner of this bootcamp.. Can't create course using this bootcamp `,401))
  }
    const course=await Course.create(req.body)

    res.status(200).json({
        success:true,
        data:course
  })
})   

//update course by course id
exports.updateCoursesbyId= asyncHandler(async (req, res, next) => {

    let courses=await Course.findById(req.params.courseId)

    if(!courses){
        return next(
            new ErrorResponse(`no courses with the id of ${req.params.courseId}`),
            404
        )
    }

    //check you are owner of the course
   if(courses.user.toString() !== req.user.id) {
    return next(new ErrorResponse(` ${req.user.id} is not owner of this course. Can't update course`,401))
  }

    courses=await Course.findByIdAndUpdate(req.params.courseId,req.body,{
        new:true,runValidators:true
    })
    
    res.status(200).json({
        success:true,
        data:courses

    })
})

//delete course by course id
exports.deleteCoursesbyId= asyncHandler(async (req, res, next) => {

    let courses=await Course.findById(req.params.courseId)

    if(!courses){
        return next(
            new ErrorResponse(`no courses with the id of ${req.params.courseId}`),
            404
        )
    }
    
     //check you are owner of the course
   if(courses.user.toString() !== req.user.id) {
    return next(new ErrorResponse(` ${req.user.id} is not owner of this course. Can't delete course`,401))
  }

    await courses.remove()
    
    res.status(200).json({
        success:true

    })
})
   
