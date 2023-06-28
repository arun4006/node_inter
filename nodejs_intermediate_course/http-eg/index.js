const http=require('http')
const n=[{"id":1,"age":12}]
const server=http.createServer((req,res)=>{
    res.setHeader('Content-Type','application/json');
    //res.write('<h1>hello</h1>')
    res.end(JSON.stringify(n))
})

const port=5000;
server.listen(port,()=>{
    console.log("server starting at 5000");
})