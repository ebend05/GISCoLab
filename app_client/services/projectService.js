(function(){

    angular
        .module('giscolab')
        .service('projectService', projectService);

    projectService.$inject = ['$http', 'authentication'];
    function projectService($http, authentication) {

        function updateProject(project) {
            return $http.post('/api/projectUpdate', project, {
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                }})
        };

        function deleteProject(project) {
            return $http.post('/api/projectDelete', project, {
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                }})
        };

        return {
            updateProject : updateProject,
            deleteProject : deleteProject
        };

    }
})();
