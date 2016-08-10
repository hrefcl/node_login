angular.module('cyza.services', [])

.service('AuthService', function($q, apiUrl, $http, USER_ROLES, DEVICE, USER, $state, $ionicLoading, $ionicPopup, $state, $filter) {

    var LOCAL_TOKEN_KEY = 'token';
    var userData = '';
    var isAuthenticated = false;
    var role = '';
    var authToken;
    var $translate = $filter('translate');

    function loadUserCredentials() {
        var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
        var user = JSON.parse(window.localStorage.getItem('userData'));
        if (token && user) {
            useCredentials(user);
        }
    }

    function getToken() {
        return window.localStorage.getItem(LOCAL_TOKEN_KEY);
    }

    function updateUser(user) {
        window.localStorage.setItem(LOCAL_TOKEN_KEY, user.token);
        window.localStorage.setItem('userData', JSON.stringify(user));


    }

    function storeUserCredentials(user) {
        window.localStorage.setItem(LOCAL_TOKEN_KEY, user.token);
        window.localStorage.setItem('userData', JSON.stringify(user));
        useCredentials(user);
    }

    function useCredentials(user) {
        userData = user;
        isAuthenticated = true;
        authToken = user.token;

        if (user.role == 'admin') {
            role = USER_ROLES.admin
        }
        if (user.role == 'single_carrier') {
            role = USER_ROLES.single_carrier
        }
        if (user.role == 'single_user') {
            role = USER_ROLES.single_user
        }

        // Set the token as header for your requests!
        $http.defaults.headers.common['X-Auth-Token'] = user.token;
    }

    function destroyUserCredentials(popup) {
        console.log('entre destor')
        authToken = undefined;
        userData = '';
        isAuthenticated = false;
        $http.defaults.headers.common['X-Auth-Token'] = undefined;
        window.localStorage.removeItem(LOCAL_TOKEN_KEY);
        window.localStorage.removeItem('userData');
        $ionicLoading.hide();
        window.location.reload(true);
    }

    var login = function(name, pw) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        $http.post(apiUrl + '/authenticate/login', {
            "email": name,
            "password": pw,
            device: DEVICE,
        }).then(function(res) {
            if (res.data.success == true) {
                storeUserCredentials(res.data.user);
                deferred.resolve(res.data.user);
            } else {
                deferred.reject(res.data.msg);
            }
        });
        promise.success = function(fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
        }
        return promise;

    };
    var loginLinkd = function(obj) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        $http.post(apiUrl + '/authenticate/linkdinlogin', obj).then(function(res) {
            console.log(res);
            if (res.data.success == true) {
                storeUserCredentials(res.data.user);
                deferred.resolve(res.data.user);
            } else {
                deferred.reject(res.data.msg);
            }
        });
        promise.success = function(fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
        }
        return promise;

    };
    var singin = function(obj) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        $http.post(apiUrl + '/authenticate/signup', obj).then(function(res) {
            if (res.data.success == true) {
                storeUserCredentials(res.data.user);
                deferred.resolve(res.data.user);
            } else {
                deferred.reject(res.data.msg);
            }
        });
        promise.success = function(fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
        }
        return promise;
    };

    var logout = function() {
        IN.User.logout();
        destroyUserCredentials();
        
    };

    var isAuthorized = function(authorizedRoles) {
        if (!angular.isArray(authorizedRoles)) {
            authorizedRoles = [authorizedRoles];
        }
        return (isAuthenticated && authorizedRoles.indexOf(role) !== -1);
    };

    loadUserCredentials();

    return {
        login: login,
        loginLinkd: loginLinkd,
        logout: logout,
        singin: singin,
        isAuthorized: isAuthorized,
        errorMsg: function(msg) {
            var alertPopup = $ionicPopup.alert({
                title: $translate('popup_problem_server'),
                template: msg,
            });
            alertPopup.then(function(res) {
                $ionicLoading.hide();
                if ($state.previous.name) {
                    $state.go($state.previous.name);
                } else {
                    $state.go('main.account', { reload: true });
                }
            });
        },
        isAuthenticated: function() {
            return isAuthenticated;
        },
        userData: function() {
            userData = JSON.parse(window.localStorage.getItem('userData'));
            return userData;
        },
        token: getToken,
        role: function() {
            return role;
        },
        updateUser: updateUser
    };
})

.factory('AuthInterceptor', function($rootScope, $q, AUTH_EVENTS) {
    return {
        responseError: function(response) {
            $rootScope.$broadcast({
                401: AUTH_EVENTS.notAuthenticated,
                403: AUTH_EVENTS.notAuthorized
            }[response.status], response);
            return $q.reject(response);
        }
    };
})

.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
})
