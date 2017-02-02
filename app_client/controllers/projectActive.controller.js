(function() {

    angular
        .module('giscolab', ['ngFileUpload'])
        .controller('projectActiveCtrl', projectActiveCtrl);

    projectActiveCtrl.$inject = ['$location', 'meanData', 'userService', '$scope', 'projectService', 'Upload', '$window'];
    function projectActiveCtrl($location, meanData, userService, $scope, projectService, Upload, $window) {
        var vm = this;

        vm.project = {};

        var pid = projectService.getID();

        meanData.getProject(pid)
            .success(function (data) {
                vm.project = data;
            })
            .error(function (e) {
                console.log(e);
            });

        $scope.uploadTextfile = function(){
            var txt = document.getElementById('tfile').files[0];
            var fr = new FileReader();
            fr.onloadend = function(e){
                var data = e.target.result;
                projectService.uploadTextFile(data, pid);
            };
            fr.readAsBinaryString(txt);
        };

        $scope.uploadRscript = function(){
            // selbes Problem wie oben
        };

        $scope.anFunction = function (id) {
            userService.setCollID(id);
            $location.path('/userProfile');
        }
/*
        vm.submit = function(){ //function to call on form submit
            if (vm.upload_form.file.$valid && vm.file) { //check if from is valid
                vm.upload(vm.file); //call upload function
            }
        }
        vm.upload = function (file) {
            Upload.upload({
                url: 'http://localhost:3000/upload', //webAPI exposed to upload the file
                data:{file:file} //pass file as data, should be user ng-model
            }).then(function (resp) { //upload function returns a promise
                if(resp.data.error_code === 0){ //validate success
                    $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
                } else {
                    $window.alert('an error occured');
                }
            }, function (resp) { //catch error
                console.log('Error status: ' + resp.status);
                $window.alert('Error status: ' + resp.status);
            }, function (evt) {
                console.log(evt);
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
            });
        };
        */
    }
})();
