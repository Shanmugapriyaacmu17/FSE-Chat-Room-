var app = require('express')();
var http=require('http').Server(app);
var io=require('socket.io')(http);
var path=require('path');

app.set('views', './views');
app.set('view engine', 'jade');

var sql = require('mysql');
var connection = sql.createConnection({
	user: 'root',
    password: 'database',    
    server: 'localhost', 
    database: 'chatappdb',
    port: '3306'
});

connection.connect(function(err){
	  if(err){
	    console.log('Error connecting to Db');
	    return;
	  }
	  console.log('Connection established');
	});

app.get('/', function(req,res){
	
	var express=require('express');
    
	app.use(express.static(path.join(__dirname)));
	res.sendFile(path.join(__dirname, './', 'firstpage.html'));

});

app.get('/chatroom', function(req,res){
	
	var express=require('express');	
	connection.query('select * from chathistory order by time asc', function(errr,rows) {
		 if(errr) throw errr;
	
	
	console.log(rows);
	var messages=[];
	for (var i = 0; i < rows.length; i++) 
	{ 
		console.log(rows[i].name);
		console.log(rows[i].message);
		console.log(rows[i].time);
		console.log(rows[i].activity);

		var message=rows[i].name+'('+rows[i].time+')'+':'+rows[i].message;
		
		messages.push(message);
	};
	
	res.render('chatroomlayout', { username: req.query.username,messages:messages});
    
	app.use(express.static(path.join(__dirname)));
	res.sendFile(path.join(__dirname, './', 'firstpage.html'));

});


	io.on('connection',function(socket){
	
		socket.on('chatmsg',function(from,msg){
			io.emit('chatmsg',from, msg);
			
			connection.query('insert into chathistory (name, message, time, activity) VALUES (\''+req.query.username+'\',\''+msg+'\',CURRENT_TIMESTAMP, \'TEXT\');', function(errr,rows) {
				 if(errr) throw errr;
			console.log('inserted to db '+msg);
				
			});
		});
		
		socket.on('disconnectmsg',function(from,msg){
//			io.emit('chatmsg',from, msg);
			
			connection.query('insert into chathistory (name, message, time, activity) VALUES (\''+req.query.username+'\',\''+msg+'\',CURRENT_TIMESTAMP, \'DISCONNECTED\');', function(errr,rows) {
				 if(errr) throw errr;
			console.log('inserted to db '+ msg);
				
			});
		});
	});
});
    

http.listen(3000, function(){
	console.log('listening ****** :3000');
});

io.on('connection',function(socket){
	
	socket.on('typing',function(user){
		io.emit('typing',user);
	});
});


