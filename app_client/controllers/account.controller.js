(function() {

    angular
        .module('giscolab')
        .controller('accountCtrl', accountCtrl);

    accountCtrl.$inject = ['$location', 'meanData', 'userService'];
    function accountCtrl($location, meanData, userService) {
        var vm = this;

        vm.user = {};

        meanData.getProfile()
            .success(function(data) {
                vm.user = data;
            })
            .error(function (e) {
                console.log(e);
            });
    }

})();
