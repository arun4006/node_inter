const User = require("../models/user.model");
const ErrorResponse=require('../utils/ErrorResponse')
const asyncHandler=require('../middleware/async')

//get all users by admin
exports.getAllUsers=asyncHandler(async (req, res, next) => {
    let query;
   
    const reqQuery={...req.query}
 
    const removeFields=['select','sort']
 
    removeFields.forEach(params=> delete reqQuery[params])
 
    //console.log(reqQuery);
 
    let queryStr=JSON.stringify(reqQuery)
    
    queryStr=queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,match=>`$${match}`)
 
    query= User.find(JSON.parse(queryStr));
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
   const total=await User.countDocuments()
 
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
     const users = await query;
     res.json({ success: true, count:users.length,pagination,data: users });
   
})    

// get user by admin using user id
exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.userId);
  
    res.status(200).json({
      success: true,
      data: user
    });
  });

//create user by admin
exports.createUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body);

    res.status(201).json({
      success: true,
      data: user
    });
})

//update user by admin
exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
      new: true,
      runValidators: true
    });
  
    res.status(200).json({
      success: true,
      data: user
    });
  });

  //delete user by admin
  exports.deleteUser = asyncHandler(async (req, res, next) => {
    await User.findByIdAndDelete(req.params.userId);
  
    res.status(200).json({
      success: true,
      data: {}
    });
  });