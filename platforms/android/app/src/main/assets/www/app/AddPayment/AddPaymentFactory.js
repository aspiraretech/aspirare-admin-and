'use strict';

angular.module('smartAdminApp').factory('AddPaymentFactory', function($q, $http, LoginFactory) {
    var factory = {
        selectedStudent: null
    };

    var URL = LoginFactory.getBaseUrl() + '/secure';

    factory.addPayment = function(payment) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/addPayment',
            data: payment,
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