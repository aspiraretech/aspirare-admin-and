'use strict';

angular.module('smartAdminApp').factory('RoutesFactory', function($q, $http, LoginFactory) {
    var factory = {
        selectedRoute: {}
    };

    var URL = LoginFactory.getBaseUrl() + '/secure';

    factory.getAllRoutes = function(collegeId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getAllRoutes/' + collegeId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.getRouteByStudent = function(routeId) {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: URL + '/getRouteById/' + routeId
        }).then(function(success) {
            d.resolve(success);
        }, function(error) {
            d.reject(error);
        });
        return d.promise;
    };

    factory.createRoute = function(route) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: URL + '/route',
            data: route,
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

    factory.deleteRoute = function(route) {
        var d = $q.defer();
        $http({
            method: 'DELETE',
            url: URL + '/route',
            data: route,
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