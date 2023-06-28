const mongoose = require("mongoose");
const dotenv=require('dotenv')
const fs = require("fs");
const Bootcamp = require("./models/bootcamp.model");
const req = require("express/lib/request");
const Course=require('./models/course.model')
const User=require('./models/user.model')
const Review=require('./models/review.model')
dotenv.config({ path: "./config/config.env" });

//connect to mongoDB
mongoose.Promise = global.Promise;

mongoose
  .connect(process.env.dbName, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((err) => {
    console.log("Could not connect to the database. Exiting now...", err);
    // process.exit();
  });

 //read json file
 const bootcamps=JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`,'utf-8'))
 const courses=JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`,'utf-8'))
 const users=JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`,'utf-8'))
 const reviews=JSON.parse(fs.readFileSync(`${__dirname}/_data/reviews.json`,'utf-8'))
 //console.log(bootcamps);
 
 //Import data
 const importData=async()=>{
     try{
       //await Bootcamp.create(bootcamps);
      //await Course.create(courses);
      //await User.create(users);
      await Review.create(reviews)
       console.log("Data inserted successfully..!");
     }
     catch(e)
     {
     console.log(e);
     }
 }

  //Delete data
  const deleteData=async()=>{
    try{
      await Bootcamp.deleteMany();
      await Course.deleteMany();
      await User.deleteMany();
      console.log("Data deleted successfully..!");
    }
    catch(e)
    {
    console.log(e);
    }
}

if(process.argv[2]==='-i')
{
    importData();
}
else if(process.argv[2]==='-d')
{
    deleteData();  
}

