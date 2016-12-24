(function() {

    angular
        .module('giscolab')
        .controller('currentCtrl', currentCtrl);

    currentCtrl.$inject = ['$location', 'meanData', 'userService'];
    function currentCtrl($location, meanData, userService) {
        console.log("current Controller is running!!!");
    }
})();