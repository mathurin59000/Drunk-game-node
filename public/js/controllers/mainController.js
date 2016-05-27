angular.module( 'App').controller("MainController", function($scope, $state, SocketService, $http) {
	  
	  console.log("dans MainController");
	  console.log($state.params.players);
	  $scope.players = $state.params.players;
	  console.log($state.params.players);
	  var socket = SocketService.getSocket();
	  $scope.chronoMode = true;
	  $scope.resultsGame = null;

	  function retrieveResults(){
	  	$http({
		    method: 'GET',
		    url: '/api/results'
		  }).then(function successCallback(response) {
		    console.log('Results : ');
		    console.log(response.data.results);
		    if(response.data.results.length>0){
		    	$scope.resultsGame = response.data.results;
		    }
		    //$scope.results = response.data;
		      // this callback will be called asynchronously
		      // when the response is available
		    }, function errorCallback(response) {
		      // called asynchronously if an error occurs
		      // or server returns response with an error status.
		    });
	  }

	  retrieveResults();

	  socket.on('chrono', function(seconds){
	  	console.log("chrono");
	  	$scope.chronoMode = true;
	  	$scope.time = seconds;
	  	$scope.$apply();
	  })
	  .on('startButtons', function(){
	  	$scope.resultsGame = null;
	  	$scope.chronoMode = false;
	  	$scope.currentGame = "Buttons clicker !";
	  })
	  .on('stopButtons', function(){
	  	console.log('retour du ButtonsGame !');
	  	retrieveResults();
	  })

	  $scope.reset = function(){
	  	socket.emit('reset');
	  	SocketService.disconnectSocket();
	  	window.location.href="/#/";
	  	window.location.reload();
	  }
});