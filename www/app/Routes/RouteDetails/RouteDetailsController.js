'use strict';
angular.module('smartAdminApp')
    .controller('RouteDetailsController', function($scope, $state, ionicToast, $ionicPopup, RoutesFactory, $ionicHistory, $interval) {

        $scope.route = RoutesFactory.selectedRoute;
        $scope.promise = null;

        $scope.deleteRoute = function() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Delete Route',
                template: 'Are you sure you want to delete this Route?'
            });
            confirmPopup.then(function(res) {
                if (res) {
                    RoutesFactory.deleteRoute($scope.route)
                        .then(function(success) {
                            if (success.data.Code != "S001") {
                                ionicToast.show(success.data.Message, 'bottom', false, 2500);
                            } else {
                                ionicToast.show('Route deleted Successfully', 'bottom', false, 2500);
                                $ionicHistory.nextViewOptions({
                                    disableBack: true
                                });
                                $state.go('menu.routeList');
                            }
                        }, function(error) {
                            ionicToast.show(error, 'bottom', false, 2500);
                        });
                }
            });
        };

        $scope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
            $interval.cancel($scope.promise);
        });

        $scope.callStaff = function(phoneNumber) {
            var call = "tel:" + phoneNumber;
            document.location.href = call;
        };

        $scope.startPolling = function() {
            $scope.promise = $interval(function() {
                RoutesFactory.getRouteByStudent($scope.route.Id)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            ionicToast.show(success.data.Message, 'bottom', false, 2500);
                        } else {
                            $scope.route = success.data.Data[0];
                            if ($scope.route.Latitude == null || $scope.route.Latitude == 'null') {
                                ionicToast.show('The bus has not started yet', 'bottom', false, 2500);
                            } else {
                                updateMarker($scope.route.Latitude, $scope.route.Longitude);
                            }
                        }
                    }, function(error) {
                        ionicToast.show(error, 'bottom', false, 2500);
                    });
            }, 1000 * 10);
        };

        $scope.initialize = function() {
            var mapOptions = {
                center: new google.maps.LatLng($scope.route.Latitude, $scope.route.Longitude),
                zoom: 16,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            var map = new google.maps.Map(document.getElementById("map"), mapOptions);

            $scope.marker = new google.maps.Marker({
                position: new google.maps.LatLng($scope.route.Latitude, $scope.route.Longitude),
                icon: "app/images/bus.png",
                map: map
            });

            // Stop the side bar from dragging when mousedown/tapdown on the map
            google.maps.event.addDomListener(document.getElementById('map'), 'mousedown', function(e) {
                e.preventDefault();
                return false;
            });

            $scope.map = map;
            $scope.startPolling();
        };

        function updateMarker(lat, lng) {
            var latlng = new google.maps.LatLng(lat, lng);
            $scope.marker.setPosition(latlng);
            $scope.map.setCenter(latlng);
        };

        if ($scope.route.Latitude == null || $scope.route.Latitude == 'null') {
            ionicToast.show('The bus has not started yet', 'bottom', false, 2500);
        } else {
            $scope.initialize();
        }
    });