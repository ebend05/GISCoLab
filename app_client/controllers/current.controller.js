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
            select:"true",
            on: {"itemClick": function () {alert("item has just been clicked");}},
            template:"{common.icon()} {common.folder()}<span onclick='treeData();'>#value#<span>",
            data: [
                { id:"branch1", value: "vm.project.filePath[0]", data:[
                    { id:"part1", value: "vm.project.filePath[1]", data:[
                        {id:"../views/about.view.html", value: "lalla"},
                        {id:"files2", value: "vm.project.filePath[3]"},
                        {id:"files3", value: "vm.project.filePath[4]"}
                    ] }
                ]}
            ]
        });

        treeData = function(){
            var id = tree.getSelectedId();
            console.log(id);
            $.ajax({
                type: "GET",
                url: id,
                data: id,
                success: function (data) {
                    $('#codearea').html(data);
                }
            })
        }

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