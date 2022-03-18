'use strict';
angular.module('smartAdminApp')
    .controller('SidemenuController', function($scope, $state, LoginFactory, $rootScope) {

        $rootScope.$on('userLoggedIn', function(event) {
            $scope.loggedInUser = LoginFactory.loggedInUser;
            $scope.colleges = LoginFactory.colleges;
        });

        if (LoginFactory.isAuthenticated) {
            console.log($scope.loggedInUser);
            $scope.loggedInUser = LoginFactory.loggedInUser;
        }

        $scope.logout = function() {
            LoginFactory.logout();
            $state.go('login');
        };
    });