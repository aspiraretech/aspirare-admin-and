'use strict';
angular.module('smartAdminApp')
    .controller('CreateRouteController', function($scope, $state, RoutesFactory, LoginFactory, ionicToast, $ionicHistory, UsersFactory) {

        $scope.newRoute = {
            Id: null,
            RouteNumber: "",
            VehicleRegNumber: "",
            AreasCovered: "",
            CollegeId: LoginFactory.loggedInUser.CollegeId,
            UserId: null
        };

        $scope.users = [];

        $scope.create = function() {
            if ($scope.newRoute.RouteNumber == "" || $scope.newRoute.VehicleRegNumber == "" || $scope.newRoute.AreasCovered == "" || $scope.newRoute.UserId == null || $scope.newRoute.UserId == undefined) {
                ionicToast.show('Please enter all the details', 'bottom', false, 2500);
            } else {
                RoutesFactory.createRoute($scope.newRoute)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            ionicToast.show(success.data.Message, 'bottom', false, 2500);
                        } else {
                            ionicToast.show('Route created successfully', 'bottom', false, 2500);
                            $ionicHistory.nextViewOptions({
                                disableBack: true
                            });
                            $state.go('menu.routeList');
                        }
                    }, function(error) {
                        ionicToast.show(error, 'bottom', false, 2500);
                    });
            }
        };

        $scope.getAllUsers = function() {
            UsersFactory.getAllUsers(LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        for (var i = 0; i < success.data.Data.length; i++) {
                            if (success.data.Data[i].Role == 'DRIVER') {
                                $scope.users.push(success.data.Data[i]);
                            }
                        }
                    }
                    $scope.$broadcast('scroll.refreshComplete');
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.getAllUsers();

    });