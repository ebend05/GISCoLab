(function() {

    angular
        .module('giscolab')
        .controller('projectsCreateCtrl', projectsCreateCtrl);

    projectsCreateCtrl.$inject = ['$location', 'authentication'];
    function projectsCreateCtrl($location, authentication) {
        var vm = this;

        vm.project = {
            projectName: "",
            ownerID: "",
            userName: "",
            info: "",
            dateCreated: "",
            uniqueKey: "",
            collaborators: [""]
        };

        vm.onSubmit = function () {
            console.log("submitting project");
            var colArray = vm.project.collaborators.split(', ');
            vm.project.collaborators = colArray;
            vm.project.uniqueKey = vm.project.userName + vm.project.projectName;
            authentication
                .project(vm.project)
                .error(function (err) {
                    alert(err);
                })
                .then(function () {
                    $location.path('/projectActive');
                });
        }
    }
})();