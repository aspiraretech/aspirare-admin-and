'use strict';
angular.module('smartAdminApp')
    .controller('RouteListController', function ($scope, $state, RoutesFactory, ionicToast, LoginFactory) {

        $scope.routes = [];

        $scope.addRoute = function () {
            $state.go('menu.createRoute');
        };

        $scope.routeSelected = function(route){
            RoutesFactory.selectedRoute = route;
            $state.go('menu.routeDetails');
        };

        $scope.getAllRoutes = function () {
            RoutesFactory.getAllRoutes(LoginFactory.loggedInUser.CollegeId)
                .then(function (success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.routes = success.data.Data;
                    }
                    $scope.$broadcast('scroll.refreshComplete');
                }, function (error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.getAllRoutes();
    });
