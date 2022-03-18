'use strict';
angular.module('smartAdminApp')
    .controller('SmartTestListController', function($scope, $state, SelectSubjectFactory, LoginFactory, ionicToast, SmartTestListFactory, $ionicPopup, LessonPlanFactory) {

        $scope.subject = SelectSubjectFactory.selected.subject;
        $scope.loggedInUser = LoginFactory.loggedInUser;

        $scope.smartTests = null;
        $scope.topics = [];

        $scope.getAllSmartTests = function() {
            SmartTestListFactory.getAllSmartTestsForSubject($scope.subject.Id)
                .then(function(success) {
                        $scope.smartTests = [];
                        if (success.data.Code != "S001") {
                            ionicToast.show(success.data.Message, 'bottom', false, 2500);
                        } else {
                            $scope.smartTests = success.data.Data;
                        }
                    },
                    function(error) {
                        ionicToast.show(error, 'bottom', false, 2500);
                    });
        };

        $scope.deleteSmartTest = function(test, $event) {
            $event.stopPropagation();
            var confirmPopup = $ionicPopup.confirm({
                title: 'Delete Smart Assessment',
                template: 'Are you sure you want to delete this Smart Assessment?'
            });
            confirmPopup.then(function(res) {
                if (res) {
                    SmartTestListFactory.deleteSmartTest(test)
                        .then(function(success) {
                            if (success.data.Code != "S001") {
                                ionicToast.show(success.data.Message, 'bottom', false, 2500);
                            } else {
                                ionicToast.show('Smart Assessment deleted Successfully', 'bottom', false, 2500);
                                $scope.getAllSmartTests();
                            }
                        }, function(error) {
                            ionicToast.show(error, 'bottom', false, 2500);
                        });
                }
            });
        };

        $scope.getAllTopicsForSmartTest = function(test) {
            $scope.topics = [];
            SmartTestListFactory.getAllTopicsForSmartTest(test.Id)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.topics = success.data.Data;
                        var alertPopup = $ionicPopup.alert({
                            title: 'Topics',
                            template: $scope.topics.map(function(elem) {
                                return elem.Name;
                            }).join(", ")
                        });
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.getAllSmartTests();
    });