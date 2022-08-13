'use strict';

angular.module('smartAdminApp').factory('LessonPlanFactory', function($q, $http, LoginFactory) {
    var factory = {};

    var URL = LoginFactory.getBaseUrl() + '/secure';

    factory.getLessonPlan = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getLessonPlan',
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

    factory.getLessonPlanForSmartTest = function(obj) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/getLessonPlanForSmartTest',
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