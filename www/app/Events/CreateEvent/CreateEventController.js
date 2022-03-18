'use strict';
angular.module('smartAdminApp')
    .controller('CreateEventController', function($scope, $state, ionicDatePicker, EventsFactory, LoginFactory, ionicToast, $cordovaCamera, $ionicHistory, $ionicPopup, $ionicSlideBoxDelegate, $ionicModal, $cordovaImagePicker, $acatoImage, $ionicLoading) {

        $scope.newEvent = {
            Id: null,
            Name: "",
            Description: "",
            VideoURL: "",
            EventDate: moment().format('YYYY-MM-DD'),
            CreatedBy: LoginFactory.loggedInUser.Id,
            CollegeId: LoginFactory.loggedInUser.CollegeId,
            Images: []
        };

        $scope.images = [];
        var ipObj1 = {
            callback: function(val) { //Mandatory
                $scope.newEvent.EventDate = moment(val).format('YYYY-MM-DD');
            },
            from: new Date(2017, 0, 1), //Optional
            to: new Date(), //Optional
            inputDate: new Date(), //Optional
            mondayFirst: false, //Optional
            closeOnSelect: true, //Optional
            templateType: 'popup' //Optional
        };

        $scope.openDatePicker = function() {
            ionicDatePicker.openDatePicker(ipObj1);
        };

        $scope.create = function() {
            if ($scope.newEvent.Name == "") {
                ionicToast.show('Please enter name', 'bottom', false, 2500);
            } else {
                if ($scope.newEvent.VideoURL != "") {
                    $scope.newEvent.VideoURL = $scope.convertToEmbedURL($scope.newEvent.VideoURL);
                }
                EventsFactory.createEvent($scope.newEvent)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            ionicToast.show(success.data.Message, 'bottom', false, 2500);
                        } else {
                            ionicToast.show('Created successfully', 'bottom', false, 2500);
                            $ionicHistory.nextViewOptions({
                                disableBack: true
                            });
                            $state.go('menu.events');
                        }
                    }, function(error) {
                        ionicToast.show(error, 'bottom', false, 2500);
                    });
            }
        };

        $scope.pickImages = function() {
            $ionicLoading.show({
                template: '<ion-spinner icon="android"></ion-spinner><div>Loading Images..',
                animation: 'fade-in',
                showBackdrop: false,
            });
            var options = {
                maximumImagesCount: 6,
                quality: 40
            };

            $cordovaImagePicker.getPictures(options)
                .then(function(results) {
                    if (results.length != 0) {
                        var count = 0;
                        for (var i = 0; i < results.length; i++) {
                            $acatoImage.getImageData(results[i]).then(function(imageData) {
                                if ($scope.newEvent.Images.length < 6) {
                                    $scope.newEvent.Images.push({
                                        src: imageData
                                    });
                                    count++;
                                    if (results.length == count) {
                                        $ionicLoading.hide();
                                    }
                                } else {
                                    ionicToast.show('You can only select 6 photos', 'bottom', false, 2500);
                                    $ionicLoading.hide();
                                }
                            }, function(error) {
                                ionicToast.show('There was a problem fetching the photos', 'bottom', false, 2500);
                            });
                        }
                    } else {
                        $ionicLoading.hide();
                    }
                }, function(error) {
                    ionicToast.show('There was a problem fetching the photos', 'bottom', false, 2500);
                });
        };

        $scope.checkPermission = function() {
            cordova.plugins.diagnostic.getPermissionAuthorizationStatus(function(status) {
                switch (status) {
                    case cordova.plugins.diagnostic.runtimePermissionStatus.GRANTED:
                        console.log("Permission granted to use the gallery");
                        $scope.pickImages();
                        break;
                    case cordova.plugins.diagnostic.runtimePermissionStatus.NOT_REQUESTED:
                        console.log("Permission to use the gallery has not been requested yet");
                        $scope.getPermission();
                        break;
                    case cordova.plugins.diagnostic.runtimePermissionStatus.DENIED:
                        ionicToast.show('Permission denied to use gallery!', 'bottom', false, 2500);
                        $scope.getPermission();
                        break;
                    case cordova.plugins.diagnostic.runtimePermissionStatus.DENIED_ALWAYS:
                        ionicToast.show('Permission denied to use gallery!', 'bottom', false, 2500);
                        $scope.getPermission();
                        break;
                }
            }, function(error) {
                console.error("The following error occurred: " + error);
            }, cordova.plugins.diagnostic.runtimePermission.READ_EXTERNAL_STORAGE);
        };

        $scope.getPermission = function() {
            cordova.plugins.diagnostic.requestRuntimePermission(function(status) {
                switch (status) {
                    case cordova.plugins.diagnostic.runtimePermissionStatus.GRANTED:
                        console.log("Permission granted to use the gallery");
                        $scope.pickImages();
                        break;
                    case cordova.plugins.diagnostic.runtimePermissionStatus.NOT_REQUESTED:
                        console.log("Permission to use the gallery has not been requested yet");
                        $scope.checkPermission();
                        break;
                    case cordova.plugins.diagnostic.runtimePermissionStatus.DENIED:
                        ionicToast.show('Permission denied to use gallery!', 'bottom', false, 2500);
                        $scope.checkPermission();
                        break;
                    case cordova.plugins.diagnostic.runtimePermissionStatus.DENIED_ALWAYS:
                        ionicToast.show('Permission denied to use gallery!', 'bottom', false, 2500);
                        $scope.checkPermission();
                        break;
                }
            }, function(error) {
                console.error("The following error occurred: " + error);
            }, cordova.plugins.diagnostic.runtimePermission.READ_EXTERNAL_STORAGE);
        };

        $scope.capture = function(val) {
            var source;
            if ($scope.newEvent.Images.length < 6) {
                if (val == 1) {
                    var options = {
                        quality: 40,
                        destinationType: Camera.DestinationType.DATA_URL,
                        sourceType: Camera.PictureSourceType.CAMERA,
                        encodingType: Camera.EncodingType.JPEG,
                    };
                    $cordovaCamera.getPicture(options)
                        .then(function(image) {
                                var im = {
                                    src: "data:image/jpeg;base64," + image
                                };
                                $scope.newEvent.Images.push(im);
                            },
                            function(err) {
                                console.log(err);
                            });
                } else {
                    // $scope.checkPermission();
                    $scope.pickImages()
                }
            } else {
                ionicToast.show('You can only select 6 photos', 'bottom', false, 2500);
            }
        };

        $scope.$watch('newEvent.Name', function(newVal, oldVal) {
            if (newVal.length > 50) {
                $scope.newEvent.Name = oldVal;
            }
        });

        $scope.$watch('newEvent.VideoURL', function(newVal, oldVal) {
            if (newVal.length > 500) {
                $scope.newEvent.VideoURL = oldVal;
            }
        });

        $scope.$watch('newEvent.Description', function(newVal, oldVal) {
            if (newVal.length > 200) {
                $scope.newEvent.Description = oldVal;
            }
        });

        $scope.convertToEmbedURL = function(url) {
            var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            var match = url.match(regExp);

            if (match && match[2].length == 11) {
                return 'https://www.youtube.com/embed/' + match[2] + '?rel=0&amp;showinfo=0';
            } else {
                return 'error';
            }
        };

        $scope.removeImage = function(index) {
            $scope.newEvent.Images.splice(index, 1);
        };

        $scope.goToSlide = function(index) {
            $scope.modal.show();
            $ionicSlideBoxDelegate.slide(index);
        }

        // Called each time the slide changes
        $scope.slideChanged = function(index) {
            $scope.slideIndex = index;
        };

        $ionicModal.fromTemplateUrl('app/Events/CreateEvent/ImageViewer.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });

        $scope.openModal = function() {
            $ionicSlideBoxDelegate.slide(0);
            $scope.modal.show();
        };

        $scope.closeModal = function() {
            $scope.modal.hide();
        };

    });