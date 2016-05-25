var App = angular.module( 'App', [ 'ngMaterial', 'ui.router' ] );

console.log('coucou');

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
      templateUrl: "public/js/templates/main.html",
      controller: "MainController"
    });
});