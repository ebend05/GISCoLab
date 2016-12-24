(function() {

    angular
        .module('giscolab')
        .controller('projectsCtrl', projectsCtrl);

    projectsCtrl.$inject = ['$location', 'meanData', 'userService'];
    function projectsCtrl($location, meanData, userService) {
        console.log("projects Controller is running!!!");
    }
})();