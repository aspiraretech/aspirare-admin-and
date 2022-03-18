'use strict';
angular.module('smartAdminApp')
    .controller('LoginController', function($scope, $state, LoginFactory) {
        console.log('login controller');
        $scope.loginData = {
            PhoneNumber: null,
            Password: '',
            DeviceId: null,
            AdminAppVersion: LoginFactory.AdminAppVersion,
            OperatingSystem: ionic.Platform.platform()
        };

        $scope.errorMessage = null;
        $scope.showUpdateButton = false;

        $scope.performLogin = function() {
            LoginFactory.login($scope.loginData)
                .then(function(success) {
                    if (success.data.Code == "E010") {
                        $scope.errorMessage = success.data.Message;
                        $scope.showUpdateButton = true;
                    } else if (success.data.Code != "S001") {
                        $scope.errorMessage = success.data.Message;
                    } else if (success.data.Data[0].Role != 'ADMIN') {
                        $scope.errorMessage = 'Login restricted to Administrators. Please download FindInbox Faculty App to login.';
                    } else {
                        $scope.errorMessage = null;
                        $scope.showUpdateButton = false;
                        LoginFactory.colleges = success.data.Data;
                        LoginFactory.loginCollege(success.data.Data[0]);
                        $state.go("menu.dashboard");
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.login = function() {
            if ($scope.loginData.PhoneNumber == undefined || $scope.loginData.PhoneNumber == "") {
                $scope.errorMessage = 'Enter a valid Phone Number';
            } else if ($scope.loginData.Password == undefined || $scope.loginData.Password == "") {
                $scope.errorMessage = 'Enter Password';
            } else {
                $scope.performLogin();
            }
        };
        if (typeof(FCMPlugin) != 'undefined') {
            FCMPlugin.getToken(function(token) {
                LoginFactory.DeviceId = token;
                cordova.getAppVersion(function(version) {
                    LoginFactory.AdminAppVersion = version;
                    $scope.loginData.DeviceId = LoginFactory.DeviceId;
                    $scope.loginData.AdminAppVersion = LoginFactory.AdminAppVersion;
                    if (localStorage.getItem("isLoggedIn")) {
                        $scope.loginData.PhoneNumber = parseInt(localStorage.getItem("PhoneNumber"));
                        $scope.loginData.Password = localStorage.getItem("Password");
                        $scope.login();
                    }
                });
            });
        }

        $scope.update = function() {
            window.location.href = "https://play.google.com/store/apps/details?id=com.findinboxAdmin.www";
        };
    });