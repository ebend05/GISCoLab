(function() {

    angular
        .module('giscolab')
        .controller('accountCtrl', accountCtrl);

    accountCtrl.$inject = ['$location', 'meanData', 'userService', '$scope'];
    function accountCtrl($location, meanData, userService, $scope) {
        var vm = this;

        vm.user = {};

        meanData.getProfile()
            .success(function(data) {
                vm.user = data;
            })
            .error(function (e) {
                console.log(e);
            });

        $scope.myFunction = function (id) {

        }


    }

})();
