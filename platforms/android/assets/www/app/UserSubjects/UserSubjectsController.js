'use strict';
angular.module('smartAdminApp')
    .controller('UserSubjectsController', function($scope, $state, $stateParams, UsersFactory, ionicToast, DashboardFactory) {

        $scope.user = [];

        $scope.keywords = DashboardFactory.keywords;

        $scope.getSubjectsForUser = function() {
            UsersFactory.getUserById($stateParams.UserId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.user = success.data.Data;
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.subjectSelected = function(subject) {
            UsersFactory.selectedSubject = subject;
            $state.go('menu.lessonPlan');
        };

        $scope.getSubjectsForUser();
    });