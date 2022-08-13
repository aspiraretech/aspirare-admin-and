'use strict';
angular.module('smartAdminApp')
    .controller('SelectClassController', function($scope, $state, DashboardFactory, ionicToast, SelectClassFactory) {

        $scope.name = SelectClassFactory.selectedUser.Name;
        $scope.selectedUser = SelectClassFactory.selectedUser;
        $scope.keywords = DashboardFactory.keywords;
        $scope.subjects = [];
        $scope.classes = [];
        $scope.selected = {
            subject: null,
            class: null
        };

        $scope.subjectSelected = function(selectedSubject) {
            $scope.selected.subject = selectedSubject;
            if ($scope.selected.subject.IsElective == undefined) {
                $scope.selected.subject.IsElective = "true";
            }
            SelectClassFactory.getAllClassesForSubject($scope.selected.subject.Id, $scope.selectedUser.Id, $scope.selected.subject.IsElective)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.classes = success.data.Data;
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.classSelected = function(selectedClass) {
            $scope.selected.class = selectedClass;
        };

        $scope.enterClass = function() {
            if ($scope.selected.subject == null || $scope.selected.class == null) {
                ionicToast.show('Please choose subject and a class to proceed', 'bottom', false, 2500);
            } else {
                SelectClassFactory.selected.subject = $scope.selected.subject;
                SelectClassFactory.selected.class = $scope.selected.class;
                SelectClassFactory.selected.attendanceDate = $scope.selected.attendanceDate;
                $state.go('menu.takeAttendance');
            }
        };

        $scope.getAllSubjectsForUser = function() {
            SelectClassFactory.getAllSubjectsForUser($scope.selectedUser.Id)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.subjects = success.data.Data;
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.getAllSubjectsForUser();
    });