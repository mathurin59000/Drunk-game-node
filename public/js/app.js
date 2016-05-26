var App = angular.module( 'App', [ 'ngMaterial', 'ui.router' ] );

App.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/");
  //
  // Now set up the states
  $stateProvider
    .state('home', {
      url: "/",
      templateUrl: "public/js/templates/home.html",
      controller: "HomeController"
    })
    .state('main', {
      url: "/main",
      params: {
        players: null
      },
      templateUrl: "public/js/templates/main.html",
      controller: "MainController"
    });
});