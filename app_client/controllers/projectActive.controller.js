(function() {

    angular
        .module('giscolab'/*, ['ngFileUpload']*/)
        .controller('projectActiveCtrl', projectActiveCtrl);

    projectActiveCtrl.$inject = ['$location', 'meanData', 'userService', '$scope', 'projectService'/*, 'Upload', '$window'*/];
    function projectActiveCtrl($location, meanData, userService, $scope, projectService/*, Upload, $window*/) {
        var vm = this;

        vm.project = {};

        var pid = projectService.getID();

        meanData.getProject(pid)
            .success(function (data) {
                vm.project = data;
            })
            .error(function (e) {
                console.log(e);
            });

        $scope.anFunction = function (id) {
            userService.setCollID(id);
            $location.path('/userProfile');
        };
    }
})();
