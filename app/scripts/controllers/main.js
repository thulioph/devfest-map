(function() {

  'use strict';

  /**
   * @ngdoc function
   * @name devFestAppApp.controller:MainCtrl
   * @description
   * # MainCtrl
   * Controller of the devFestAppApp
   */
  angular
  .module('devFestAppApp')
    .controller('MainCtrl', MainCtrl);

    MainCtrl.$inject = ['MapService'];

    function MainCtrl(MapService) {
      var vm;

      /* jshint validthis: true */
      vm = this;
      vm.getSpeakerById = getSpeakerById;

      getMapData();

      // ====

      function getMapData() {
        vm.map_data = MapService.query();
      }

      function getSpeakerById(id) {
        vm.speaker = MapService.get({user: id});
      }
    }

})();
