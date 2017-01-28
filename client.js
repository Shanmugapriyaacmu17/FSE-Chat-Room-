var socket=io();

function submitfn(){
	var username=$('#username').val();
	var message=$('#message').val();
	if(message!=''){
		socket.emit('chatmsg', username, message);
    }
	$('#message').val('').focus();
	return false;
}

function disconnectfn(){
	var username=$('#username').val();
	socket.emit('disconnectmsg', username, 'User disconnected... ');
	window.open('','_self').close();
	return false;
}

function notifyUserConnectEvent(){
	alert('on load here...');
	var username=$('#username').val();
	var message=$('#message').val();
	if(message!=''){
		socket.emit('connected', username, 'User Connected...');
    }
	$('#message').val('').focus();
	return false;
}

function notifyTyping(){
	var user=$('#username').val();
	socket.emit('typing', user);
}

socket.on('chatmsg',function(username,message){
	var me=$('#username').val();
	var username=(username==me)?'Me': username;
	$('#messagelist').append('<li><b >'+username+'</b>:' + message+'<li>');
	});


socket.on('typing', function(user){
	var me=$('#username').val();
	if(user!=me){
		$('typing').text(user + 'is typing...');
	}
	setTimeout(function(){$('typing').text('');},10000);;
});

app.get('/', function(req,res){ 
	console.log('server.js app.get');
	var express=require('express');
	var sql = require('mysql');
	var connection = sql.createConnection({
    	user: 'root',
        password: 'database',    
        server: 'localhost', 
        database: 'chatappdb',
        port: '3306'
    });
});

connection.connect(function(err){
	  if(err){
	    console.log('Error connecting to Db');
	    return;
	  }
	  console.log('Connection established');
	});

connection.query('select * from chathistory', function(errr,rows) {
	 if(errr) throw errr;
console.log('connected to db');

console.log(rows);
for (var i = 0; i < rows.length; i++) { console.log(rows[i].name); };
});

connection.end();
  
