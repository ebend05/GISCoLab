(function() {

    angular
        .module('giscolab')
        .controller('aboutCtrl', aboutCtrl);

    aboutCtrl.$inject = ['$location', 'meanData', 'userService'];
    function aboutCtrl($location, meanData, userService) {
        console.log("about Controller is running!!!");
    }
})();
