'use strict';
angular.module('smartAdminApp')
    .controller('SelectSubjectController', function($scope, $state, SelectSemesterFactory, SelectSubjectFactory, LoginFactory, ionicToast, DashboardFactory) {

        $scope.courses = [];
        $scope.branches = [];
        $scope.semesters = [];
        $scope.classes = [];
        $scope.subjects = [];

        $scope.loggedInUser = LoginFactory.loggedInUser;

        $scope.selected = {
            course: {
                Id: 8,
                Name: "Teacher Training"
            },
            branch: {
                Id: 20,
                Name: "NSDC",
                CourseId: 8
            },
            semester: "",
            class: "",
            subject: ""
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
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.courseSelected = function(course) {
            $scope.branches = [];
            $scope.semesters = [];
            $scope.classes = [];
            $scope.subjects = [];
            $scope.selected.branch = null;
            $scope.selected.semester = null;
            $scope.selected.class = null;
            $scope.selected.subject = null;
            $scope.getBranches(course.Id);
        };

        $scope.branchSelected = function(branch) {
            $scope.semesters = [];
            $scope.classes = [];
            $scope.subjects = [];
            $scope.selected.semester = null;
            $scope.selected.class = null;
            $scope.selected.subject = null;
            $scope.getSemesters(branch.Id);
        };

        $scope.semesterSelected = function(semester) {
            $scope.classes = [];
            $scope.subjects = [];
            $scope.selected.class = null;
            $scope.selected.subject = null;
            $scope.getClasses(semester.Id);
            $scope.getSubjects(semester.Id);
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

        $scope.getClasses = function(semesterId) {
            SelectSemesterFactory.getAllClasses($scope.selected.branch.Id, semesterId, LoginFactory.loggedInUser.CollegeId, $scope.selected.course.Id, LoginFactory.loggedInUser.UniversityId, LoginFactory.loggedInUser.StateId)
                .then(function(success) {
                    $scope.classes = [];
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.classes = success.data.Data;
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.getSubjects = function(semesterId) {
            SelectSemesterFactory.getAllSubjects($scope.selected.course.Id, $scope.selected.branch.Id, semesterId)
                .then(function(success) {
                    $scope.subjects = [];
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.subjects = success.data.Data;
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.getAllKeywords = function() {
            DashboardFactory.getAllKeywords(LoginFactory.loggedInUser.Type)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.keywords = success.data.Data[0];
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.getAssessments = function() {
            if ($scope.selected.course == "" ||
                $scope.selected.branch == "" ||
                $scope.selected.semester == "" ||
                $scope.selected.class == "" ||
                $scope.selected.subject == "") {
                ionicToast.show('Please select all the options to proceed', 'bottom', false, 2500);
            } else {
                SelectSubjectFactory.selected.course = $scope.selected.course;
                SelectSubjectFactory.selected.branch = $scope.selected.branch;
                SelectSubjectFactory.selected.semester = $scope.selected.semester;
                SelectSubjectFactory.selected.class = $scope.selected.class;
                SelectSubjectFactory.selected.subject = $scope.selected.subject;
                $state.go('menu.smartTestList');
            }
        }

        $scope.getAllKeywords();

        $scope.getSemesters($scope.selected.branch.Id); // 20 is the branch id for NSDC
    });