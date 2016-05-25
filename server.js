var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server).of('/game');
var path = require('path');
var allClients = [];

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

app.use('/api', routerApi);

io.on('connection', function(socket){
  console.log("client connected to the server !");
  //user send his username
  socket.on('user', function(name){
    console.log(name+' connected to the game !');
    var item = {
      'socket': socket,
      'name': name
    };
    var alreadyConnected = false;
    allClients.some(function name(element, index, array){
      if(element.id==item.id){
        alreadyConnected=true;
        return true;
      }
    });
    if(!alreadyConnected){
      allClients.push(item);
    }
    socket.emit('join', name, ' is connecting to the chat !', Date.now());
    //socket.broadcast.emit('otherJoin', allClients.length);
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
          allClients.splice(index, 1);
          return true
        }
      });
      socket.broadcast.emit('bye');
  });

});

server.listen(3000, function () {
  console.log('quizz-app listening on port 3000!');
});