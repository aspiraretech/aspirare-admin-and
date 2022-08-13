// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('smartAdminApp', ['ionic',
    'ionic-datepicker',
    'angular-svg-round-progressbar',
    'ionic-toast',
    'ngCordova',
    'ion-gallery',
    'highcharts-ng',
    'angular.filter',
    '720kb.tooltips',
    'ion-floating-menu'
])

.run(function($ionicPlatform, $rootScope, $ionicLoading, $state, $ionicHistory, $cordovaNetwork, ionicToast, LoginFactory) {
    $ionicPlatform.ready(function() {
        var isPaused = false;
        if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
        $ionicPlatform.registerBackButtonAction(function(e) {
            if ($state.is('menu.dashboard') || $state.is('selectClass') || $state.is('login')) {
                if (confirm('Are you sure you want to Exit?')) {
                    ionic.Platform.exitApp();
                    return false;
                } else {
                    e.preventDefault();
                    return false;
                }
            } else if ($state.is('menu.calendarList') || $state.is('menu.selectSemester') || $state.is('menu.calendarList') || $state.is('menu.events') || $state.is('menu.enquiries') || $state.is('menu.users') || $state.is('menu.expenses') || $state.is('menu.notifications') || $state.is('menu.assignmentList') || $state.is('menu.personalMessages') || $state.is('menu.routeList') || $state.is('menu.selectSubject')) {
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $state.go('menu.dashboard');
            } else {
                $ionicHistory.goBack();
            }
        }, 100);

        $rootScope.$on('$cordovaNetwork:online', function(event, networkState) {
            $ionicLoading.hide();
        });
        $rootScope.$on('$cordovaNetwork:offline', function(event, networkState) {
            $ionicLoading.show({
                template: '<ion-spinner icon="android"></ion-spinner><div>Waiting for network connection...',
                animation: 'fade-in',
                showBackdrop: false,
            });
        });

        if (!$cordovaNetwork.isOnline()) {
            ionicToast.show('There is no network connection..', 'bottom', false, 2500);
        }

        document.addEventListener("pause", function() {
            isPaused = true;
        }, false);

        FCMPlugin.onNotification(
            function(data) {
                if (data.wasTapped) {
                    switch (data.notCode) {
                        case "N001":
                            $ionicHistory.nextViewOptions({
                                disableBack: true
                            });
                            $state.go("menu.assignmentList");
                            break;
                        case "N006":
                            $ionicHistory.nextViewOptions({
                                disableBack: true
                            });
                            $state.go('menu.personalMessages', { StudentId: data.studentId });
                            break;
                    }
                } else {
                    //Notification was received in foreground. Maybe the user needs to be notified. 
                    console.log(JSON.stringify(data));
                }
                $rootScope.$broadcast('userLoggedIn');
                if (isPaused) {
                    if (data.notCode == "N005") {
                        $state.go(LoginFactory.NotificationState, { toStatistics: 1 });
                    } else if (data.notCode == "N007") {
                        $state.go(LoginFactory.NotificationState, { toStatistics: 2 });
                    } else {
                        $state.go(LoginFactory.NotificationState);
                    }
                }
            },
            function(msg) {
                console.log('onNotification callback successfully registered: ' + msg);
            },
            function(err) {
                console.log('Error registering onNotification callback: ' + err);
            });

    });

    $rootScope.$on('loading:show', function() {
        $ionicLoading.show({
            template: '<ion-spinner icon="android"></ion-spinner>',
            animation: 'fade-in',
            showBackdrop: false,
        });
    });

    $rootScope.$on('loading:hide', function() {
        $ionicLoading.hide();
    });

}).config(function($stateProvider, $urlRouterProvider, $httpProvider, ionGalleryConfigProvider, $ionicConfigProvider) {

    ionGalleryConfigProvider.setGalleryConfig({
        action_label: 'Close'
    });

    $ionicConfigProvider.backButton.text('');
    $ionicConfigProvider.views.swipeBackEnabled(false);

    $httpProvider.interceptors.push(function($rootScope) {
        return {
            request: function(config) {
                $rootScope.$broadcast('loading:show');
                return config;
            },
            requestError: function(requestError) {
                $rootScope.$broadcast('loading:hide');
                return requestError;
            },
            response: function(response) {
                $rootScope.$broadcast('loading:hide');
                return response;
            },
            responseError: function(rejection) {
                $rootScope.$broadcast('loading:hide');
                return rejection;
            }
        }
    });

    $stateProvider
        .state('login', {
            url: '/login',
            cache: false,
            templateUrl: 'app/Login/Login.html',
            controller: 'LoginController'
        })
        .state('menu', {
            abstract: true,
            templateUrl: 'app/Sidemenu/Sidemenu.html',
            controller: 'SidemenuController'
        })
        .state('menu.dashboard', {
            url: '/dashboard',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/Dashboard/Dashboard.html',
                    controller: 'DashboardController'
                }
            }
        })
        .state('menu.events', {
            url: '/events',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/Events/EventList/EventList.html',
                    controller: 'EventListController'
                }
            }
        })
        .state('menu.createEvent', {
            url: '/createEvent',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/Events/CreateEvent/CreateEvent.html',
                    controller: 'CreateEventController'
                }
            }
        })
        .state('menu.eventDetails', {
            url: '/eventDetails',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/Events/EventDetails/EventDetails.html',
                    controller: 'EventDetailsController'
                }
            }
        })
        .state('menu.personalMessages', {
            url: '/personalMessages/:StudentId',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/PersonalMessages/PersonalMessages.html',
                    controller: 'PersonalMessagesController'
                }
            }
        })
        .state('menu.users', {
            url: '/users',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/Users/Users.html',
                    controller: 'UsersController'
                }
            }
        })
        .state('menu.enquiries', {
            url: '/enquiries',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/Enquiries/EnquiryList/Enquiries.html',
                    controller: 'EnquiriesController'
                }
            }
        })
        .state('menu.addEnquiry', {
            url: '/addEnquiry/:isEdit',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/Enquiries/AddEnquiry/AddEnquiry.html',
                    controller: 'AddEnquiryController'
                }
            }
        })
        .state('menu.selectSemester', {
            url: '/selectSemester',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/SelectSemester/SelectSemester.html',
                    controller: 'SelectSemesterController'
                }
            }
        })
        .state('menu.selectSubject', {
            url: '/selectSubject',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/SelectSubject/SelectSubject.html',
                    controller: 'SelectSubjectController'
                }
            }
        })
        .state('menu.students', {
            url: '/students',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/StudentList/StudentList.html',
                    controller: 'StudentListController'
                }
            }
        })
        .state('menu.studentDetails', {
            url: '/studentDetails/:studentId',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/StudentDetails/StudentDetails.html',
                    controller: 'StudentDetailsController'
                }
            }
        })
        .state('menu.expenses', {
            url: '/expenses',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/Expenses/ExpenseList/Expenses.html',
                    controller: 'ExpensesController'
                }
            }
        })
        .state('menu.addExpense', {
            url: '/addExpense',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/Expenses/AddExpense/AddExpense.html',
                    controller: 'AddExpenseController'
                }
            }
        })
        .state('menu.calendarList', {
            url: '/calendarList',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/Calendar/CalendarList/CalendarList.html',
                    controller: 'CalendarListController'
                }
            }
        })
        .state('menu.addCalendarEvent', {
            url: '/addCalendarEvent',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/Calendar/AddCalendarEvent/AddCalendarEvent.html',
                    controller: 'AddCalendarEventController'
                }
            }
        })
        .state('menu.userSubjects', {
            url: '/userSubjects/:UserId',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/UserSubjects/UserSubjects.html',
                    controller: 'UserSubjectsController'
                }
            }
        })
        .state('menu.lessonPlan', {
            url: '/lessonPlan',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/LessonPlan/LessonPlan.html',
                    controller: 'LessonPlanController'
                }
            }
        })
        .state('menu.notifications', {
            url: '/notifications',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/Notifications/Notifications.html',
                    controller: 'NotificationsController'
                }
            }
        })
        .state('menu.assignmentList', {
            url: '/assignmentList',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/Assignments/AssignmentList/AssignmentList.html',
                    controller: 'AssignmentListController'
                }
            }
        })
        .state('menu.editAssignment', {
            url: '/editAssignment',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/Assignments/EditAssignment/EditAssignment.html',
                    controller: 'EditAssignmentController'
                }
            }
        })
        .state('menu.routeList', {
            url: '/routeList',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/Routes/RouteList/RouteList.html',
                    controller: 'RouteListController'
                }
            }
        })
        .state('menu.createRoute', {
            url: '/createRoute',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/Routes/CreateRoute/CreateRoute.html',
                    controller: 'CreateRouteController'
                }
            }
        })
        .state('menu.routeDetails', {
            url: '/routeDetails',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/Routes/RouteDetails/RouteDetails.html',
                    controller: 'RouteDetailsController'
                }
            }
        })
        .state('menu.annualPerformance', {
            url: '/annualPerformance',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/AnnualPerformance/AnnualPerformance.html',
                    controller: 'AnnualPerformanceController'
                }
            }
        })
        .state('menu.addPayment', {
            url: '/addPayment',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/AddPayment/AddPayment.html',
                    controller: 'AddPaymentController'
                }
            }
        })
        .state('menu.smartTestList', {
            url: '/smartTestList',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/SmartTestList/SmartTestList.html',
                    controller: 'SmartTestListController'
                }
            }
        })
        .state('menu.createSmartTest', {
            url: '/createSmartTest',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/CreateSmartTest/CreateSmartTest.html',
                    controller: 'CreateSmartTestController'
                }
            }
        })
        .state('menu.learningReport', {
            url: '/learningReport/:subjectId',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/LearningReport/LearningReport.html',
                    controller: 'LearningReportController'
                }
            }
        })
        .state('menu.studentAttendance', {
            url: '/studentAttendance',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/StudentAttendance/StudentAttendance.html',
                    controller: 'StudentAttendanceController'
                }
            }
        })
        .state('menu.attendanceList', {
            url: '/attendanceList',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/AttendanceList/AttendanceList.html',
                    controller: 'AttendanceListController'
                }
            }
        })
        .state('menu.selectClass', {
            url: '/selectClass',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/SelectClass/SelectClass.html',
                    controller: 'SelectClassController'
                }
            }
        })
        .state('menu.showIndex', {
            url: '/showIndex',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/ShowIndex/ShowIndex.html',
                    controller: 'ShowIndexController'
                }
            }
        })
        .state('menu.takeAttendance', {
            url: '/takeAttendance',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/TakeAttendance/TakeAttendance.html',
                    controller: 'TakeAttendanceController'
                }
            }
        })
        .state('menu.programOutcome', {
            url: '/programOutcome',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'app/ProgramOutcome/ProgramOutcome.html',
                    controller: 'ProgramOutcomeController'
                }
            }
        });

    $urlRouterProvider.otherwise('/login');

});