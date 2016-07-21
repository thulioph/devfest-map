(function() {

  'use strict';

  /**
   * @ngdoc service
   * @name devFestAppApp.MapService
   * @description
   * # MapService
   * Factory in the devFestAppApp.
   */
  angular
    .module('devFestAppApp')
    .factory('MapService', MapService);

    MapService.$inject = ['$resource', 'ApiConfig'];

    function MapService($resource, ApiConfig) {
      var url, data;

      url = ApiConfig.API_URL;
      data = $resource(url + '/:user', {user: '@user'});

      return data;
    }

})();
