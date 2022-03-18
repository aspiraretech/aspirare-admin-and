'use strict';

angular.module('smartAdminApp').factory('SelectSubjectFactory', function($q, $http, LoginFactory) {
    var factory = {
        selected: {
            course: null,
            branch: null,
            semester: null,
            class: null,
            subject: null
        }
    };

    var URL = LoginFactory.getBaseUrl() + '/secure';

    return factory;
});