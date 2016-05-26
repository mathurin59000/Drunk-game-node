angular.module( 'App').controller("MainController", function($scope, $state, SocketService) {
	  
	  console.log("dans MainController");
	  console.log($state.params.players);
	  $scope.players = $state.params.players;
	  console.log($state.params.players);
	  var socket = SocketService.getSocket();

	  socket.on('chrono', function(seconds){
	  	console.log("chrono");
	  	$scope.time = seconds;
	  	$scope.$apply();
	  });

	  $scope.reset = function(){
	  	socket.emit('reset');
	  	SocketService.disconnectSocket();
	  	window.location.href="/#/";
	  	window.location.reload();
	  }
});