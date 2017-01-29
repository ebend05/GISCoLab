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

        $scope.uploadTextfile = function(){
//funktioniert nicht, da ich keine ahnung habe, wie man dateien in einem ordner speichert
        }

        $scope.uploadRscript = function(){
            // selbes Problem wie oben
        }

        $scope.anFunction = function (id) {
            userService.setCollID(id);
            $location.path('/userProfile');
        }
    }
})();
