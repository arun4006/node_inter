const Review = require("../models/review.model");
const Bootcamp = require("../models/bootcamp.model");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

//get all  reviews based on bootcamp id
exports.getReviews = asyncHandler(async (req, res, next) => {
    if (req.params.bootcampId) {
      const reviews = await Review.find({ bootcamp: req.params.bootcampId });
  
      return res.status(200).json({
        success: true,
        count: reviews.length,
        data: reviews
      });
    } else {
        let query;
   
        const reqQuery={...req.query}
     
        const removeFields=['select','sort']
     
        removeFields.forEach(params=> delete reqQuery[params])
     
        //console.log(reqQuery);
     
        let queryStr=JSON.stringify(reqQuery)
        
        queryStr=queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,match=>`$${match}`)
     
        query= Review.find(JSON.parse(queryStr));
        //console.log(query);
        //query= User.find(JSON.parse(queryStr)).populate('courses');
     
        //select
        if(req.query.select){
         const fields=req.query.select.split(',').join(' ')
         query=query.select(fields)
       }
     
       //sort
       if(req.query.sort){
         const sortBy=req.query.sort.split(',').join(' ')
         query=query.sort(sortBy)
       }
       // else{
       //   query=query.sort('-createdAt')
       // }
     
       //pagination
       const page=parseInt(req.query.page,10) || 1;
       const limit=parseInt(req.query.limit,10) || 1;
       const startIndex=(page-1) * limit;
       const endIndex=(page) * limit;
       const total=await Review.countDocuments()
     
       //query
       query=query.skip(startIndex).limit(limit)
     
       //pagination result
       const pagination={}
     
       if(endIndex < total){
        pagination.next={
          page:page+1,
          limit
        }
       }
     
       if(startIndex > 0){
         pagination.prev={
           page:page-1,
           limit
         }
        }
        
        //console.log(req.query);
        //console.log(queryStr);
         const reviews = await query;
         res.json({ success: true, count:reviews.length,pagination,data: reviews });
       
    }
  });

//get reviews by bootcamp id 
exports.getReviewsbyBootcamp = asyncHandler(async (req, res, next) => {
    if (req.params.bootcampId) {
      const reviews = await Review.find({ bootcamp: req.params.bootcampId });
  
      return res.status(200).json({
        success: true,
        count: reviews.length,
        data: reviews
      });
    } else {
      res.status(200).json(res.advancedResults);
    }
  });


  // get single review by  id
  exports.getSingleReviews = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id).populate({
        path: "bootcamp",
        select: "name description"
      });
    
      if (!review) {
        return next(
          new ErrorResponse(`No review found with the id of ${req.params.id}`, 404)
        );
      }
    
      res.status(200).json({
        success: true,
        data: review
      });
})

//create review using bootcamp id by user
exports.addReview = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;
  
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  
    if (!bootcamp) {
      return next(
        new ErrorResponse(
          `No bootcamp with the id of ${req.params.bootcampId}`,
          404
        )
      );
    }
  
    const review = await Review.create(req.body);
  
    res.status(201).json({
      success: true,
      data: review
    });
  });

  // update review by review user using with review id
  exports.updateReviewbyUser = asyncHandler(async (req, res, next) => {
    let review = await Review.findById(req.params.reviewId);
  
    if (!review) {
      return next(
        new ErrorResponse(`No review with the id of ${req.params.reviewId}`, 404)
      );
    }
  
    // Make sure review belongs to user or user is admin
    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
      return next(new ErrorResponse(`Not authorized to update review..you are not write this review`, 401));
    }
  
    review = await Review.findByIdAndUpdate(req.params.reviewId, req.body, {
      new: true,
      runValidators: true
    });
  
    await review.save();
  
    res.status(200).json({
      success: true,
      data: review
    });
  });
  
// delete review by review user using with review id
  exports.deleteReviewbyUser = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.reviewId);
  
    if (!review) {
      return next(
        new ErrorResponse(`No review with the id of ${req.params.reviewId}`, 404)
      );
    }
  
    // Make sure review belongs to user or user is admin
    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
        return next(new ErrorResponse(`Not authorized to update review..you are not write this review`, 401));
    }
  
    await review.remove();
  
    res.status(200).json({
      success: true,
      data: {}
    });
  });