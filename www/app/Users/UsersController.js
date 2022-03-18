'use strict';
angular.module('smartAdminApp')
    .controller('UsersController', function($scope, $state, UsersFactory, ionicToast, LoginFactory, $ionicPopup, SelectClassFactory) {

        $scope.users = [];
        $scope.loggedInUser = LoginFactory.loggedInUser;

        $scope.getAllUsers = function() {
            UsersFactory.getAllUsers(LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.users = success.data.Data;
                    }
                    $scope.$broadcast('scroll.refreshComplete');
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.deleteUser = function(user) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Delete User',
                template: 'Are you sure you want to delete ' + user.Name + '?'
            });
            confirmPopup.then(function(res) {
                if (res) {
                    var obj = {
                        Id: user.Id
                    };
                    UsersFactory.deleteUser(obj)
                        .then(function(success) {
                            if (success.data.Code != "S001") {
                                ionicToast.show(success.data.Message, 'bottom', false, 2500);
                            } else {
                                ionicToast.show('User was deleted successfully', 'bottom', false, 2500);
                                $scope.getAllUsers();
                            }
                        }, function(error) {
                            ionicToast.show(error, 'bottom', false, 2500);
                        });
                } else {
                    console.log('You are not sure');
                }
            });
        };

        $scope.lessonPlan = function(user) {
            $state.go('menu.userSubjects', { UserId: user.Id });
        };

        $scope.selectClass = function(user) {
            SelectClassFactory.selectedUser = user;
            $state.go('menu.selectClass', { UserId: user.Id });
        };

        $scope.getAllUsers();
    });