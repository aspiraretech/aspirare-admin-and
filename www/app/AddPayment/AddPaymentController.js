'use strict';
angular.module('smartAdminApp')
    .controller('AddPaymentController', function($scope, $state, ionicDatePicker, AddPaymentFactory, ionicToast, $ionicHistory) {

        $scope.newPayment = {
            Id: null,
            AdmissionId: AddPaymentFactory.selectedStudent.AdmissionId,
            FeesPaid: null,
            PaymentDate: moment().format('YYYY-MM-DD'),
            PaymentMode: null,
            PaymentModeNumber: null
        };

        var ipObj1 = {
            callback: function(val) { //Mandatory
                $scope.newPayment.PaymentDate = moment(val).format('YYYY-MM-DD');
            },
            from: new Date(2017, 1, 1), //Optional
            to: new Date(2040, 12, 31), //Optional
            inputDate: new Date(), //Optional
            mondayFirst: false, //Optional
            closeOnSelect: true, //Optional
            templateType: 'popup' //Optional
        };

        $scope.openPaymentDatePicker = function() {
            ionicDatePicker.openDatePicker(ipObj1);
        };

        $scope.addPayment = function() {
            if ($scope.newPayment.FeesPaid == undefined || $scope.newPayment.FeesPaid == null ||
                $scope.newPayment.PaymentMode == "" || $scope.newPayment.PaymentMode == null) {
                ionicToast.show('Please enter Fees Paid and Payment Mode to add Payment', 'bottom', false, 2500);
            } else {
                AddPaymentFactory.addPayment($scope.newPayment)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            ionicToast.show(success.data.Message, 'bottom', false, 2500);
                        } else {
                            ionicToast.show('Payment added successfully', 'bottom', false, 2500);
                            $ionicHistory.goBack();
                        }
                    }, function(error) {
                        ionicToast.show(error, 'bottom', false, 2500);
                    });
            }
        };

    });