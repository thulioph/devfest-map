(function() {

  'use strict';

  /**
   * @ngdoc overview
   * @name devFestAppApp
   * @description
   * # devFestAppApp
   *
   * Main module of the application.
   */
  angular
    .module('devFestAppApp', [
      'ngAnimate',
      'ngCookies',
      'ngResource',
      'ngRoute',
      'ngSanitize',
      'ngMaterial'
    ])
    .config(function ($routeProvider) {
      $routeProvider
        .when('/main', {
          templateUrl: 'views/main.html',
          controller: 'MainCtrl',
          controllerAs: 'main'
        })
        .when('/about', {
          templateUrl: 'views/about.html',
          controller: 'AboutCtrl',
          controllerAs: 'about'
        })
        .when('/', {
          templateUrl: 'views/map.html',
          controller: 'MapCtrl',
          controllerAs: 'map'
        })
        .otherwise({
          redirectTo: '/'
        });
    });

})();
