'use strict';
angular.module('smartAdminApp')
    .controller('AddCalendarEventController', function($scope, $state, ionicDatePicker, CalendarFactory, LoginFactory, ionicToast, $ionicHistory) {

        $scope.newEvent = {
            Id: null,
            EventName: "",
            EventStartDate: moment().add(1, 'days').format('YYYY-MM-DD'),
            EventEndDate: moment().add(2, 'days').format('YYYY-MM-DD'),
            CollegeId: LoginFactory.loggedInUser.CollegeId
        };

        $scope.selected = {
            eventType: true
        };

        $scope.eventType = "Single day event";

        $scope.images = [];
        var currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 1);
        var tomorrowsDate = new Date();
        tomorrowsDate.setDate(tomorrowsDate.getDate() + 2);

        var ipObj1 = {
            callback: function(val) { //Mandatory
                $scope.newEvent.EventStartDate = moment(val).format('YYYY-MM-DD');
            },
            from: currentDate, //Optional
            to: new Date(2040, 12, 31), //Optional
            inputDate: currentDate, //Optional
            mondayFirst: false, //Optional
            closeOnSelect: true, //Optional
            templateType: 'popup' //Optional
        };

        var ipObj2 = {
            callback: function(val) { //Mandatory
                $scope.newEvent.EventEndDate = moment(val).format('YYYY-MM-DD');
            },
            from: tomorrowsDate, //Optional
            to: new Date(2040, 12, 31), //Optional
            inputDate: tomorrowsDate, //Optional
            mondayFirst: false, //Optional
            closeOnSelect: true, //Optional
            templateType: 'popup' //Optional
        };

        $scope.openStartDatePicker = function() {
            ionicDatePicker.openDatePicker(ipObj1);
        };

        $scope.openEndDatePicker = function() {
            ionicDatePicker.openDatePicker(ipObj2);
        };

        $scope.create = function() {
            if ($scope.newEvent.EventName == "") {
                ionicToast.show('Please enter the Name of the Calendar Event', 'bottom', false, 2500);
            } else {
                if ($scope.selected.eventType) {
                    $scope.newEvent.EventEndDate = $scope.newEvent.EventStartDate;
                }
                if (new Date($scope.newEvent.EventStartDate) > new Date($scope.newEvent.EventEndDate)) {
                    ionicToast.show('Start Date cannot be greater than End Date', 'bottom', false, 2500);
                } else {
                    CalendarFactory.addCalendarEvent($scope.newEvent)
                        .then(function(success) {
                            if (success.data.Code != "S001") {
                                ionicToast.show(success.data.Message, 'bottom', false, 2500);
                            } else {
                                ionicToast.show('Calendar Event created successfully', 'bottom', false, 2500);
                                $ionicHistory.nextViewOptions({
                                    disableBack: true
                                });
                                $state.go('menu.calendarList');
                            }
                        }, function(error) {
                            ionicToast.show(error, 'bottom', false, 2500);
                        });
                }
            }
        };

        $scope.$watch('newEvent.EventName', function(newVal, oldVal) {
            if (newVal.length > 50) {
                $scope.newEvent.EventName = oldVal;
            }
        });

        $scope.eventTypeChanged = function() {
            if ($scope.selected.eventType) {
                $scope.eventType = "Single day event";
            } else {
                $scope.eventType = "Multiple days event";
            }
        };

    });