'use strict';

angular.module('smartAdminApp').factory('UsersFactory', function ($q, $http, LoginFactory) {
    var factory = {
        selectedSubject: {}
    };

    var URL = LoginFactory.getBaseUrl() + '/secure';

    factory.getAllUsers = function (collegeId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/user/getAllByCollege/' + collegeId
        }).then(function (success) {
            d.resolve(success);
        }, function (error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getUserById = function (userId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/user/getById/' + userId
        }).then(function (success) {
            d.resolve(success);
        }, function (error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.deleteUser = function (obj) {
        var d = $q.defer();
        $http({
            method: 'DELETE',
            url: URL + '/user',
            data: obj,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function (success) {
            d.resolve(success);
        }, function (error) {
            d.reject(error);
        });
        return d.promise;
    };

    return factory;
});