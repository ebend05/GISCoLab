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
            collaborators: [""]
        };

        vm.onSubmit = function () {
            console.log("submitting project");
            var colArray = vm.project.collaborators.split(', ');
            vm.project.collaborators = colArray;
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