'use strict';
angular.module('smartAdminApp')
    .controller('PersonalMessagesController', function($scope, $state, $stateParams, PersonalMessagesFactory, ionicToast, LoginFactory, $ionicScrollDelegate, $cordovaInAppBrowser) {

        $scope.messages = [];
        $scope.loggedInUser = LoginFactory.loggedInUser;
        $scope.student = PersonalMessagesFactory.selectedStudent;

        $scope.newMessage = {
            StudentId: $stateParams.StudentId,
            UserId: LoginFactory.loggedInUser.Id,
            Message: ""
        };

        $scope.sendMessage = function() {
            if ($scope.newMessage.Message != "") {
                PersonalMessagesFactory.sendMessage($scope.newMessage)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            ionicToast.show(success.data.Message, 'bottom', false, 2500);
                        } else {
                            $scope.newMessage.Message = "";
                            $scope.getAllMessages();
                        }
                    }, function(error) {
                        ionicToast.show(error, 'bottom', false, 2500);
                    });
            }
        };

        $scope.getAllMessages = function() {
            PersonalMessagesFactory.getAllMessages($stateParams.StudentId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.messages = success.data.Data;
                        for (var i = 0; i < $scope.messages.length; i++) {
                            var str = $scope.messages[i].Message;
                            var urlRegEx = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-]*)?\??(?:[\-\+=&;%@\.\w]*)#?(?:[\.\!\/\\\w]*))?)/g;
                            var result = str.replace(urlRegEx, "<a ng-click=\"launchExternalLink('$1')\">$1</a>");
                            $scope.messages[i].MessageToShow = result;
                        }
                        $ionicScrollDelegate.scrollBottom(true);
                    }
                    $scope.$broadcast('scroll.refreshComplete');
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.launchExternalLink = function(url) {
            var options = {
                location: 'yes',
                clearcache: 'yes',
                toolbar: 'yes'
            };
            $cordovaInAppBrowser.open(url, '_blank', options)
                .then(function(event) {
                    // success
                    console.log(event);
                })
                .catch(function(event) {
                    // error
                    console.log(event);
                });
        };

        $scope.getAllMessages();
    });