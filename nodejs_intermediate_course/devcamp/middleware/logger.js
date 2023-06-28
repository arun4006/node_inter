const logger=(req,res,next)=>{
    console.log("middleware called");
    req.game="vicecity"
    next()
};

module.exports= logger;  