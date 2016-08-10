angular.module('cyza.controllers', [])

.controller('AppCtrl', function($scope, $state, $ionicPopup, $filter, $ionicLoading, $ionicModal, $ionicHistory, AuthService, $http, apiUrl, $stateParams, AUTH_EVENTS) {
    $scope.user = AuthService.userData();

    $scope.$on(AUTH_EVENTS.notAuthorized, function(event) {
        var alertPopup = $ionicPopup.alert({
            title: $translate('popup_not_authorized'),
            template: $translate('popup_not_allowed_to_access')
        });
    });

    $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
        AuthService.logout();
        var alertPopup = $ionicPopup.alert({
            title: $translate('popup_session_lost'),
            template: $translate('popup_sorry_enter_again')
        });
    });

    $scope.getLinkedInData = function() {
        if (!$scope.hasOwnProperty("userprofile")) {
            IN.API.Profile("me").fields(
                ["id", "firstName", "lastName", "pictureUrl",
                    "publicProfileUrl"
                ]).result(function(result) {
                AuthService.loginLinkd(result.values[0]).success(function(data) {
                    // if (!data.success) return AuthService.errorMsg(data && data.msg ? data.msg : $translate('error_undetermined'));
                    $ionicLoading.hide();
                    //$state.go('main.home', {}, { reload: true });
                    // window.location = '#/account';
                    window.location.reload(true);
                }).error(function(data) {
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                        title: $translate('popup_failed_income'),
                        template: data
                    });
                });
                console.log(result.values[0]);
            }).error(function(err) {
                $scope.error = err;
            });
        }
    }
})


.controller('MainCtrl', function($scope, $state, $ionicPopup, $filter, $ionicLoading, $ionicModal, $ionicHistory, AuthService, $http, apiUrl, $stateParams) {
    var $translate = $filter('translate');
    var user = AuthService.userData();
    $scope.user = user;
    $scope.fullname = user.firstname + ' ' + user.lastname;
    $scope.profile_pic = user.profile_pic;
    $scope.facebook_id = user.facebook_id;
    $scope.logout = function() {
        console.log('entre aqui salir')
        $ionicLoading.show({
            template: $translate('loading_closed')
        });
        AuthService.logout();
    };
})

.controller('LoginCtrl', function($scope, $state, $ionicPopup, $filter, $ionicLoading, $ionicModal, $ionicHistory, AuthService, $http, apiUrl, $stateParams) {
    var $translate = $filter('translate');
    $scope.user = {};
    $ionicHistory.nextViewOptions({
        disableBack: true
    });
    $scope.loginData = {};
    $scope.recover = {};
    $scope.goRegister = function() {
        $state.go('register', {}, { reload: true });
    }
    $scope.doLogin = function() {

        $ionicLoading.show({
            template: $translate('loading_entering_account')
        });
        AuthService.login($scope.loginData.username, $scope.loginData.password).success(function(data) {
            // if (!data.success) return AuthService.errorMsg(data && data.msg ? data.msg : $translate('error_undetermined'));
            $ionicLoading.hide();
            //$state.go('main.home', {}, { reload: true });
            window.location = '#/account';
            window.location.reload(true);
        }).error(function(data) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: $translate('popup_failed_income'),
                template: data
            });
        });
    }

    $scope.doRegister = function() {

        $ionicLoading.show({
            template: $translate('loading_entering_account')
        });
        if (!$scope.user.email && !$scope.user.firstName && !$scope.user.lastName) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: $translate('popup_problem'),
                template: $translate('popup_missing_data'),
                buttons: [{
                    text: '<b>' + $translate('popup_accept') + '</b>',
                    type: 'button-balanced'
                }]
            });
        } else if ($scope.user.password === $scope.user.password_r) {
            AuthService.singin($scope.user).success(function(data) {
                // if (!data.success) return AuthService.errorMsg(data && data.msg ? data.msg : $translate('error_undetermined'));
                $ionicLoading.hide();
                window.location = '#/account';
                window.location.reload(true);
            }).error(function(data) {
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                    title: $translate('popup_failed_income'),
                    template: data
                });
            });
        } else {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: $translate('popup_problem'),
                template: $translate('popup_password_diff'),
                buttons: [{
                    text: '<b>' + $translate('popup_accept') + '</b>',
                    type: 'button-balanced'
                }]
            });
        }
    }

    $scope.goRecover = function() {
        $ionicLoading.show({
            template: $translate('loading_recover_account')
        });
        $http.post(apiUrl + 'api/recover', { email: $scope.recover.email }).success(function(data) {
            if (!data.success) return AuthService.errorMsg(data && data.msg ? data.msg : $translate('error_undetermined'));
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: $translate('popup_change_of_password'),
                template: data.msg,
                buttons: [{
                    text: '<b>' + $translate('popup_accept') + '</b>',
                    type: 'button-balanced'
                }]
            });
        }).error(function(data) {}).finally(function() {
            $ionicLoading.hide();
        });
    }
    $scope.getLinkedInData = function() {
        if (!$scope.hasOwnProperty("userprofile")) {
            IN.API.Profile("me").fields(
                ["id", "firstName", "lastName", "pictureUrl",
                    "publicProfileUrl"
                ]).result(function(result) {
                AuthService.loginLinkd(result.values[0]).success(function(data) {
                    $ionicLoading.hide();
                    window.location = '#/account';
                    window.location.reload(true);
                }).error(function(data) {
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                        title: $translate('popup_failed_income'),
                        template: data
                    });
                });
                console.log(result.values[0]);
            }).error(function(err) {
                $scope.error = err;
            });
        }
    }

})

.controller('AccountCtrl', function($scope, $state, $ionicPopup, $filter, $ionicLoading, $ionicModal, $ionicHistory, AuthService, $http, apiUrl, $stateParams) {
    $scope.user = AuthService.userData();
    var $translate = $filter('translate');
    $ionicHistory.nextViewOptions({
        disableBack: true
    });

    $scope.updateUser = function() {
        $http.post(apiUrl + '/api/updateUser?access_token=' + AuthService.token(), $scope.user).success(function(data) {
            if (!data.success) return AuthService.errorMsg(data && data.msg ? data.msg : $translate('error_undetermined'));
        }).finally(function() {
            $ionicLoading.hide();
        });
    }
})

.controller('TesteCtrl', function($scope, $state, $ionicPopup, $filter, $ionicLoading, $ionicModal, $ionicHistory, AuthService, $http, apiUrl, $stateParams) {
    $scope.user = AuthService.userData();
    var $translate = $filter('translate');
    $ionicHistory.nextViewOptions({
        disableBack: true
    });
})
