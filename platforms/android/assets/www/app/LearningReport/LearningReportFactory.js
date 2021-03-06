'use strict';

angular.module('smartAdminApp').factory('LearningReportFactory', function($q, $http, LoginFactory) {
    var factory = {
        selectedSubject: null
    };

    var URL = LoginFactory.getBaseUrl() + '/secure';

    factory.getTopicsForStudent = function(studentId, subjectId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getTopicsForStudent/' + studentId + '/' + subjectId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    }

    return factory;
});