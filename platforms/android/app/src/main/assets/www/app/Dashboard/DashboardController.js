'use strict';
angular.module('smartAdminApp')
    .controller('DashboardController', function($scope, $state, LoginFactory, DashboardFactory, ionicToast, $ionicPopup, $ionicModal, SelectSemesterFactory, $ionicPopover, $rootScope) {

        $rootScope.$broadcast('userLoggedIn');
        $scope.marksStatistics = [];
        $scope.attendanceStatistics = [];
        $scope.graph = {
            color: ""
        };
        $scope.colleges = LoginFactory.colleges;
        $scope.selectedCollege = LoginFactory.loggedInUser;
        $scope.selected = {
            collegeId: ""
        };
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
        $scope.keywords = [];
        $scope.studentCount = 0;

        $ionicPopover.fromTemplateUrl('app/Dashboard/SelectCollegeTemplate.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.popover = popover;
        });

        $scope.openPopover = function($event) {
            $scope.popover.show($event);
        };

        $scope.closePopover = function() {
            $scope.popover.hide();
        };

        $scope.attendance = {
            ChartConfig: {
                chart: {
                    renderTo: 'attendanceChart'
                },
                title: {
                    text: ''
                },
                xAxis: {
                    title: {
                        text: 'Date Range'
                    },
                    categories: $scope.attendanceStatistics.Dates
                },
                yAxis: {
                    title: {
                        text: 'Percentage'
                    }
                },
                series: [{
                    name: "Attendance",
                    data: $scope.attendanceStatistics.Percentages
                }]
            }
        }

        $scope.courseName = null;
        $scope.branchName = null;
        $scope.semesterName = null;
        $scope.className = null;

        $ionicModal.fromTemplateUrl('app/Dashboard/FilterCriteriaModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function() {
            $scope.modal.show();
            $scope.isModalOpen = true;
            $scope.getAllCourses();
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

        $scope.getAttendanceStatistics = function(obj) {
            $scope.attendanceStatistics = [];
            DashboardFactory.getCollegeAttendanceStatistics(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        if (success.data.Data.Dates.length == 0) {
                            ionicToast.show('No attendance has been taken yet', 'bottom', false, 2500);
                        } else {
                            $scope.attendanceStatistics = success.data.Data;
                        }
                    }
                    $scope.renderLineChart();
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.getMarksStatistics = function(obj) {
            $scope.marksStatistics = [];
            DashboardFactory.getCollegeMarksStatistics(obj)
                .then(function(success) {
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.marksStatistics = success.data.Data;
                        if ($scope.marksStatistics.Percentage >= 75) {
                            $scope.graph.color = "#2ba14b";
                        } else if ($scope.marksStatistics.Percentage >= 50 && $scope.marksStatistics.Percentage < 75) {
                            $scope.graph.color = "#f1b500";
                        } else {
                            $scope.graph.color = "#e33e2b";
                        }
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.getAllStatistics = function() {
            var obj = {
                CollegeId: LoginFactory.loggedInUser.CollegeId,
                CourseId: $scope.selected.courseId,
                BranchId: $scope.selected.branchId,
                SemesterId: $scope.selected.semesterId,
                ClassId: $scope.selected.classId
            }
            if ($scope.selectedCollege.PackageCode != 'EXTENDED') {
                $scope.getAttendanceStatistics(obj);
            }
            $scope.getMarksStatistics(obj);
            // $scope.getTotalFees();
            $scope.$broadcast('scroll.refreshComplete');
            $scope.closeModal();
        };

        $scope.renderLineChart = function() {
            var chart = new Highcharts.Chart({
                chart: {
                    renderTo: 'attendanceChart'
                },
                title: {
                    text: ''
                },
                credits: {
                    enabled: false
                },
                xAxis: {
                    title: {
                        text: 'Date Range'
                    },
                    categories: $scope.attendanceStatistics.Dates
                },
                yAxis: {
                    title: {
                        text: 'Percentage'
                    }
                },
                series: [{
                    data: $scope.attendanceStatistics.Percentages
                }]
            });
        };

        $scope.collegeSelected = function(college) {
            LoginFactory.loginCollege(college);
            $scope.selectedCollege = college;
            $scope.closePopover();
            $state.reload();
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

        $scope.getTotalFees = function() {
            SelectSemesterFactory.getAllFeesCollected(LoginFactory.loggedInUser.CollegeId, $scope.selected.courseId, $scope.selected.branchId, $scope.selected.semesterId, $scope.selected.classId)
                .then(function(success) {
                    $scope.feesCollected = [];
                    if (success.data.Code != "S001") {
                        ionicToast.show(success.data.Message, 'bottom', false, 2500);
                    } else {
                        $scope.feesCollected = success.data.Data.FeesCollected;
                        $scope.studentCount = success.data.Data.StudentCount;
                        $scope.calculateTotalFees();
                        $scope.$broadcast('scroll.refreshComplete');
                    }
                }, function(error) {
                    ionicToast.show(error, 'bottom', false, 2500);
                });
        };

        $scope.calculateTotalFees = function() {
            $scope.totalFees = 0;
            $scope.collectedFees = 0;
            for (var i = 0; i < $scope.feesCollected.length; i++) {
                $scope.totalFees += parseFloat($scope.feesCollected[i].TotalFees);
                $scope.collectedFees += $scope.feesCollected[i].FeesPaid;
            }
        };

        $scope.showBankInfo = function() {
            var alertPopup = $ionicPopup.alert({
                title: 'Bank Information',
                template: $scope.loggedInUser.BankAccountInfo
            });
        };

        $scope.gotoPO = function() {
            $state.go("menu.programOutcome");
        };

        $scope.getAllKeywords();
        $scope.getAllStatistics();
        $scope.getTotalFees();

    });