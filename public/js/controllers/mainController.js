angular.module( 'App').controller("MainController", function($scope, $state, SocketService, $http, VideosService) {
	  
	  console.log("dans MainController");
	  console.log($state.params.players);
	  $scope.players = $state.params.players;
	  console.log($state.params.players);
	  var socket = SocketService.getSocket();
	  $scope.chronoMode = true;
	  $scope.resultsGame = null;
	  $scope.showMenu = false;



	  function retrieveResults(){
	  	$http({
		    method: 'GET',
		    url: '/api/results'
		  }).then(function successCallback(response) {
		    console.log('Results : ');
		    console.log(response.data.results);
		    if(typeof response.data.results != 'undefined'){
		    	if(response.data.results.length>0){
			    	$scope.resultsGame = response.data.results;
			    	$scope.players.forEach(function name(element, index, array){
				    	$scope.resultsGame.some(function name2(element2, index2, array2){
				    		if(element.name==element2.name){
				    			$scope.players[index].points = $scope.resultsGame[index2].score;
				    			return true;
				    		}
				    	});
				    });
				    console.log('on relance');
		    		socket.emit('start');
			    }
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
	  	$scope.$apply();
	  })
	  .on('stopButtons', function(){
	  	console.log('retour du ButtonsGame !');
	  	retrieveResults();
	  })
	  .on('startYoutube', function(){
	  	// Load the IFrame Player API code asynchronously.
		  var tag = document.createElement('script');
		  tag.src = "https://www.youtube.com/player_api";
		  var firstScriptTag = document.getElementsByTagName('script')[0];
		  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	  	console.log('startYoutube');
	  	VideosService.launchPlayer('Dg6HQ8RlPGQ', 'test');
	  	$scope.resultsGame = null;
	  	$scope.chronoMode = false;
	  	$scope.currentGame = "Blind Test Youtube !";
	  	$scope.$apply();
	  });

	  $scope.reset = function(){
	  	socket.emit('reset');
	  	SocketService.disconnectSocket();
	  	window.location.href="/#/";
	  	window.location.reload();
	  }
});