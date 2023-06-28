const express=require('express')
const router=express.Router()
const courseData=require('../controllers/course.controller')
const {protect}=require('../middleware/auth')

//router.get('/api/v1/courses',courseData.getCourses) 

//get course by bootcamp id
router.get('/api/v1/courses/:bootcampId',courseData.getCoursesbyId) 

//add course by bootcamp id
router.post('/api/v1/create-courses/:bootcampId',protect,courseData.addCoursesbyId) 

//update course by course id
router.put('/api/v1/update-courses/:courseId',protect,courseData.updateCoursesbyId) 

//delete course by course id
router.delete('/api/v1/delete-courses/:courseId',protect,courseData.deleteCoursesbyId) 




module.exports= router 