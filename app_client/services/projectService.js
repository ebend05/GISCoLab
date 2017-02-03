(function(){

    angular
        .module('giscolab')
        .service('projectService', projectService);

    projectService.$inject = ['$http', 'authentication'];
    function projectService($http, authentication) {

        function updateProject(project, id) {
            return $http.post('/api/projectUpdate/'+ id, project, {
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                }})
        };

        function deleteProject(project, id) {
            return $http.post('/api/projectDelete/'+ id, project, {
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                }})
        };

        var proID;

        function setID(value){
            proID = value;
        };

        function getID(){
            return proID;
        };

        return {
            updateProject : updateProject,
            deleteProject : deleteProject,
            setID : setID,
            getID : getID
        };

    }
})();
