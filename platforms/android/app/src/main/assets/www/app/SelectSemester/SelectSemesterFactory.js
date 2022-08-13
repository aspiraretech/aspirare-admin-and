'use strict';

angular.module('smartAdminApp').factory('SelectSemesterFactory', function($q, $http, LoginFactory) {
    var factory = {
        selected: {
            course: {},
            branch: {},
            semester: {},
            class: {}
        }
    };

    var URL = LoginFactory.getBaseUrl() + '/secure';

    factory.getAllCourses = function(collegeId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/course/getAllByCollege/' + collegeId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllBranches = function(courseId, collegeId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/branch/getAllByCourse/' + courseId + '/' + collegeId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllSemesters = function(branchId, collegeId, courseId, universityId, stateId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/semester/getAllByBranch/' + branchId + '/' + collegeId + '/' + courseId + '/' + universityId + '/' + stateId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getInstallMetrics = function(collegeId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getInstallMetrics/' + collegeId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllFeesCollected = function(collegeId, courseId, branchId, semesterId, classId) {
        var obj = {
            CollegeId: collegeId,
            CourseId: courseId,
            BranchId: branchId,
            SemesterId: semesterId,
            ClassId: classId
        };
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/student/getAllFeesCollected',
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

    factory.getAllClasses = function(branchId, semesterId, collegeId, courseId, universityId, stateId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/class/getAllBySemester/' + branchId + '/' + semesterId + '/' + collegeId + '/' + courseId + '/' + universityId + '/' + stateId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllSubjects = function(courseId, branchId, semesterId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/subject/getAllBySemester/' + courseId + '/' + branchId + '/' + semesterId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.sendInstallReminder = function(notInstalled) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/sendInstallReminder',
            data: notInstalled,
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

    return factory;
});