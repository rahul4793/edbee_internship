//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://admin-rahul:rahul4793@cluster0.i2b3s.mongodb.net/imei",{useNewUrlParser:true});
const imeiSchema = {
    title:String,
    phone:String
};
const Imei = mongoose.model("Imei",imeiSchema); 
app.get("/",function(req,res){
    res.render("home");
});
app.post("/submit",function(req,res){
    const id = req.body.text12;
	function sumDig(id)
	{
		let a = 0;
		while (id > 0)
		{
			a = a + id % 10;
			id = parseInt(id / 10, 10);
		}
		return a;
	}
	function isValidIMEI(id)
	{
		let s = String(id);
		let len = s.length;

		if (len != 15)
			return false;

		let sum = 0;
		for(let i = len; i >= 1; i--)
		{
		let d = (id % 10);
		if (i % 2 == 0)
			d = 2 * d;
		sum += sumDig(d);
		id = parseInt(id / 10, 10);
		}

		return (sum % 10 == 0);
	}
	if (isValidIMEI(id))
    res.render("sucess");
		
        Imei.findOne({title:id},function(err,foundUsers){
            if(foundUsers){
                console.log("Valid IMEI Code and found in database");    
            }
        else 
    res.render("failed");
        })
});

app.get("/imeis",function(req,res){
    Imei.find(function(err,foundImeis){
        if(!err){
            res.send(foundImeis)
        }else{
            res.send(err);
        }
    });
});



app.post("/submitimei",function(req,res){
     const newimei = new Imei({
     title:req.body.text81
     });
     newimei.save();
     res.render("added");
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
