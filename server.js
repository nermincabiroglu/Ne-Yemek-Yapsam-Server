const express=require("express")
const tarifler=require("./tarifler.json")
const path=require("path")
const { json } = require("express")
const ejs = require('ejs');
const file=require("fs")


var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer()


const app=express()


const apikey="982523"


app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array()); 
app.use(express.static('public'));


app.engine('.ejs', ejs.__express);

app.get("/add/apikey=:id",(req,res)=>{
    if(req.params.id!=apikey){
        res.status(404).json({"Authentication Failed! Please Please Verification Api Key":404})
    }
    res.render("form.ejs")
})

app.post("/add",(req,res)=>{
    
    //console.log(req.body.jsonData)
    jsonResp=req.body.jsonData

    tarifler.tarifler.push(JSON.parse(jsonResp))
    //console.log(tarifler)
    file.writeFileSync("tarifler.json",JSON.stringify(tarifler))
    
    res.json("Successful")
})

app.get("/search/:series/apikey=:id",(req,res)=>{

    if(req.params.id!=apikey){
        res.status(404).json({"Authentication Failed! Please Please Verification Api Key":404})
    }



    var counter=0
    var yemekler=[]
    var series=req.params.series
    var splitedSeries=series.split(",")
    var bool=true
    
    tarifler.tarifler.forEach(element1 => {
        bool=true
        splitedSeries.forEach(element2 => {
        
          bool=bool&&(element1.arama.toLowerCase().includes(element2.toLowerCase()))
                
        
        });
        if(bool==true){
            yemekler.push(element1)
            counter++;
        }
    });

    res.contentType('application/json');
    
    res.send(JSON.stringify({sonucSayısı:counter,yemekler},null,1))
   
});


app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname+"/index.html"))
})


app.use((req,res,next)=>{
    res.status(404).json({"Authentication Failed! Please Please Verification Api Key":404})
})

app.listen(process.env.PORT || 3000, 
	() => console.log("Server is running..."));