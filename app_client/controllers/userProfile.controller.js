(function() {

    angular
        .module('giscolab')
        .controller('userProfileCtrl', userProfileCtrl);

    userProfileCtrl.$inject = ['$location', 'meanData', 'userService', '$scope', '$rootScope', 'projectService'];
    function userProfileCtrl($location, meanData, userService, $scope, $rootScope, projectService) {
        var vm = this;

        vm.user = {};

        var collID = userService.getCollID();

        console.log(collID);

        meanData.getProfile2(collID)
            .success(function(data) {
                vm.user = data;
            })
            .error(function (e) {
                console.log(e);
            });

        $scope.myFunction = function (id) {
            projectService.setID(id);
            $location.path('/projectActive');
        }


    }

})();

