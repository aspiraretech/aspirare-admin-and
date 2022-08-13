'use strict';
angular.module('smartAdminApp')
    .controller('SelectSemesterController', function($scope, $state, SelectSemesterFactory, LoginFactory, ionicToast, DashboardFactory, $ionicPopup) {

        $scope.courses = [];
        $scope.branches = [];
        $scope.semesters = [];
        $scope.students = [];
        $scope.totalFees = 0;

        $scope.loggedInUser = LoginFactory.loggedInUser;
        LoginFactory.loggedInUser.PackageCode = LoginFactory.loggedInUser.OldPackageCode;

        $scope.selected = {
            course: "",
            branch: "",
            semester: ""
        };

        $scope.keywords = [];

        $scope.getAllCourses = function() {
            $scope.courses = [];
            SelectSemesterFactory.getAllCourses(LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.courses = success.data.Data;
                        $scope.getTotalFees()
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.getTotalFees = function() {
            SelectSemesterFactory.getAllFeesCollected(LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    $scope.feesCollected = [];
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.feesCollected = success.data.Data.FeesCollected;
                        $scope.studentCount = success.data.Data.StudentCount;
                        $scope.calculateTotalFees();
                        $scope.$broadcast('scroll.refreshComplete');
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.courseSelected = function(course) {
            $scope.branches = [];
            $scope.semesters = [];
            $scope.selected.branch = null;
            $scope.selected.semester = null;
            $scope.getBranches(course.Id);
        };

        $scope.branchSelected = function(branch) {
            $scope.semesters = [];
            $scope.selected.semester = null;
            $scope.getSemesters(branch.Id);
        };

        $scope.getAllStudents = function() {
            if ($scope.selected.course == "" || $scope.selected.branch == "" || $scope.selected.semester == "" ||
                $scope.selected.course == null || $scope.selected.branch == null || $scope.selected.semester == null) {
                ionicToast.show('Please choose all the fields to view students', 'bottom', false, 2500);
            } else {
                SelectSemesterFactory.selected.course = $scope.selected.course;
                SelectSemesterFactory.selected.branch = $scope.selected.branch;
                SelectSemesterFactory.selected.semester = $scope.selected.semester;
                $state.go('menu.students');
            }
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

        $scope.getSemesters = function(branchId) {
            SelectSemesterFactory.getAllSemesters(branchId, LoginFactory.loggedInUser.CollegeId, $scope.selected.course.Id, LoginFactory.loggedInUser.UniversityId, LoginFactory.loggedInUser.StateId)
                .then(function(success) {
                    $scope.semesters = [];
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.semesters = success.data.Data;
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.getInstallMetrics = function() {
            SelectSemesterFactory.getInstallMetrics(LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    $scope.installMetrics = [];
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.installMetrics = success.data.Data;
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.calculateTotalFees = function() {
            $scope.totalFees = 0;
            $scope.collectedFees = 0;
            for (var i = 0; i < $scope.feesCollected.length; i++) {
                $scope.totalFees += parseFloat($scope.feesCollected[i].TotalFees);
                $scope.collectedFees += $scope.feesCollected[i].FeesPaid;
            }
        };

        $scope.getAllKeywords = function() {
            DashboardFactory.getAllKeywords(LoginFactory.loggedInUser.Type)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.keywords = success.data.Data[0];
                    }
                    $scope.$broadcast('scroll.refreshComplete');
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.showBankInfo = function() {
            var alertPopup = $ionicPopup.alert({
                title: 'Bank Information',
                template: $scope.loggedInUser.BankAccountInfo
            });
        };

        $scope.sendInstallReminder = function() {
            var obj = {
                Students: $scope.installMetrics.NotInstalled,
                CollegeName: $scope.loggedInUser.Nickname
            };
            SelectSemesterFactory.sendInstallReminder(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        ionicToast.show('Reminder sent successfully', 'bottom', false, 2500);
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.getAllKeywords();

        $scope.getAllCourses();

        $scope.getInstallMetrics();
    });