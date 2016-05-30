'use strict';

var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server).of('/game');
var path = require('path');
var allClients = [];
var ip_server;
var feedbackPlayers = []; //results of the last game
var scoreGame = []; //current result of the game

require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  //console.log('addr: '+add);
  ip_server = add
})

app.use('/node_modules', express.static(__dirname + '/node_modules/'));
app.use('/public', express.static(__dirname + '/public/'));

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname+'/views/index.html'));
});

var routerApi = express.Router();

// middleware to use for all requests
routerApi.use(function(req, res, next) {
  // do logging
  console.log('Something is happening in routerApi.');
  next();
});

routerApi.post('/logout', function(req, res){

});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
routerApi.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' }); 
});

routerApi.get('/ip', function(req, res) {
  res.json({ ip: ip_server }); 
});

routerApi.get('/results', function(req, res) {
  console.log('results');
  console.log(scoreGame);
  res.json({ results: scoreGame }); 
});

// On renvoie un nombre aléatoire entre une valeur min (incluse) 
// et une valeur max (incluse)
function getRandomArbitrary(min, max) {
	return Math.floor((Math.random() * max) + min);
}

function calculateScoreButtons(){
  scoreGame = [];
  for(var i=0; i<feedbackPlayers.length-1;i++){
    for(var j=i+1; j<feedbackPlayers.length; j++){
      if(feedbackPlayers[i].score<feedbackPlayers[j]){
        var temp = feedbackPlayers[i];
        feedbackPlayers[i]=feedbackPlayers[j];
        feedbackPlayers[j]=temp;
      }
    }
  }
  console.log(feedbackPlayers);
  feedbackPlayers.forEach(function name(element, index, array){
    if(index==0){
      var item = {
        name: element.name,
        score: 0
      }
      scoreGame.push(item);
    }
    else if(index==1){
      var item = {
        name: element.name,
        score: 1
      }
      scoreGame.push(item);
    }
    else if(index==2){
      var item = {
        name: element.name,
        score: 2
      }
      scoreGame.push(item);
    }
    else{
      var item = {
        name: element.name,
        score: 3
      }
      scoreGame.push(item);
    }
  });
}

function calculateScoreYoutube(){
  scoreGame=[];
}

app.use('/api', routerApi);

io.on('connection', function(socket){
  console.log("client connected to the server !");
  //user send his username
  socket.on('user', function(name){
    console.log(name+' connected to the game !');
    var item = {
      'socket': socket,
      'name': name,
      'img': ""
    };
    var alreadyConnected = false;
    if(!alreadyConnected){
    	var rand = getRandomArbitrary(1, 4);
    	console.log(rand);
    	switch(rand){
    		case 1: item.img = "public/img/kratos.png";
    				break;
    		case 2: item.img = "public/img/goku.png";
    				break;
    		case 3: item.img = "public/img/crash.png";
    				break;
    		case 4: item.img = "public/img/drake.png";
    				break;
    	}
      allClients.push(item);
      socket.broadcast.emit('join', name, item.img);
      socket.emit('join', name, item.img);
    }
    else{

    }
    //socket.broadcast.emit('otherJoin', allClients.length);
  });

  socket.on('start', function(){
    console.log('start');
    socket.broadcast.emit('startGame');
    feedbackPlayers = [];
    function chrono(seconds){
    	setTimeout(function(){ 
    		if(seconds>=0){
    			console.log(seconds);
    			socket.emit('chrono', seconds);
    			chrono(seconds-1);
    		}
        else{
          //socket.broadcast.emit('startButtons');
          socket.broadcast.emit('startYoutube');
        }
    	}, 1000);
    }
    console.log("chrono lancé !");
    chrono(30); 
  });

  socket.on('endButtons', function(score){
    console.log("endButtons");
    allClients.some(function name(element, index, array){
      if(element.socket==socket){
        var item = {
          socket: element.socket,
          name: element.name,
          img: element.img,
          game: 'buttons',
          score: score
        };
        feedbackPlayers.push(item);
        console.log(feedbackPlayers);
        return true;
      }
    });
    if(feedbackPlayers.length==allClients.length){
      console.log("synchro !");
      calculateScoreButtons();
      socket.broadcast.emit('stopButtons');
      socket.emit('stopButtons');
    }
  });

  socket.on('endYoutube', function(score){
    console.log("endYoutube");
    allClients.some(function name(element, index, array){
      if(element.socket==socket){
        var item = {
          socket: element.socket,
          name: element.name,
          img: element.img,
          game: 'youtube',
          score: score
        };
        feedbackPlayers.push(item);
        console.log(feedbackPlayers);
        return true;
      }
    });
    if(feedbackPlayers.length==allClients.length){
      console.log("synchro !");
      calculateScoreYoutube();
      socket.broadcast.emit('stopYoutube');
      socket.emit('stopYoutube');
    }
  });

  socket.on('reset', function(){
    socket.broadcast.emit('reset');
  });

  socket.on('admin', function(){
    console.log('ADMIN connected to the game !');
    var connected = true;
    socket.emit('joinadmin', 'ADMIN connected to the game !');
  });

  socket.on('disconnect', function(){
      var id;
      allClients.some(function name(element, index, array){
        if(element.socket==socket){
        	console.log(element.name);
          allClients.splice(index, 1);
          return true
        }
      });
      console.log('disconnect');
  });

});

server.listen(8080, function () {
  console.log('quizz-app listening on port 8080!');
});