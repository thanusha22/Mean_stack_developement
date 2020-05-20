var express = require('express');  
var vcapServices = require('vcap_services');
var bodyParser = require('body-parser'); 
var ejs = require('ejs');
var MongoClient = require('mongodb').MongoClient;
var app = express();  
var urlencodedParser = bodyParser.urlencoded({ extended: false })
let url; 
var credentials = vcapServices.getCredentials('mlab'); 
url=credentials.uri; 
if (url==null)
url="mongodb://mongo/mynewdb"; 
// Connect to the db

MongoClient.connect(url, function (err, db) { 
 if(!err) {
    console.log("We are connected");
    

app.use(express.static('public')); //making public directory as static directory  
app.use(bodyParser.json());
/* app.get('/home', function (req, res) {  
   console.log("Got a GET request for the homepage");  
   res.send('<h1>Welcome to RIT</h1>');   
})

 app.get('/about', function (req, res) {  
   console.log("Got a GET request for /about");  
   res.send('Dept. of Computer Science & Engineering');
})  */
/*JS client side files has to be placed under a folder by name 'public' */

app.get('/index.html', function (req, res) {  
   res.sendFile( __dirname + "/" + "index.html" );    
})  

app.get('/insert.html', function (req, res) {
    res.sendFile( __dirname + "/" + "insert.html" );
})
/* to access the posted data from client using request body (POST) or request params(GET) */
//-----------------------POST METHOD-------------------------------------------------
app.post('/process_post', function (req, res) {
    /* Handling the AngularJS post request*/
    console.log(req.body);
	res.setHeader('Content-Type', 'text/html');
    // req.body.serverMessage = "NodeJS replying to angular"
        /*adding a new field to send it to the angular Client */
		console.log("Sent data are: Movie Name:"+req.body.moviename+", Actor Name:"+req.body.actorname+", Director Name:"+req.body.dirname+", Date of Release:"+req.body.date+", Genre:"+req.body.genre+", Rating:"+req.body.rating);
		// Submit to the DB
  	var moviename = req.body.moviename;
    var actorname = req.body.actorname;
    var dirname=req.body.dirname;
var date=req.body.date;
var genre=req.body.genre;
var rating=req.body.rating;
	//To avoid duplicate entries in MongoDB
	db.collection('movie').createIndex({"moviename":1},{unique:true});
	/*response has to be in the form of a JSON*/
	db.collection('movie').insertOne({moviename:moviename,actorname:actorname,dirname:dirname,date:date,genre:genre,rating:rating}, (err, result) => {                       
                    if(err) 
					{ 
						console.log(err.message); 
						res.send("Duplicate Movie Name")
					} 
					else
					{
                    console.log('Movie Inserted');
					/*Sending the respone back to the angular Client */
					res.end("Movie Inserted");
					}
                })      
	
    });
//--------------------------GET METHOD-------------------------------
/* app.get('/process_get', function (req, res) { 
// Submit to the DB
  var newcomp = req.query;
	var compid = req.query['compid'];
    var compname = req.query['compname'];
var compsize = req.query['compsize'];
var compcolor = req.query['compcolor'];
var compram = req.query['compram'];
var compcost = req.query['compcost'];
	db.collection('computer').createIndex({"compid":1},{unique:true});
	db.collection('computer').insertOne({compid:compid,compname:compname,compcolor:compcolor,compram:compram,compsize:compsize,compcost:compcost}, (err, result) => {                       
                    if(err) 
					{ 
						console.log(err.message); 
						res.send("Duplicate Computer ID")
					} 
					else
					{
                    console.log("Sent data are (GET): Computer ID:"+compid+", Computer Name:"+compname+", Computer Color:"+compcolor+", RAM:"+compram+", Screen Size:"+compsize+", Cost:"+compcost);
					Sending the respone back to the angular Client 
					res.end("Computer Inserted-->"+JSON.stringify(newcomp));
					}
                })      
}) */

//--------------UPDATE------------------------------------------
app.get('/update.html', function (req, res) {
    res.sendFile( __dirname + "/" + "update.html" );
})

app.get("/update", function(req, res) {
	var moviename1=req.query.moviename;
var actorname1=req.query.actorname;
var dirname1=req.query.dirname;
var date1=req.query.date;
var genre1=req.query.genre;
var rating1=req.query.rating;
var review1=req.query.review;
    db.collection('movie', function (err, data) {
        data.update({"moviename":moviename1},{$set:{"actorname":actorname1,"dirname":dirname1,"date":date1,"genre":genre1,"rating":rating1,"review":review1}},{multi:true},
            function(err, obj){
				if (err) {
					console.log("Failed to update data");
			} else {
				if(obj.result.n==0) {
				res.send("No Movie Found"); }
				if (obj.result.n==1)
				{
				res.send("Movie Updated");
				console.log("Movie Updated")
				} }
			
        });
    });
});
//--------------SEARCH------------------------------------------
app.get('/search.html', function (req, res) {  
   res.sendFile( __dirname + "/" + "search.html" );    
})

app.get("/search", function(req, res) {
	//var empidnum=parseInt(req.query.empid)  // if empid is an integer  
	var moviefield1=req.query.moviefield;
	var movievalue1=req.query.movievalue;
if (moviefield1=="MovieName") {
    db.collection('movie').find({moviename: movievalue1},{"_id":0}).toArray(function(err, docs) {
    if (err) {
      console.log(err.message+ "Failed to get data");
    }
 
else {    
		      res.status(200).json(docs);
	  
    }
  }); }
if (moviefield1=="ActorName") {
    db.collection('movie').find({actorname: movievalue1},{"_id":0}).toArray(function(err, docs) {
    if (err) {
      console.log(err.message+ "Failed to get data");
    } else {    
		     res.status(200).json(docs);
	  
    }
  }); }
if (moviefield1=="DirName") {
    db.collection('movie').find({dirname: movievalue1},{"_id":0}).toArray(function(err, docs) {
    if (err) {
      console.log(err.message+ "Failed to get data");
    } else {    
		     res.status(200).json(docs);
	  
    }
  }); }
if (moviefield1=="RelDate") {
    db.collection('movie').find({date: movievalue1},{"_id":0}).toArray(function(err, docs) {
    if (err) {
      console.log(err.message+ "Failed to get data");
    } else {    
		     res.status(200).json(docs);
	  
    }
  }); }
if (moviefield1=="Genre") {
    db.collection('movie').find({genre: movievalue1},{"_id":0}).toArray(function(err, docs) {
    if (err) {
      console.log(err.message+ "Failed to get data");
    } else {    
		     res.status(200).json(docs);
	  
    }
  }); }
if (moviefield1=="Rating") {
    db.collection('movie').find({rating: movievalue1},{"_id":0}).toArray(function(err, docs) {
    if (err) {
      console.log(err.message+ "Failed to get data");
    } else {    
		     res.status(200).json(docs);
	  
    }
  }); }

  });
  // --------------To find "Single Document"-------------------
	/*var empidnum=parseInt(req.query.empid)
    db.collection('employee').find({'empid':empidnum}).nextObject(function(err, doc) {
    if (err) {
      console.log(err.message+ "Failed to get data");
    } else {
      res.status(200).json(doc);
    }
  })
}); */

//--------------DELETE------------------------------------------
app.get('/delete.html', function (req, res) {  
   res.sendFile( __dirname + "/" + "delete.html" );    
})

app.get("/delete", function(req, res) {
	//var empidnum=parseInt(req.query.empid)  // if empid is an integer
	var moviename1=req.query.moviename;
	db.collection('movie', function (err, data) {
        data.remove({"moviename":moviename1},function(err, obj){
				if (err) {
					console.log("Failed to remove data");
			} else {
				if(obj.result.n==0) {
				res.send("No Movie Found"); }
				if (obj.result.n>=1)
				{
				res.send("Movie Deleted");
				console.log("Movie Deleted");
				} }
        });
    });
    
  });
  

//-------------------DISPLAY-----------------------
app.get('/display', function (req, res) { 
//-----IN JSON FORMAT  -------------------------
/*db.collection('employee').find({}).toArray(function(err, docs) {
    if (err) {
      console.log("Failed to get data.");
    } else 
	{
		res.status(200).json(docs);
    }
  });*/
//------------- USING EMBEDDED JS -----------
 db.collection('movie').find().sort({moviename:1}).toArray(
 		function(err , i){
        if (err) return console.log(err)
        res.render('disp.ejs',{movies: i});  
     })
//---------------------// sort({empid:-1}) for descending order -----------//
}) 


var server = app.listen(5000, function () {  
var host = server.address().address  
  var port = server.address().port  
console.log("MEAN Stack app listening at http://%s:%s", host, port)  
})  
}
else
{   console.log("Db connection failed!");  }
  
});
