(function() {

    'use strict';

    angular
        .module('authApp')
        .controller('TaskController', TaskController);
    function TaskController($http,$state,$auth) {
        var vm = this;
        vm.tasks;
        vm.tasksActiv;
        vm.tasksCompleted;
        vm.error;
        vm.getTasks = function() {
            $http.get('api/tasks').then(function (response) {
                var data           = response.data;
                var status         = response.status;
                var statusText     = response.statusText;
                var headers        = response.headers;
                var config         = response.config;
                vm.tasksActiv = (data[0]) ? data[0] : [];
                vm.tasksCompleted = (data[1]) ? data[1] : [];
            }).catch(function onError(response) {
                console.log("asd");
                var data       = response.data;
                if( data.error =="token_not_provided"){
                  $state.go('auth');
                }
                console.log(data);
                var status     = response.status;
                var statusText = response.statusText;
                var headers    = response.headers;
                var config     = response.config;
            });
        }

        vm.addTask = function() {
            $http.post('api/tasks', {
                title: vm.task,
                user_id: $auth.getPayload().sub
            }).then(function (response) {
                console.log(vm.tasksActiv);
                // vm.tasks.push(response.data);
                vm.tasksActiv.unshift(response.data);
                vm.setActiveTab('1');
                console.log(vm.tasks);
                vm.task = '';
            }).catch(function (error) {
                vm.error = error;
                console.log(error);
            });
        };
        vm.updateTask = function (index,task) {
            $http.put('api/tasks/' + task.id, {
                completed: task.done,
                user_id: $auth.getPayload().sub
            }).then(function (response) {
                vm.tasksActiv.splice(index,1);
                vm.tasksCompleted.unshift(task);
            }).catch(function () {
                console.log(task);
                console.log("error");
            });
        };
        vm.deleteTask = function (index, taskId,type) {
            console.log(taskId);
            $http
                .delete('api/tasks/' + taskId)
                .then(function() {
                    if(type == "tasksCompleted" ){
                     vm.tasksCompleted.splice(index,1);  
                    }else{
                     vm.tasksActiv.splice(index,1);  
                    }
                });
        };
        var tabClasses;
        function initTabs() {
          tabClasses = ["","","",""];
        }
          vm.getTabClass = function (tabNum) {
            return tabClasses[tabNum];
          };
          vm.getTabPaneClass = function (tabNum) {
            return "tab-pane " + tabClasses[tabNum];
          }
          
          vm.setActiveTab = function (tabNum) {
            initTabs();
            tabClasses[tabNum] = "active";
          };
          vm.setActiveTab('1');
          vm.getTasks();
    }

})();

