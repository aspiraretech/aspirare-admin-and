'use strict';
angular.module('smartAdminApp')
    .controller('AnnualPerformanceController', function($scope, $state, ionicToast, LoginFactory, StudentListFactory, SelectSemesterFactory, AnnualPerformanceFactory, DashboardFactory, LearningReportFactory, StudentAttendanceFactory) {

        $scope.loggedInUser = LoginFactory.loggedInUser;

        $scope.student = StudentListFactory.selectedStudent;
        $scope.average = 0;
        $scope.tests = [];
        $scope.keywords = DashboardFactory.keywords;
        $scope.currentSubject = null;

        $scope.attendanceStatistics = {};
        $scope.averageRating = 0;
        $scope.graph = {
            color: "#e33e2b"
        };
        $scope.options = {
            initialSlide: 0,
            onInit: function(swiper) {
                $scope.swiper = swiper;
            },
            onSlideChangeEnd: function(swiper) {
                $scope.slideChanged(swiper.activeIndex);
            }
        };

        $scope.getMarksStatistics = function() {
            var obj = {
                StudentId: $scope.student.Id,
                ClassId: $scope.student.ClassId
            }
            AnnualPerformanceFactory.getAllSubjectStatsForStudent(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        var avg_from_exam = (success.data.Data.AverageFromExam == null) ? 0 : success.data.Data.AverageFromExam;
                        var avg_from_test = (success.data.Data.AverageFromTest == null) ? 0 : success.data.Data.AverageFromTest;
                        var avg_from_quiz = (success.data.Data.AverageFromQuiz == null) ? 0 : success.data.Data.AverageFromQuiz;
                        $scope.average = AnnualPerformanceFactory.calculateAverageWithWeightage(avg_from_test, avg_from_exam, avg_from_quiz);
                        if ($scope.average >= 75) {
                            $scope.graph.color = "#2ba14b";
                        } else if ($scope.average >= 50 && $scope.average < 75) {
                            $scope.graph.color = "#f1b500";
                        } else {
                            $scope.graph.color = "#e33e2b";
                        }
                        $scope.getAllSubjects();
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.getAllAttendanceStatistics = function() {
            for (var i = 0; i < $scope.subjects.length; i++) {
                getStats(i);
            }
        };

        $scope.getAllSubjects = function() {
            AnnualPerformanceFactory.getAllSubjects(SelectSemesterFactory.selected.course.Id, SelectSemesterFactory.selected.branch.Id, SelectSemesterFactory.selected.semester.Id, $scope.student.Id)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.subjects = success.data.Data;
                        if ($scope.loggedInUser.PackageCode == 'LM') {
                            $scope.getAllAttendanceStatistics();
                        }
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.slideChanged = function(index) {
            if (index == 0) {
                $scope.getMarksStatistics();
            } else {
                $scope.currentSubject = $scope.subjects[index - 1];

                var obj = {
                    SubjectId: $scope.currentSubject.Id,
                    StudentId: $scope.student.Id,
                    ClassId: $scope.student.ClassId
                }
                AnnualPerformanceFactory.getSubjectStatsForStudent(obj)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            ionicToast.show(success.data.Message, 'bottom', false, 2500);
                        } else {
                            var avg_from_exam = (success.data.Data.AverageFromExam == null) ? 0 : success.data.Data.AverageFromExam;
                            var avg_from_test = (success.data.Data.AverageFromTest == null) ? 0 : success.data.Data.AverageFromTest;
                            var avg_from_quiz = (success.data.Data.AverageFromQuiz == null) ? 0 : success.data.Data.AverageFromQuiz;
                            $scope.average = AnnualPerformanceFactory.calculateAverageWithWeightage(avg_from_test, avg_from_exam, avg_from_quiz);
                            if ($scope.average >= 75) {
                                $scope.graph.color = "#2ba14b";
                            } else if ($scope.average >= 50 && $scope.average < 75) {
                                $scope.graph.color = "#f1b500";
                            } else {
                                $scope.graph.color = "#e33e2b";
                            }
                        }
                    }, function(error) {
                        ionicToast.show(error, 'bottom', false, 2500);
                    });

                AnnualPerformanceFactory.getMarksStatistics($scope.currentSubject.Id, $scope.student.ClassId, $scope.student.Id)
                    .then(function(success) {
                        $scope.tests = [];
                        if (success.data.Code != "S001") {
                            ionicToast.show(success.data.Message, 'bottom', false, 2500);
                        } else {
                            $scope.tests = success.data.Data;
                        }
                    }, function(error) {
                        ionicToast.show(error, 'bottom', false, 2500);
                    });
                AnnualPerformanceFactory.getAttendanceStatistics($scope.subjects[index - 1].Id, $scope.student.Id)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            ionicToast.show(success.data.Message, 'bottom', false, 2500);
                        } else {
                            $scope.attendanceStatistics = success.data.Data;
                        }
                    }, function(error) {
                        ionicToast.show(error, 'bottom', false, 2500);
                    });
            }
        };

        var getStats = function(i) {
            StudentAttendanceFactory.getAttendanceStatistics($scope.subjects[i].Id, $scope.student.Id)
                .then(function(success) {
                    $scope.subjects[i].AttendanceStatistics = success.data.Data;
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.studentProfile = function() {
            $state.go('menu.studentDetails', { studentId: $scope.student.Id });
        };

        $scope.learningReport = function() {
            LearningReportFactory.selectedSubject = $scope.currentSubject;
            $state.go('menu.learningReport')
        };

        $scope.studentAttendance = function() {
            StudentAttendanceFactory.selected.subject = $scope.currentSubject;
            $state.go('menu.studentAttendance');
        };

        $scope.gotoAttendance = function(subject) {
            StudentAttendanceFactory.selected.subject = subject;
            $state.go('menu.studentAttendance');
        };

        if ($scope.loggedInUser.PackageCode != 'LM') {
            $scope.getMarksStatistics();
        }
        $scope.getAllSubjects();
    });