'use strict';
angular.module('smartAdminApp')
    .controller('NotificationsController', function($scope, $state, ionicToast, NotificationsFactory, LoginFactory, SelectSemesterFactory, $ionicModal, DashboardFactory) {

        $scope.v1 = false;
        $scope.v2 = false;

        $scope.loggedInUser = LoginFactory.loggedInUser;

        $scope.isModalOpen = false;
        $scope.selected = {
            courseId: null,
            branchId: null,
            semesterId: null,
            classId: null
        };
        $scope.courses = [];
        $scope.branches = [];
        $scope.semesters = [];
        $scope.classes = [];

        $scope.courseName = null;
        $scope.branchName = null;
        $scope.semesterName = null;
        $scope.className = null;
        $scope.keywords = [];

        $scope.notification = {
            Title: "",
            Description: "",
            VideoURL: null,
            ImageURL: null,
            SMSBroadcastAvailable: LoginFactory.loggedInUser.SMSBroadcastAvailable == "1" ? true : false
        };

        $scope.sendFeesNotification = function() {
            var obj = {
                CollegeId: LoginFactory.loggedInUser.CollegeId
            };
            NotificationsFactory.sendFeesNotification(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        ionicToast.show('Notification sent successfully', 'bottom', false, 2500);
                    }
                }, function(error) {
                    ionicToast.show(error.code, 'bottom', false, 2500);
                });
        };

        $scope.sendCustomeNotification = function() {
            NotificationsFactory.sendCustomNotification($scope.notification)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        ionicToast.show('Notification sent successfully', 'bottom', false, 2500);
                    }
                }, function(error) {
                    ionicToast.show(error.code, 'bottom', false, 2500);
                });
        };

        $scope.sendNotificationReminder = function() {
            var obj = {
                CollegeId: LoginFactory.loggedInUser.CollegeId
            }
            NotificationsFactory.sendNotificationReminder(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        ionicToast.show('Notification reminder sent successfully', 'bottom', false, 2500);
                    }
                }, function(error) {
                    ionicToast.show(error.code, 'bottom', false, 2500);
                });
        };

        $scope.toggle = function(val) {
            switch (val) {
                case 1:
                    $scope.v1 = !$scope.v1;
                    if ($scope.v2) {
                        $scope.v2 = !$scope.v2;
                    }
                    if ($scope.v3) {
                        $scope.v3 = !$scope.v3;
                    }
                    break;
                case 2:
                    $scope.v2 = !$scope.v2;
                    if ($scope.v1) {
                        $scope.v1 = !$scope.v1;
                    }
                    if ($scope.v3) {
                        $scope.v3 = !$scope.v3;
                    }
                    break;
                case 3:
                    $scope.v3 = !$scope.v3;
                    if ($scope.v1) {
                        $scope.v1 = !$scope.v1;
                    }
                    if ($scope.v2) {
                        $scope.v2 = !$scope.v2;
                    }
                    break;
            }
        };

        $ionicModal.fromTemplateUrl('app/Notifications/FilterCriteriaModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function() {
            $scope.modal.show();
            $scope.isModalOpen = true;
            $scope.getAllCourses();
            $scope.getAllKeywords();
        };
        $scope.closeModal = function() {
            if ($scope.isModalOpen) {
                $scope.modal.hide();
                $scope.isModalOpen = false;
            }
            $scope.courseName = 'All Selected';
            $scope.branchName = 'All Selected';
            $scope.semesterName = 'All Selected';
            $scope.className = 'All Selected';
            if ($scope.selected.courseId != null) {
                for (var i = 0; i < $scope.courses.length; i++) {
                    if ($scope.courses[i].Id == $scope.selected.courseId) {
                        $scope.courseName = $scope.courses[i].Name;
                    }
                }
            }
            if ($scope.selected.branchId != null) {
                for (var i = 0; i < $scope.branches.length; i++) {
                    if ($scope.branches[i].Id == $scope.selected.branchId) {
                        $scope.branchName = $scope.branches[i].Name;
                    }
                }
            }
            if ($scope.selected.semesterId != null) {
                for (var i = 0; i < $scope.semesters.length; i++) {
                    if ($scope.semesters[i].Id == $scope.selected.semesterId) {
                        $scope.semesterName = $scope.semesters[i].SemesterNumber;
                    }
                }
            }
            if ($scope.selected.classId != null) {
                for (var i = 0; i < $scope.classes.length; i++) {
                    if ($scope.classes[i].Id == $scope.selected.classId) {
                        $scope.className = $scope.classes[i].Name;
                    }
                }
            }
        };
        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });

        $scope.getAllCourses = function() {
            $scope.courses = [];
            var selectedValues = angular.copy($scope.selected);
            SelectSemesterFactory.getAllCourses(LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.courses = success.data.Data;
                        $scope.selected = selectedValues;
                        if ($scope.selected.courseId != null) {
                            $scope.getBranches($scope.selected.courseId);
                        }
                        if ($scope.selected.branchId != null && $scope.selected.courseId != null) {
                            $scope.getSemesters($scope.selected.branchId);
                        }
                        if ($scope.selected.semesterId != null && $scope.selected.branchId != null && $scope.selected.courseId != null) {
                            $scope.getClasses($scope.selected.semesterId);
                        }
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.courseSelected = function(courseId) {
            $scope.branches = [];
            $scope.semesters = [];
            $scope.classes = [];
            $scope.selected.branchId = null;
            $scope.selected.semesterId = null;
            $scope.selected.classId = null;
            if (courseId != null) {
                $scope.getBranches(courseId);
            }
        };

        $scope.branchSelected = function(branchId) {
            $scope.semesters = [];
            $scope.classes = [];
            $scope.selected.semesterId = null;
            $scope.selected.classId = null;
            if (branchId != null) {
                $scope.getSemesters(branchId);
            }
        };

        $scope.semesterSelected = function(semesterId) {
            $scope.classes = [];
            $scope.selected.classId = null;
            if (semesterId != null) {
                $scope.getClasses(semesterId);
            }
        };

        $scope.getBranches = function(courseId) {
            SelectSemesterFactory.getAllBranches(courseId, LoginFactory.loggedInUser.CollegeId)
                .then(function(success) {
                    $scope.branches = [];
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.branches = success.data.Data;
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.getSemesters = function(branchId) {
            SelectSemesterFactory.getAllSemesters(branchId, LoginFactory.loggedInUser.CollegeId, $scope.selected.courseId, LoginFactory.loggedInUser.UniversityId, LoginFactory.loggedInUser.StateId)
                .then(function(success) {
                    $scope.semesters = [];
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.semesters = success.data.Data;
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.getClasses = function(semesterId) {
            SelectSemesterFactory.getAllClasses($scope.selected.branchId, semesterId, LoginFactory.loggedInUser.CollegeId, $scope.selected.courseId, LoginFactory.loggedInUser.UniversityId, LoginFactory.loggedInUser.StateId)
                .then(function(success) {
                    $scope.classes = [];
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.classes = success.data.Data;
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.$watch('notification.Title', function(newVal, oldVal) {
            if (newVal.length > 100) {
                $scope.notification.Title = oldVal;
            }
        });

        $scope.$watch('notification.Description', function(newVal, oldVal) {
            if (newVal.length > 160) {
                $scope.notification.Description = oldVal;
            }
        });

        $scope.sendCustomNotification = function() {
            if ($scope.notification.Title == "" || $scope.notification.Description == "") {
                ionicToast.show('Please enter a title and description to send', 'bottom', false, 2500);
            } else {
                var obj = {
                    Notification: $scope.notification,
                    Target: {
                        CollegeId: LoginFactory.loggedInUser.CollegeId,
                        CourseId: $scope.selected.courseId,
                        BranchId: $scope.selected.branchId,
                        SemesterId: $scope.selected.semesterId,
                        ClassId: $scope.selected.classId
                    }
                }
                NotificationsFactory.sendCustomNotification(obj)
                    .then(function(success) {
                        if (success.data.Code != "S001") {
                            ionicToast.show(success.data.Message, 'bottom', false, 2500);
                        } else {
                            ionicToast.show('Notification sent Successfully', 'bottom', false, 2500);
                            $scope.notification.Title = "";
                            $scope.notification.Description = "";
                        }
                    }, function(error) {
                        ionicToast.show(error, 'bottom', false, 2500);
                    })
            }
        };

        $scope.getAllKeywords = function() {
            DashboardFactory.getAllKeywords(LoginFactory.loggedInUser.Type)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.keywords = success.data.Data[0];
                    }
                    $scope.$broadcast('scroll.refreshComplete');
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };
    });