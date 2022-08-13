'use strict';

angular.module('smartAdminApp').factory('SelectClassFactory', function($q, $http, LoginFactory) {
    var factory = {
        selectedUser: null,
        selected: {
            subject: null,
            class: null
        }
    };

    var URL = LoginFactory.getBaseUrl() + '/secure';

    factory.getAllSubjectsForUser = function(userId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/subject/getAllByUser/' + userId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllSubjectsForSemesterAndUser = function(courseId, branchId, semesterId, userId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/subject/getAllBySemesterAndUser/' + courseId + '/' + branchId + '/' + semesterId + '/' + userId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getAllClassesForSubject = function(subjectId, userId, isElective) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/class/getAllBySubject/' + subjectId + '/' + userId + '/' + isElective
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    return factory;
});