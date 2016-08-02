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
      vm.displaRoute = displaRoute;
      vm.getMarkers = getMarkers();
      vm.setClusters = setClusters;

      buildMap();

      // ====

      function buildMap() {
        console.info('Building map...');

        var fakePosition, map, mapContainer, mapOptions, posObj, bounds, directionsService, directionsDisplay;

        vm.directionsService = new google.maps.DirectionsService;
        vm.directionsDisplay = new google.maps.DirectionsRenderer;

        // Removes all default markers of render directions
        vm.directionsDisplay = new google.maps.DirectionsRenderer({
          suppressMarkers: true
        });

        // salvador
        posObj = {
          'lat': -12.9080817,
          'lng': -39.2652199
        };

        fakePosition = new google.maps.LatLng(posObj.lat, posObj.lng);

        mapContainer = document.getElementById('map-container');

        mapOptions = {
          center: fakePosition,
          zoom: 3,
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
        vm.directionsDisplay.setMap(vm.map);

        vm.bounds = new google.maps.LatLngBounds();

        $scope.$emit('map_is_ok', vm.map);
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
                'social': i.social,
                'url': '../images/thumbs/' + i.id + '.png'
              }
            });

          });

          $scope.$emit('markers_is_ok');
        });
      }

      function addMarkers() {
        console.info('Add markers into map...');

        var marker, markerConfig, markerArray;

        markerArray = [];

        angular.forEach(vm.markers_geo, function(i) {
          markerConfig = {
            position: new google.maps.LatLng(i.geo.lat, i.geo.lng),
            map: vm.map,
            clickable: true,
            title: i.name,
            zIndex: i.id,
            icon: {
              url: '../images/thumbs/' + i.icon.url + '.png',
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(10, 15),
              scaledSize: new google.maps.Size(40, 40)
            },
            data: i.data
          };

          marker = new google.maps.Marker(markerConfig);
          markerArray.push(marker);

          // adjusts zoom to show all markers
          vm.bounds.extend(new google.maps.LatLng(i.geo.lat, i.geo.lng));
          vm.map.fitBounds(vm.bounds);

          // add listener for each marker
          google.maps.event.addListener(marker, 'click', vm._clickedMarker(marker, i));
        });

        // Marker Clusters
        vm.setClusters(markerArray);

        calculateAndDisplayRoute(vm.directionsService, vm.directionsDisplay);

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

      function calculateAndDisplayRoute(directionsService, directionsDisplay) {
        var waypts, markers, first, last, obj;

        waypts = [];
        // markers = vm.markers_geo;
        markers = vm.markers_geo.slice(3);

        first = markers.shift();
        last = markers.pop();

        obj = {
          origin: first.data.bio,
          destination: last.data.bio
        }

        for (var i = 0; i < markers.length; i++) {
          waypts.push({
            location: new google.maps.LatLng(markers[i].geo.lat, markers[i].geo.lng),
            stopover: true
          });
        }

        obj.waypts = waypts;

        vm.displaRoute(directionsService, obj);
      }

      function displaRoute(directionsService, obj) {
        directionsService.route({
          origin: obj.origin,
          destination: obj.destination,
          waypoints: obj.waypts,
          optimizeWaypoints: true,
          travelMode: google.maps.TravelMode.DRIVING
        }, function(response, status) {
          if (status === google.maps.DirectionsStatus.OK) {
            vm.directionsDisplay.setDirections(response);
          } else {
            console.warn('Directions request failed due to ' + status);
          }
        });
      }

      function setClusters(markersArray) {
        var mc, mcOptions, latLng, marker;

        // markersArray = [];

        // for (var i = 0; i < 3; i++) {
          // markersArray.push(new google.maps.Marker({
          //   'position': new google.maps.LatLng(, ),
          //   'icon': {
          //     url: '../../images/thumbs/5.png',
          //     scaledSize: new google.maps.Size(40, 40)
          //   }
          // }));

          // markersArray.push(new google.maps.Marker({
          //   'position': new google.maps.LatLng(, ),
          //   'icon': {
          //     url: '../../images/thumbs/3.png',
          //     scaledSize: new google.maps.Size(40, 40)
          //   }
          // }));

          // markersArray.push(new google.maps.Marker({
          //   'position': new google.maps.LatLng(-23.4815314, -46.6754983),
          //   'icon': {
          //     url: '../../images/thumbs/7.png',
          //     scaledSize: new google.maps.Size(40, 40)
          //   }
          // }));
        // }

        mcOptions = {
          gridSize: 20,
          maxZoom: 7,
          imagePath: '../../images/markers/m'
        };

        mc = new MarkerClusterer(vm.map, markersArray, mcOptions);
      }

      function buildAll() {
        console.warn('=== MAP AND MARKERS ARE OK ===');
      }

      // Sidebar

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

      $scope.$on('map_is_ok', vm.getMarkers);
      $scope.$on('markers_is_ok', vm.addMarkers);
      $scope.$on('map_markers_ok', vm.buildAll);
    }

})();
