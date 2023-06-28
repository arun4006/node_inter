const express=require('express')
const router=express.Router()
const reviewData=require('../controllers/review.controller')
const {protect,authorize}=require('../middleware/auth')

// get all reviews 
router.get('/api/v1/auth/reviews',reviewData.getReviews)

// get  reviews by bootcamp id
router.get('/api/v1/auth/reviews/bootcamp/:bootcampId',reviewData.getReviewsbyBootcamp)


// get single review by review id
router.get('/api/v1/auth/reviews/:id',reviewData.getSingleReviews)

// create review using with bootcamp id
router.post('/api/v1/auth/reviews/:bootcampId',protect,authorize('user'),reviewData.addReview)

// update review by review user using with review id
router.put('/api/v1/auth/update-review/:reviewId',protect,authorize('user'),reviewData.updateReviewbyUser)

// delete review by review user using with review id
router.delete('/api/v1/auth/delete-review/:reviewId',protect,authorize('user'),reviewData.deleteReviewbyUser)

module.exports= router 