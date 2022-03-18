'use strict';
angular.module('smartAdminApp')
    .controller('CalendarListController', function($scope, $state, CalendarFactory, ionicToast, LoginFactory, $ionicPopup) {

        $scope.calendarEvents = [];
        $scope.monthwiseEvents = [];

        $scope.addCalendarEvent = function() {
            $state.go('menu.addCalendarEvent');
        };

        $scope.getAllCalendarEvents = function() {
            $scope.calendarEvents = [];
            $scope.monthwiseEvents = [];
            CalendarFactory.getAllCalendarEvents(LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.calendarEvents = success.data.Data;
                    }
                    $scope.$broadcast('scroll.refreshComplete');
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.delete = function(event) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Delete Calendar Event',
                template: 'Are you sure you want to delete this calendar event?'
            });
            confirmPopup.then(function(res) {
                if (res) {
                    CalendarFactory.deleteEvent(event)
                        .then(function(success) {
                            if (success.data.Code != "S001") {
                                ionicToast.show(success.data.Message, 'bottom', false, 2500);
                            } else {
                                ionicToast.show('Event deleted successfully from calendar', 'bottom', false, 2500);
                                $scope.getAllCalendarEvents();
                            }
                        }, function(error) {
                            ionicToast.show(error, 'bottom', false, 2500);
                        });
                } else {
                    console.log('You are not sure');
                }
            });
        };

        $scope.canShow = function(event) {
            var today = new Date();
            today.setHours(0, 0, 0, 0);
            var d = new Date(event.EventStartDate);
            d.setHours(0, 0, 0, 0);
            if (d >= today) {
                return true;
            } else {
                return false;
            }
        }

        $scope.isOneDayEvent = function(event) {
            if (new Date(event.EventStartDate).getTime() == new Date(event.EventEndDate).getTime()) {
                return true;
            } else {
                return false;
            }
        };

        $scope.getAllCalendarEvents();
    });