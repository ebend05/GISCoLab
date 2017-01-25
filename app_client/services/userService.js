(function(){

    angular
        .module('giscolab')
        .service('userService', userService);

    userService.$inject = ['$http', 'authentication'];
    function userService($http, authentication) {

        function update(user) {
            return $http.post('/api/profileUpdate', user, {
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                }})
        };

        function deleteUsers(user) {
            return $http.post('/api/profileDelete', user, {
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                }})
        };

        var collID;

        function setCollID(value){
            collID = value;
        };

        function getCollID(){
            return collID;
        };

        return {
            update : update,
            deleteUsers : deleteUsers,
            setCollID: setCollID,
            getCollID: getCollID
        };

    }
})();
