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

      var getProject = function () {
          return $http.get('/api/project', {
              headers: {
                  Authorization: 'Bearer '+ authentication.getToken()
              }
          });
      };

    return {
      getProfile : getProfile,
        getProject : getProject
    };
  }

})();