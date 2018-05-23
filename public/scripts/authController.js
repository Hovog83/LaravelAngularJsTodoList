(function() {

    'use strict';

    angular
        .module('authApp')
        .controller('AuthController', AuthController);

    function AuthController($auth, $state,$http) {

        var vm = this;

        vm.login = function() {
            var credentials = {
                email: vm.email,
                password: vm.password
            }
            $auth.login(credentials).then(function(response) {
                $state.go('tasks');
            }).catch(function onError(response) {
                // console.log(response);
                var data = response.data;
                console.log(data);
                var status = response.status;
                var statusText = response.statusText;
                var headers = response.headers;
                var config = response.config;
            });
        } 
        vm.register = function() {
            $http.post('api/register', {
                email: vm.email,
                name: vm.name,
                password: vm.password
            }).then(function (response) {
                vm.login()
            }).catch(function (error) {
                vm.error = error;
                console.log("error");
            });

        }
        vm.check = function() {
             $http.get('api/tasks').then(function (response) {
                console.log();
                if($state.current.name != "loguot"){
                    $state.go('tasks');
                }else{
                    vm.loguot();
                }
             }).catch(function onError(response) {
                 console.log("2");
             });
        }
        vm.loguot = function() {
            $auth.logout();
           $state.go('auth');
        }
        vm.check();
    }

})();
