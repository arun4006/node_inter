const Bootcamp = require("../models/bootcamp.model");
const ErrorResponse=require('../utils/ErrorResponse')
const asyncHandler=require('../middleware/async')
const geocoder=require('../utils/geocoder')

//get all data
exports.getAllData = asyncHandler(async (req, res, next) => {
   let query;
   
   const reqQuery={...req.query}

   const removeFields=['select','sort']

   removeFields.forEach(params=> delete reqQuery[params])

   //console.log(reqQuery);

   let queryStr=JSON.stringify(reqQuery)

  
   
   queryStr=queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,match=>`$${match}`)

   //console.log(queryStr);
   //query= Bootcamp.find(JSON.parse(queryStr));
   query= Bootcamp.find(JSON.parse(queryStr)).populate('courses');
   

   //select
   if(req.query.select){
    const fields=req.query.select.split(',').join(' ')
    query=query.select(fields)
   // console.log(query);
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
  console.log(startIndex);
  const endIndex=(page) * limit;
  console.log(endIndex);
  const total=await Bootcamp.countDocuments()
  

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
    const bootcamp = await query;
    res.json({ success: true, count:bootcamp.length,pagination,data: bootcamp });
  
});

//get data by Id
exports.getDataById = asyncHandler(async (req, res,next) => {
  
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      return next(new ErrorResponse(`data not found from this  ${req.params.id}`,404))
    }
    res.json({ sucess: true, data: bootcamp });
  
  //res.json({success:true,msg:`get data from ${req.params.id}`})
});

//create bootcamp data
exports.sendData = asyncHandler(async (req, res,next) => {
    
      req.body.user=req.user.id;

      const publishedBootcamp=await Bootcamp.findOne({user:req.user.id})
      
      //If the user is not an publisher,they can add one bootcamp only
      if(publishedBootcamp && req.user.role!=='publisher'){
        return next(new ErrorResponse(`The user with ID  ${req.user.id} has already published a bootcamp`,400))
      }
    
      const bootcamp = await Bootcamp.create(req.body);
    //res.send(req.body);
    res.status(201).json({ success: true, data: bootcamp });
    
    
});

//update data
exports.updateDataById = asyncHandler(async (req, res,next) => {
  
    let bootcamp = await Bootcamp.findById(req.params.id);
    //console.log(bootcamp.user.toString());
    if (!bootcamp) {
        return next(new ErrorResponse(`data not found from this  ${req.params.id}`,404))
    }
   //console.log(req.user.id);
   
    //check you are owner of the bootcamp
    if(bootcamp.user.toString() !== req.user.id) {
      return next(new ErrorResponse(`can't update .. ${req.params.id} is not owner of this bootcamp`,401))
    }
    
    
    bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json({ sucess: true, data: bootcamp });
 
  //res.json({success:true,msg:`update data to ${req.params.id}`})
});

//delete by id
exports.deleteDataById = asyncHandler(async (req, res,next) => {
        
  let bootcamp = await Bootcamp.findById(req.params.id);
  //console.log(bootcamp.user.toString());
  if (!bootcamp) {
      return next(new ErrorResponse(`data not found from this  ${req.params.id}`,404))
  }
 //console.log(req.user.id);

  //check you are owner of the bootcamp
  if(bootcamp.user.toString() !== req.user.id) {
    return next(new ErrorResponse(`can't delete .. ${req.params.id} is not owner of this bootcamp`,401))
  }
  bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
        
  res.json({ sucess: true, data: {} });
      
});

//get bootcamps  with in the radius
exports.getBootcamps = asyncHandler(async (req, res,next) => {
 
  const {zipcode,distance}=req.params;

  //get longitude,lattitude
  const loc=await geocoder.geocode(zipcode)
  const longi=loc[0].longitude;
  const latti=loc[0].latitude;

  //calculate radius using radians
  //divide distance by radius of earth
  //earth radius=3,693 miles or 6,378 km

  const radius=distance/3693
 
  const bootcamps=await Bootcamp.find({
    location:{ $geoWithin: { $centerSphere: [ [ longi, latti ], radius ] } }
  })

  res.status(200).json({
    success:true,
    count:bootcamps.length,
    data:bootcamps
  })

});

