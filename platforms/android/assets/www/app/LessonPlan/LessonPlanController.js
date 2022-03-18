'use strict';
angular.module('smartAdminApp')
    .controller('LessonPlanController', function($scope, $state, UsersFactory, LessonPlanFactory, ionicToast, ionicDatePicker) {

        $scope.subject = UsersFactory.selectedSubject;

        $scope.chapters = [];

        $scope.dateRange = {
            startDate: moment().subtract(1, 'year').toISOString(),
            endDate: moment().toISOString()
        };

        $scope.getLessonPlan = function() {
            var obj = {
                SubjectIds: [UsersFactory.selectedSubject.Id],
                ClassIds: [UsersFactory.selectedSubject.ClassId],
                DateRange: $scope.dateRange
            };
            LessonPlanFactory.getLessonPlan(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.chapters = success.data.Data;
                    }
                    $scope.$broadcast('scroll.refreshComplete');
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                })
        };

        $scope.getLessonPlan();

    });