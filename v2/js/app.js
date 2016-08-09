(function() {
  'use strict';

  // Get data from database
  function Request(url) {
    // Return a new promise.
    return new Promise(function(resolve, reject) {
      // Do the usual XHR stuff
      var req = new XMLHttpRequest();
      req.open('GET', url);

      req.onload = function() {
        // This is called even on 404 etc
        // so check the status
        if (req.status == 200) {
          // Resolve the promise with the response text
          resolve(req.response);
        }
        else {
          // Otherwise reject with the status text
          // which will hopefully be a meaningful error
          reject(Error(req.statusText));
        }
      };

      // Handle network errors
      req.onerror = function() {
        reject(Error("Network Error"));
      };

      // Make the request
      req.send();
    });
  }

  // Build map
  function BuildMap() {
    console.info('Building map...');

    var fakePosition, map, mapContainer, mapOptions, posObj, bounds, directionsService, directionsDisplay;

    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer;

    // Removes all default markers of render directions
    directionsDisplay = new google.maps.DirectionsRenderer({
      suppressMarkers: true
    });

    // Salvador
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

    map = new google.maps.Map(mapContainer, mapOptions);
    directionsDisplay.setMap(map);

    bounds = new google.maps.LatLngBounds();
  }

  // Get markers
  function BuildMarkers(markersArray) {
    return new Promise(function(resolve, reject) {
      var markers_geo;

      markers_geo = [];

      markersArray.forEach(function(i) {
        markers_geo.push({
          geo: i.location.geo,
          id: i.id,
          name: i.name,
          icon: { url: i.photo },
          data: {
            'name': i.name,
            'company': i.company,
            'bio': i.bio,
            'social': i.social,
            'url': '../images/thumbs/' + i.id + '.png'
          }
        });
      });

      resolve(markers_geo);
    });
  }

  // Add markers
  function AddMarkers(markersArray) {
    console.log(this.map);

    return new Promise(function(resolve, reject) {
      // console.info('Add markers into map...');

      var marker, markerConfig, markerArray;

      markerArray = [];

      markersArray.forEach(function(i) {
        markerConfig = {
          position: new google.maps.LatLng(i.geo.lat, i.geo.lng),
          map: map,
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
        bounds.extend(new google.maps.LatLng(i.geo.lat, i.geo.lng));
        map.fitBounds(bounds);

        // add listener for each marker
        google.maps.event.addListener(marker, 'click', function(marker, i) {
          console.info(marker, i);
        });
      });

      // Marker Clusters
      // setClusters(markerArray);

      // calculateAndDisplayRoute(directionsService, directionsDisplay);
    });
  }

  // Init function
  function Init() {
    BuildMap();

    var url, markers;

    url = 'https://gist.githubusercontent.com/thulioph/dcea3d05a128a5ebbb4a4f7ee8331d91/raw/15e5b04134d0c25b21c4c045b7d2b92a5845bb4f/markers.json';

    Request(url).then(function(response) {
      markers = JSON.parse(response);

      BuildMarkers(markers).then(function(response) {
        console.info('dale 1', response);

        // AddMarkers(response).then(function(response) {
        //   console.log('dale 2', response)
        // }).catch(function(error) {
        //   console.warn('error 2', error)
        // });

      }).catch(function(error) {
        console.warn('error 1', error);
      });

    }).catch(function(error) {
      console.warn('ERROR', error);
    });
  }

  // Listeners
  window.onload = function() {
    Init();
  }

})();
