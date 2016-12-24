(function() {
  
  angular
    .module('giscolab')
    .controller('profileCtrl', profileCtrl);

  profileCtrl.$inject = ['$location', 'meanData', 'userService'];
  function profileCtrl($location, meanData, userService) {
    var vm = this;

    vm.user = {};

      vm.saveUser = saveUser;
      vm.deleteUser = deleteUser;

    meanData.getProfile()
      .success(function(data) {
        vm.user = data;
      })
      .error(function (e) {
        console.log(e);
      });

      function saveUser() {
          userService.update(vm.user)
              .then(function(){
                  $location.path('/account');
              })
              .catch(function (e) {
                  console.log(e);
              });
      }

      function deleteUser() {
          userService.deleteUsers(vm.user)
              .then(function(){
                  $location.path('/account');
              })
              .catch(function (e) {
                  console.log(e);
              });
      }
  }

})();