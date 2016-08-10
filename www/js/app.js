// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('cyza', [
    'ionic',
    'cyza.controllers',
    'cyza.services',
    'constants',
    'pascalprecht.translate'
])

.run(function($rootScope, $state, AuthService, AUTH_EVENTS, $ionicPlatform, $ionicPopup, $translate) {

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState) {
        $state.previous = fromState;
    });
    $rootScope.$on('$stateChangeStart', function(event, next, nextParams, fromState) {
        if ('data' in next && 'authorizedRoles' in next.data) {
            var authorizedRoles = next.data.authorizedRoles;
            if (!AuthService.isAuthorized(authorizedRoles)) {
                event.preventDefault();
                window.location = '#/account';
                window.location.reload(true);
                //$state.go($state.current, {}, { reload: true });
                $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
            }
        }
        if (!AuthService.isAuthenticated()) {
            if (next.name !== 'login' && next.name !== 'recover' && next.name !== 'register') {
                event.preventDefault();
                $state.go('login');
            }
        } else {
            //console.log(next.name)
            if (next.name == 'login' || next.name == 'recover' || next.name == 'register') {
                window.location = '#/main/account';
                window.location.reload(true);
            }
        }
    });
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider, $translateProvider) {

    $translateProvider.useStaticFilesLoader({
            prefix: 'locales/',
            suffix: '.json'
        }).registerAvailableLanguageKeys(['es', 'en', 'pt', 'fr'], {
            'es': 'es',
            'es_CL': 'es',
            'en': 'en',
            'en_US': 'en',
            'pt': 'pt',
        }).preferredLanguage('en').fallbackLanguage('en').determinePreferredLanguage()
        .useSanitizeValueStrategy('escapeParameters');

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
    })

    .state('recover', {
        url: '/recover',
        templateUrl: 'templates/recover.html',
        controller: 'LoginCtrl'
    })

    .state('register', {
        url: '/register',
        templateUrl: 'templates/register.html',
        controller: 'LoginCtrl'
    })

    .state('main', {
        url: "/main",
        abstract: true,
        templateUrl: "templates/template.html",
        controller: 'MainCtrl'
    })


    .state('main.account', {
        url: "/account",
        views: {
            'menuContent': {
                templateUrl: "templates/haawi/account.html",
                controller: 'AccountCtrl',
            }
        }
    })


    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise(function($injector, $location) {
        var $state = $injector.get("$state");
        var user = JSON.parse(window.localStorage.getItem('userData'));
        $state.go("main.account");
    });

})

