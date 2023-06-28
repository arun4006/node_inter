const ErrorResponse=require('../utils/ErrorResponse')

const errorHandler=(err,req,res,next)=>{
    //console.log(err);
    let error={ ...err }

    error.message=err.message;

    console.log(error);

    //Invalid ObjectId error
    if(err.name==='CastError'){
      const message=`Bootcamp data was not found ${err.value}`
      error=new ErrorResponse(message,404)
    }

    //duplicate error
    if(err.code==11000){
        const message=`Duplicate value has entered`
        error=new ErrorResponse(message,400)
    }

    //mongoose validation error
    if(err.name=='ValidationError'){
        const message=Object.values(err.errors).map(v=>v.message)
        error=new ErrorResponse(message,400)
    }

    res.status(error.statusCode || 500).json({
        success:false,
        error:error.message || "server error"
    })
}

module.exports= errorHandler