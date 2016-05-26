angular.module( 'App').controller("HomeController", function($scope, $state, SocketService, $http) {
	  
	  console.log("dans HomeController");
	  $scope.players = [];
	  
	  $scope.start = function(){
	  	console.log("dans start()");
	  	socket.emit('start');
	  	$state.go('main', {players: $scope.players});
	  };

	  $http({
		  method: 'GET',
		  url: '/api/ip'
		}).then(function successCallback(response) {
			$scope.ip = response.data.ip;
		    // this callback will be called asynchronously
		    // when the response is available
		  }, function errorCallback(response) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  });

	  var socket = SocketService.getSocket();

	  socket.on('connect', function(){
	  	socket.emit('admin');
	  })
	  .on('joinadmin', function(message){
	  	console.log("admin connected")
	  })
	  .on('join', function(name, img){
	  	console.log("new player !");
        var player = {
        	name: name,
        	img: img,
        	points: 0 
        };
        console.log(player);
        $scope.players.push(player);
        $scope.$apply();
      });

});