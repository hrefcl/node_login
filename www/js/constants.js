
angular.module('constants', [])

.constant('apiUrl', '')

.constant('AUTH_EVENTS', {
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
})

.constant('setUserId', function(userId) {
    window.localStorage.setItem('userId', userId);
})


.constant('setPushToken', function(pushToken) {
    window.localStorage.setItem('pushToken', pushToken);
})

.constant('getUserId', function() {
    return window.localStorage.getItem('userId');
})

.constant('getPushToken', function() {
    return window.localStorage.getItem('pushToken');
})

.constant('getUser', function() {
    return JSON.parse(window.localStorage.getItem('userData'));
})

.constant('USER_ROLES', {
    admin: 'admin',
    single: 'single',
    premium: 'premium'
})

.constant('getById', function(array, id) {
    if (array instanceof Array) {
        return array.filter(function(obj) {
            if (obj.id == id) return obj;
        })[0];
    }
})

.constant('LANG', 'es')

.constant('DEVICE', [])

.constant('USER', [])

.constant('indexById', function(id, array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] && array[i]['id'] == id) {
            return i;
        }
    }
    return -1;
})

.constant('findIndexByKeyValue', function(arraytosearch, key, valuetosearch) {
    for (var i = 0; i < arraytosearch.length; i++) {
        if (arraytosearch[i] && arraytosearch[i][key] == valuetosearch) {
            return i;
        }
    }
    return -1;
})

.constant('findByKeyValue', function(arraytosearch, key, valuetosearch) {
    for (var i = 0; i < arraytosearch.length; i++) {
        if (arraytosearch[i] && arraytosearch[i][key] == valuetosearch) {
            return arraytosearch[i];
        }
    }
    return null;
})

.constant('findByKeyValueAll', function(arraytosearch, key, valuetosearch) {
    var AllIndex = [];
    for (var i = 0; i < arraytosearch.length; i++) {
        if (arraytosearch[i][key] == valuetosearch) {
            AllIndex.push(i);
        }
    }
    return AllIndex;
})

.constant('findByKeyValueArray', function(arraytosearch, key, valuetosearch) {
    for (var i = 0; i < arraytosearch.length; i++) {
        if (arraytosearch[i]) {
            for (var e = 0; e < arraytosearch[i][key].length; e++) {
                if (arraytosearch[i][key][e] == valuetosearch) {
                    return arraytosearch[i];
                }
            }
        }
    }
    return null;
})
