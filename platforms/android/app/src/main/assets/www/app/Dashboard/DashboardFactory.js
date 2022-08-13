'use strict';

angular.module('smartAdminApp').factory('DashboardFactory', function($q, $http, LoginFactory) {
    var factory = {
        keywords: null
    };

    var URL = LoginFactory.getBaseUrl() + '/secure';

    factory.getCollegeAttendanceStatistics = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getCollegeAttendanceStatistics',
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

    factory.getCollegeMarksStatistics = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getCollegeMarksStatisticsByIndexing',
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

    factory.getAllKeywords = function(collegeType) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getAllKeywords/' + collegeType
        }).then(function(success) {
            factory.keywords = success.data.Data[0];
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    return factory;
});