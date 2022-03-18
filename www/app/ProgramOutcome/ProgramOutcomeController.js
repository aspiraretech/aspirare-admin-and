'use strict';
angular.module('smartAdminApp')
    .controller('ProgramOutcomeController', function($scope, LoginFactory, DashboardFactory, SelectSemesterFactory, ProgramOutcomeFactory, ionicToast) {

        $scope.keywords = DashboardFactory.keywords;
        $scope.selected = {
            courseId: null,
            branchId: null
        };
        $scope.getAllCourses = function() {
            $scope.courses = [];
            var selectedValues = angular.copy($scope.selected);
            SelectSemesterFactory.getAllCourses(LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.courses = success.data.Data;
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.courseSelected = function(courseId) {
            $scope.branches = [];
            $scope.selected.branchId = null;
            $scope.getBranches(courseId);
        };

        $scope.branchSelected = function(branchId) {
            ProgramOutcomeFactory.getAllPOForBranch(LoginFactory.loggedInUser.CollegeId, $scope.selected.courseId, branchId)
                .then(function(success) {
                    $scope.pos = [];
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.pos = success.data.Data;
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.getBranches = function(courseId) {
            SelectSemesterFactory.getAllBranches(courseId, LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    $scope.branches = [];
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.branches = success.data.Data;
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.getAllCourses();
    });