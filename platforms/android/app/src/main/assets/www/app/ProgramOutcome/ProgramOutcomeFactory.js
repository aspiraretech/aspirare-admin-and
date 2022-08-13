'use strict';

angular.module('smartAdminApp').factory('ProgramOutcomeFactory', function($q, $http, LoginFactory) {
    var factory = {};

    var URL = LoginFactory.getBaseUrl() + '/secure';

    factory.getAllPOForBranch = function(collegeId, courseId, branchId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getAllPOForBranch/' + collegeId + '/' + courseId + '/' + branchId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    return factory;
});