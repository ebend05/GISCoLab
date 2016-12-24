(function() {
  
  angular
    .module('giscolab')
    .controller('homeCtrl', homeCtrl);

    homeCtrl.$inject = ['$location', 'authentication'];

    function homeCtrl ($location, authentication) {

        var vm = this;

        vm.credentials = {
            email : "",
            password : ""
        };

        vm.onSubmit = function () {
            authentication
                .login(vm.credentials)
                .error(function(err){
                    alert(err);
                })
                .then(function(){
                    $location.path('/account');
                });
        };

    }

})();