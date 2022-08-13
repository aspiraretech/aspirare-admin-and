'use strict';
angular.module('smartAdminApp')
    .controller('StudentListController', function($scope, $state, LoginFactory, StudentListFactory, SelectSemesterFactory, ionicToast, $ionicPopover) {

        $scope.students = [];
        $scope.classes = [];

        if (SelectSemesterFactory.selected.course.Id == 1) { //if course is a preschool
            LoginFactory.loggedInUser.PackageCode = 'LM';
        }

        $scope.getClasses = function() {
            SelectSemesterFactory.getAllClasses(SelectSemesterFactory.selected.branch.Id, SelectSemesterFactory.selected.semester.Id, LoginFactory.loggedInUser.CollegeId, SelectSemesterFactory.selected.course.Id, LoginFactory.loggedInUser.UniversityId, LoginFactory.loggedInUser.StateId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.classes = success.data.Data;
                        $scope.getAllStudents($scope.classes[0]);
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.getAllStudents = function(cls) {
            $scope.closePopover();
            SelectSemesterFactory.selected.class = cls;
            StudentListFactory.getAllByCourseBranchSem(LoginFactory.loggedInUser.CollegeId, SelectSemesterFactory.selected.course.Id, SelectSemesterFactory.selected.branch.Id, SelectSemesterFactory.selected.semester.Id, cls.Id)
                .then(function(success) {
                    $scope.students = [];
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.students = success.data.Data;
                    }
                    $scope.$broadcast('scroll.refreshComplete');
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.studentSelected = function(student) {
            StudentListFactory.selectedStudent = student;
            $state.go('menu.annualPerformance');
        };

        $ionicPopover.fromTemplateUrl('app/StudentList/SelectClassTemplate.html', {
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

        $scope.getClasses();
    });