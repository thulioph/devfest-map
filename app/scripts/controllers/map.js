(function() {

  'use strict';

  /**
   * @ngdoc function
   * @name devFestAppApp.controller:MapCtrl
   * @description
   * # MapCtrl
   * Controller of the devFestAppApp
   */
  angular
  .module('devFestAppApp')
    .controller('MapCtrl', MapCtrl);

    MapCtrl.$inject = ['MapService', '$scope', '$mdSidenav', '$log'];

    function MapCtrl(MapService, $scope, $mdSidenav, $log) {
      var vm;

      /* jshint validthis: true */
      vm = this;
      vm.getMarkers = getMarkers;
      vm.addMarkers = addMarkers;
      vm.buildAll = buildAll;
      vm._clickedMarker = _clickedMarker;
      vm.toggleRight = toggleRight;
      vm.close = close;

      buildMap();

      // ====

      function buildMap() {
        console.info('Building map...');

        var fakePosition, map, mapContainer, mapOptions, posObj, bounds;

        // salvador
        posObj = {
          'lat': -12.9080817,
          'lng': -39.2652199
        };

        fakePosition = new google.maps.LatLng(posObj.lat, posObj.lng);

        mapContainer = document.getElementById('map-container');

        mapOptions = {
          center: fakePosition,
          zoom: 6,
          mapTypeControl: false,
          panControl: false,
          streetViewControl: false,
          zoomControl: true,
          scrollwheel: false,
          draggable: true,
          zIndex: 10,
          title: 'Você está aqui',
          zoomControlOptions: {
            style: google.maps.ZoomControlStyle.SMALL,
            position: google.maps.ControlPosition.RIGHT_BOTTOM
          }
        };

        vm.map = new google.maps.Map(mapContainer, mapOptions);

        vm.bounds = new google.maps.LatLngBounds();

        // $scope.$emit('map_is_ok', vm.map);
        vm.getMarkers();
      }

      function getMarkers() {
        console.info('Get markers...');

        var query;

        vm.markers_geo = [];
        query = MapService.query();

        query.$promise.then(function(data) {
          angular.forEach(data, function(i) {

            vm.markers_geo.push({
              geo: i.location.geo,
              id: i.id,
              name: i.name,
              icon: {
                url: i.photo
              },
              data: {
                'name': i.name,
                'company': i.company,
                'bio': i.bio,
                'social': i.social
              }
            });

          });

          $scope.$emit('markers_is_ok');
        });
      }

      function addMarkers() {
        console.info('Add markers into map...');

        var marker, markerConfig;

        angular.forEach(vm.markers_geo, function(i) {
          markerConfig = {
            position: new google.maps.LatLng(i.geo.lat, i.geo.lng),
            map: vm.map,
            clickable: true,
            title: i.name,
            zIndex: 12,
            // icon: {
            //   url: '../images/thumbs/' + i.photo + '.png',
            //   size: new google.maps.Size(75, 75)
            // },
            data: i.data
          };

          marker = new google.maps.Marker(markerConfig);

          // adjusts zoom to show all markers
          vm.bounds.extend(new google.maps.LatLng(i.geo.lat, i.geo.lng));
          vm.map.fitBounds(vm.bounds);

          // add listener for each marker
          google.maps.event.addListener(marker, 'click', vm._clickedMarker(marker, i));
        });

        $scope.$emit('map_markers_ok');
      }

      function _clickedMarker(marker, i) {
        return function() {
          vm.marker_info = i;
          $scope.$apply(vm.marker_info);

          // adjusts map zoom with marker clicked
          vm.map.panTo(marker.position);

          // toggle sidenav with speaker information
          $mdSidenav('left').toggle();
        }
      }

      function buildAll() {
        console.warn('=== MAP AND MARKERS ARE OK ===');
      }

      function toggleRight() {
          $mdSidenav('right').toggle()
          .then(function () {
            $log.debug("toggle " + 'right' + " is done");
          });
      }

      function close() {
        $mdSidenav('left').close()
          .then(function () {
            $log.debug("close RIGHT is done");
          });
      }

      // ====
      // Listeners
      // ====

      // $scope.$on('map_is_ok', vm.getMarkers);
      $scope.$on('markers_is_ok', vm.addMarkers);
      $scope.$on('map_markers_ok', vm.buildAll);
    }

})();
