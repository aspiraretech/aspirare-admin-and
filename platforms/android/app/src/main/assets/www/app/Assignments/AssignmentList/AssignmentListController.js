'use strict';
angular.module('smartAdminApp')
    .controller('AssignmentListController', function($scope, $state, AssignmentFactory, ionicToast, LoginFactory, $ionicPopover) {

        $scope.assignments = [];
        $scope.years = [];
        $scope.currentYear = AssignmentFactory.currentYear;
        $scope.createdAt = moment(LoginFactory.loggedInUser.CreatedAt).format('YYYY');

        $ionicPopover.fromTemplateUrl('app/Assignments/AssignmentList/AssignmentYearTemplate.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.popover = popover;
        });

        $scope.openPopover = function($event) {
            $scope.popover.show($event);
        };

        $scope.closePopover = function() {
            $scope.popover.hide();
        };

        $scope.assignmentSelected = function(assignment) {
            AssignmentFactory.currentYear = $scope.currentYear;
            AssignmentFactory.selectedAssignment = assignment;
            $state.go('menu.editAssignment');
        };

        $scope.getAllAssignments = function(year) {
            AssignmentFactory.getAllAssignments(LoginFactory.loggedInUser.CollegeId, year)
                .then(function(success) {
                    $scope.assignments = [];
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.assignments = success.data.Data;
                    }
                    $scope.$broadcast('scroll.refreshComplete');
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.getYearList = function() {
            for (var i = parseInt($scope.createdAt); i <= new Date().getFullYear(); i++) {
                $scope.years.push(i);
            }
        };

        $scope.yearSelected = function(year) {
            $scope.currentYear = year;
            $scope.closePopover();
            $scope.getAllAssignments(year);
        };

        $scope.getAllAssignments($scope.currentYear);
        $scope.getYearList();

    });