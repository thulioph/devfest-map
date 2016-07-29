(function() {

  'use strict';

  angular
    .module('devFestAppApp')
    .constant('ApiConfig', {
      'API_URL': 'http://jsonplaceholder.typicode.com/users',
      'API_LOCAL': 'scripts/markers/data.json'
    });

})();
