'use strict';
angular.module('smartAdminApp').factory('StudentListFactory', function($q, $http, LoginFactory) {

    var URL = LoginFactory.getBaseUrl() + '/secure';

    var factory = {
        selectedStudent: {}
    };

    factory.getAllByCourseBranchSem = function(collegeId, courseId, branchId, semesterId, classId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/student/getAllByCourseBranchSem/' + collegeId + '/' + courseId + '/' + branchId + '/' + semesterId + '/' + classId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getStudentDetails = function(studentId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/student/getById/' + studentId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.deleteStudent = function(obj) {
        var d = $q.defer();
        $http({
            method: 'DELETE',
            url: URL + '/student',
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

    factory.updatePhoneNumber = function(obj) {
        var d = $q.defer();
        $http({
            method: 'PUT',
            url: URL + '/student/updatePhoneNumber',
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

    factory.updateDateOfBirth = function(obj) {
        var d = $q.defer();
        $http({
            method: 'PUT',
            url: URL + '/student/updateDateOfBirth',
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

    factory.resetPassword = function(obj) {
        var d = $q.defer();
        $http({
            method: 'PUT',
            url: URL + '/student/resetPassword',
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

    factory.updatePayment = function(obj) {
        var d = $q.defer();
        $http({
            method: 'PUT',
            url: URL + '/updatePayment',
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

    factory.deletePayment = function(obj) {
        var d = $q.defer();
        $http({
            method: 'DELETE',
            url: URL + '/deletePayment',
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

    return factory;
});