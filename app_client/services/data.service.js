(function() {

  angular
    .module('giscolab')
    .service('meanData', meanData);

  meanData.$inject = ['$http', 'authentication'];
  function meanData ($http, authentication) {

    var getProfile = function () {
      return $http.get('/api/profile', {
        headers: {
          Authorization: 'Bearer '+ authentication.getToken()
        }
      });
    };

      var getProject = function (id) { //id übergeben die in der api dann rausgesucht wird; genauso für profile; wenn leer dann aktuelles aufrufen
          return $http.get('/api/project/'+ id);
      };


    return {
      getProfile : getProfile,
        getProject : getProject
    };
  }

})();