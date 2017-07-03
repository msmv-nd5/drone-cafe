var droneCafe = angular.module('DroneCafe', ['ngRoute', 'btford.socket-io', 'ngCookies', 'timer']);

angular
    .module('DroneCafe')

    .config(['$routeProvider',
        function config($routeProvider) {

            $routeProvider.when('/', {
                templateUrl: 'src/Client/Client.html',
                controller: 'ClientCtrl'
            }).when('/login', {
                templateUrl: 'src/Login/Login.html',
                controller: 'LoginCtrl',
            }).when('/kitchen', {
                templateUrl: 'src/Kitchen/Kitchen.html',
                controller: 'KitchenCtrl',
            }).otherwise({
                redirectTo: '/login'
            });
        }
    ]);