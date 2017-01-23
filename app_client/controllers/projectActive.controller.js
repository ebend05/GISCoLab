(function() {

    angular
        .module('giscolab')
        .controller('projectActiveCtrl', projectActiveCtrl);

    projectActiveCtrl.$inject = ['$location', 'meanData', 'userService', '$scope', 'projectService'];
    function projectActiveCtrl($location, meanData, userService, $scope, projectService) {
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
    }
})();
