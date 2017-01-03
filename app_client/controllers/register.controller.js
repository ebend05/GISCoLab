(function () {

  angular
    .module('giscolab')
    .controller('registerCtrl', registerCtrl);

  registerCtrl.$inject = ['$location', 'authentication'];
  function registerCtrl($location, authentication) {
    var vm = this;

    vm.credentials = {
        firstName: "",
        lastName: "",
        email: "",
        userName: "",
        password: "",
        password2: "",
        birthday: "",
        info: "",
        registrDate: ""
    };
      
      /* once Front End Input is acquainted, include this: 
      userName : "",
      email : "",
      firstName : "",
      lastName : "",
      registrDate : "",
      birthday : "",
      info : "",
      password : ""
      */

    vm.onSubmit = function () {
        if (vm.credentials.password !== vm.credentials.password2) {
            alert("Passwwörter stimmen nicht überein!");
        } else {
            console.log('Submitting registration');
            authentication
                .register(vm.credentials)
                .error(function (err) {
                    alert(err);
                })
                .then(function () {
                    $location.path('/account');
                });
        }
    };

  }

})();