angular.module( 'App').controller("HomeController", function($scope, $state, SocketService) {
	  
	  console.log("dans HomeController");
	  
	  $scope.start = function(){
	  	console.log("dans start()");
	  	$state.go('main');
	  	//$state.go('my.state', {listId: $stateParams.listId, itemId: $stateParams.itemId});
	  };

	  var socket = SocketService.getSocket();
	  console.log(socket);

	  socket.on('connect', function(){
	  	socket.emit('admin');
	  })
	  .on('joinadmin', function(message){
	  	console.log("connected")
	  });

});