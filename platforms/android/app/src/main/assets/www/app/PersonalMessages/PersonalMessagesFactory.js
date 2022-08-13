'use strict';

angular.module('smartAdminApp').factory('PersonalMessagesFactory', function($q, $http, LoginFactory) {
    var factory = {
        selectedStudent: null
    };

    var URL = LoginFactory.getBaseUrl() + '/secure';

    factory.getAllMessages = function(studentId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/personalMessage/getAllByStudent/' + studentId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.sendMessage = function(message) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/personalMessage',
            data: message,
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