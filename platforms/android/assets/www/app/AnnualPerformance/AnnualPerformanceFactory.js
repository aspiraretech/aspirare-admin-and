'use strict';

angular.module('smartAdminApp').factory('AnnualPerformanceFactory', function($q, $http, LoginFactory) {
    var factory = {};

    var URL = LoginFactory.getBaseUrl() + '/secure';

    factory.getStudentMarksStatisticsForAllSubjects = function(classId, studentId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getStudentAcademicStatisticsByIndexing/' + classId + '/' + studentId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllSubjectStatsForStudent = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getAllSubjectStatsForStudent',
            data: obj,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getSubjectStatsForStudent = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getSubjectStatsForStudent',
            data: obj,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllSubjects = function(courseId, branchId, semesterId, studentId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/subject/getAllBySemesterAndStudent/' + courseId + '/' + branchId + '/' + semesterId + '/' + studentId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getMarksStatistics = function(subjectId, classId, studentId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getStudentMarksStatisticsNew/' + subjectId + '/' + classId + '/' + studentId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getMarksStatisticsForOBE = function(subjectId, classId, studentId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getStudentMarksStatisticsForOBE/' + subjectId + '/' + classId + '/' + studentId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAttendanceStatistics = function(subjectId, studentId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getStudentAttendanceStatistics/' + subjectId + '/' + studentId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.calculateAverageWithWeightage = function(avg_of_tests, avg_of_exam, avg_of_quiz) {
        var average;
        if (avg_of_exam == 0) { // if there are no final exams
            if (avg_of_tests != 0 && avg_of_quiz != 0) { // both quiz and test exist
                average = (avg_of_tests * 0.9) + (avg_of_quiz * 0.1);
            } else {
                if (avg_of_tests == 0) { // if there are no tests
                    average = avg_of_quiz; // 100% of quiz
                } else {
                    average = avg_of_tests; // 100% of tests
                }
            }
        } else {
            if (avg_of_tests != 0 && avg_of_quiz != 0) { // if there are tests and quizzes and exam
                average = (((avg_of_tests * 0.4) + (avg_of_exam * 0.6)) * 0.9) + (avg_of_quiz * 0.1); // 90%(40% of tests + 60% of exam) + 10%(quiz)
            } else {
                if (avg_of_tests == 0) { // if there are no tests
                    average = (avg_of_quiz * 0.1) + (avg_of_exam * 0.9); // 10% of quiz + 90% of final exam
                } else {
                    average = (avg_of_tests * 0.4) + (avg_of_exam * 0.6); // 40% of tests + 60% of final exam
                }
            }
        }
        return average;
    };

    return factory;
});