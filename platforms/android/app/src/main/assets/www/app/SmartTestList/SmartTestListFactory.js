'use strict';

angular.module('smartAdminApp').factory('SmartTestListFactory', function($q, $http, LoginFactory) {
    var factory = {};

    var URL = LoginFactory.getBaseUrl() + '/secure';

    factory.getAllSmartTestsForSubject = function(subjectId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getAllSmartTestsForSubject/' + subjectId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.deleteSmartTest = function(test) {
        var d = $q.defer();
        $http({
            method: 'DELETE',
            url: URL + '/deleteSmartTest',
            data: test,
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

    factory.getAllTopicsForSmartTest = function(smartTestId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getAllTopicsForSmartTest/' + smartTestId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    return factory;
});