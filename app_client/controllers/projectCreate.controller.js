(function() {

    angular
        .module('giscolab')
        .controller('projectsCreateCtrl', projectsCreateCtrl);

    projectsCreateCtrl.$inject = ['$location', 'authentication'];
    function projectsCreateCtrl($location, authentication) {
        var vm = this;

        vm.project = {
            projectName: "",
            userName: "",
            collaborators: [""]
        };

        vm.onSubmit = function () {
            console.log("submitting project");
            authentication
                .project(vm.project)
                .error(function (err) {
                alert(err);
                })
                .then(function () {
                    $location.path('/current');
                });
        }
    }
})();