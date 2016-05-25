angular.module('App').service('SocketService', ['$window', '$rootScope', '$log', function ($window, $rootScope, $log) {

  var service = this;

  var socket; 

  this.getSocket = function () {
    console.log("getSocket");
    socket = io.connect(window.location.protocol+"//"+window.location.host+"/game");
    return socket;
  }

  this.disconnectSocket = function (argument) {
    if(socket!=null){
      socket.close();
    }
  }

}]);