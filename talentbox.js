var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var cors=require('cors');
var MongoClient=require('mongodb').MongoClient;
var jwt=require('jsonwebtoken')
var url=process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/";  

app.set('views','./views');
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

var db;
MongoClient.connect(url,async (err,con)=>{
    if(err){console.log(err)}
    else{
   db=con.db('talent');
   var p=await db.collection('test').findOne({courseName:'Complete Java'})
   var c=[
    {courseName:'Complete Java',pic:'https://www.google.com/url?sa=i&url=https%3A%2F%2Fdev.java%2F&psig=AOvVaw2C-XftxPM13sJoEx2uP_mI&ust=1690609069896000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCIjow9rXsIADFQAAAAAdAAAAABAE'},
    {courseName:'SQl-Begineers Guide',pic:'https://seeklogo.com/images/A/azure-sql-managed-instance-logo-D33A77DD5E-seeklogo.com.png'},
    {courseName:'Learn MongoDB from scratch',pic:'https://w7.pngwing.com/pngs/956/695/png-transparent-mongodb-original-wordmark-logo-icon-thumbnail.png'},
    {courseName:'Backend development',pic:'https://cdn-icons-png.flaticon.com/512/8010/8010472.png'},
    {courseName:'Data Visualization',pic:'https://w7.pngwing.com/pngs/997/670/png-transparent-data-analysis-analytics-data-visualization-information-business-people-business-data-thumbnail.png'}
]
if(p==null)
{
    db.collection('test').insertOne({courses:c}).then((data)=>{console.log(data)}).catch(err=>console.log(err))
}
 
    }
})
app.post('/insertGoogleData',async(req,res)=>{
    console.log(req.body.email)
    db.collection('box').findOne({email:req.body.email})
    .then(async(data)=>{
        var token=jwt.sign(req.body.name,'Vishnu')
        if(data==null)
        {
            var p=await db.collection('box').insertOne({email:req.body.email});
            console.log(p)
            res.send({message:'success',token,name:req.body.name})
        }
        else
        {
console.log(data)
console.log(req.body.name)
res.send({message:'success',token,name:req.body.name})

        }
    })
      
})
app.post('/signup',async(req,res)=>{
    var k=await db.collection('box').findOne({email:req.body.email});
    console.log(k)
    
   if(k!=null)
   {
    
        res.send({message:'repetition'});
   }
    else
    {
        var l=await db.collection('box').insertOne(req.body);
        console.log(l)
        var token=jwt.sign(req.body.name,"Vishnu")
        res.send({message:'success',token,name:req.body.name})
       
    }
})
  app.put('/login',async(req,res)=>{
    var w=await db.collection('box').findOne({email:req.body.email})
    if(w==null)
    {
        res.send({message:'unknown'})
    }
    else
    {
        if(w.password===req.body.password)
        {
            var token=jwt.sign(w.name,"Vishnu")
            res.send({message:'success',token,name:w.name})
        }
        else
        {
            res.send({message:'wrong'})
        }
    }
  })     
 
  app.get('/fetchCourse',async(req,res)=>{
    db.collection('test').find({}).toArray().then((data)=>{
       
        res.send(data)
    })
    .catch(err=>console.log(err))



  })
  app.get('/auth/:token',(req,res)=>{ var tken=req.params.token;
    console.log(tken);
    var ds=jwt.verify(req.params.token,'Vishnu');
    console.log(ds)
    res.send({message:'approved',data:ds});
  })
const port=process.env.PORT || 2100;
app.listen(port,()=>{console.log('server runnning on 2100')})