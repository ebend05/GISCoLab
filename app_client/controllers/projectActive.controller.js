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
            var txt = document.getElementById('tfile').files[0];
            var fr = new FileReader();
            fr.onloadend = function(e){
                var data = e.target.result;
                projectService.uploadTextFile(data, pid);
            };
            fr.readAsBinaryString(txt);
        };

        $scope.uploadRscript = function(){
            // selbes Problem wie oben
        };

        $scope.anFunction = function (id) {
            userService.setCollID(id);
            $location.path('/userProfile');
        }
    }
})();
