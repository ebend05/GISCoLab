(function() {

    angular
        .module('giscolab')
        .controller('projectsCtrl', projectsCtrl);

    projectsCtrl.$inject = ['$location', 'meanData', 'userService', '$scope', '$rootScope', 'projectService'];
    function projectsCtrl($location, meanData, userService, $scope, $rootScope, projectService) {
        console.log("projects Controller is running!!!");

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
            projectService.setID(id);
            $location.path('/projectActive');
        }
    }
})();