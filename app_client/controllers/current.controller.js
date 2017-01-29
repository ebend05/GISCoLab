(function() {

    angular
        .module('giscolab')
        .controller('currentCtrl', currentCtrl);

    currentCtrl.$inject = ['$location', 'meanData', 'userService', '$scope', 'projectService'];
    function currentCtrl($location, meanData, userService, $scope, projectService) {
        console.log("current Controller is running!!!");

        var vm = this;

        vm.project = {};

        var pid = projectService.getID();

        if(pid !== undefined) {
            meanData.getProject(pid)
                .success(function (data) {
                    vm.project = data;
                })
                .error(function (e) {
                    console.log(e);
                });
        } else {
            alert("kein Projekt ausgewählt. Bitte erst eins auswählen!");
        };

        console.log(vm.project);

        //*****************************************************************************************************
        //*****************************************************************************************************
        //*****************************************************************************************************
        // Treeview

        var tree = new webix.ui({
            container:"treebox",
            view:"tree",
            data: [
                { id:"branch1", value: "vm.project.filePath[0]", data:[  //funktioniert nicht, da vm.project nur oben im block gefüllt ist und nicht global
                    { id:"part1", value: "vm.project.filePath[1]", data:[
                        {id:"files1", value: "vm.project.filePath[2]"},
                        {id:"files2", value: "vm.project.filePath[3]"},
                        {id:"files3", value: "vm.project.filePath[4]"}
                    ] }
                ]}
            ]
        });

        //'node' variable will contain an object of the related tree node
        //var node = tree.getItem('branch1');

        //you can access data members directly
        //var value = node.value; // ->"The Shawshank Redemption"

        //*****************************************************************************************************
        //*****************************************************************************************************
        //*****************************************************************************************************

        var treeview;

        $scope.buttonCodeToggle = function(){
            angular.element( document.querySelector('#code')).addClass('active');
            angular.element( document.querySelector('#otherdata')).removeClass('active');
            treeview = false;
        };
        $scope.buttonTreeToggle = function(){
            angular.element( document.querySelector('#code')).removeClass('active');
            angular.element( document.querySelector('#otherdata')).addClass('active');
            treeview = true;
        };

    }
})();