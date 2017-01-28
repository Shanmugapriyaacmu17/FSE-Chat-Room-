var app = require('express')();
var http=require('http').Server(app);
var io=require('socket.io')(http);
var path=require('path');

var express=require('express');
var sql = require('mysql');
var connection = sql.createConnection({
	user: 'root',
    password: 'root',    
    server: 'localhost', 
    database: 'test',
    port: '3306'
});

//http.listen(3001, function(){
//	console.log('chatroom.js listening ****** :3001');
//});

connection.connect(function(err){
	  if(err){
	    console.log('Error connecting to Db');
	    return;
	  }
	  console.log('Connection established');
	});

app.set('views', './views');
app.set('view engine', 'jade');

app.get('/chatroom', function(req,res){
	console.log('reached chatroom.js');
	var express=require('express');
	
	console.log('chatroom.js load query');
	
	connection.query('select * from chathistory', function(errr,rows) {
		 if(errr) throw errr;
	console.log('obtained from db');
	
	console.log(rows);
	for (var i = 0; i < rows.length; i++) 
	{ 
		console.log(rows[i].name);
		console.log(rows[i].message);
		console.log(rows[i].time);
		console.log(rows[i].activity);
	};
	
	res.render('index', { title: 'Hey', message: 'Hello there!' });
    
	app.use(express.static(path.join(__dirname)));
	res.sendFile(path.join(__dirname, './', 'firstpage.html'));

});
    



	io.on('connection',function(socket){
	
		
		
	});
	
//	socket.on('chatmsg',function(from,msg){
//		io.emit('chatmsg',from, msg);
//		console.log('chatroom.js socket code');
//		
//		connection.query('select * from chathistory', function(errr,rows) {
//			 if(errr) throw errr;
//		console.log('inserted to db');
//		
//		console.log(rows);
//		for (var i = 0; i < rows.length; i++) 
//		{ 
//			console.log(rows[i].name);
//			console.log(rows[i].message);
//			console.log(rows[i].time);
//			console.log(rows[i].activity);
//		};
//			
//		});
//	});
	
	socket.on('typing',function(user){
		io.emit('typing',user);
	});
});


