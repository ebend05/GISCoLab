(function() {

    angular
        .module('giscolab')
        .controller('projectActiveCtrl', projectActiveCtrl);

    projectActiveCtrl.$inject = ['$location', 'meanData', 'userService'];
    function projectActiveCtrl($location, meanData, userService) {
        var vm = this;

        vm.project = {};

        meanData.getProject()
            .success(function(data) {
                vm.project = data;
            })
            .error(function (e) {
                console.log(e);
            });
    }

})();
