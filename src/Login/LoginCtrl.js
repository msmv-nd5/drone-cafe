'use strict';

droneCafe.controller('LoginCtrl', ['$scope', '$cookies', 'UserService', '$location', function ($scope, $cookies, UserService, $location) {

    $scope.user = {};
    $scope.user.credit = 0;
    $scope.user.isLogged = false;

    let nameCookie = $cookies.get('name');
    let emailCookie = $cookies.get('email');

    if (emailCookie != undefined) {
        UserService.getUser(emailCookie).then(function (response) {
            $scope.user.isLogged = true;
            $scope.user.name = nameCookie;
            $scope.user.email = emailCookie;
            $scope.user.credit = response.data[0].credit;
            UserService.setCurrentUser($scope.user);
            if ($location.path() != "/kitchen") {
                $location.path('/');
            }
        });
    }

    $scope.getAuthUser = function () {
        return UserService.getCurrentUser();
    };


    $scope.login = function () {
        UserService.getUser($scope.user.email).then(function (response) {
            $scope.user.isLogged = true;
            $cookies.put('name', $scope.user.name);
            $cookies.put('email', $scope.user.email);
            if (response.data[0] != undefined) {
                $scope.user.credit = response.data[0].credit;
                UserService.setCurrentUser($scope.user);
            }
            else {
                let userData = {};
                userData.name = $scope.user.name;
                userData.email = $scope.user.email;
                userData.credit = 100;
                $scope.user.credit = 100;
                UserService.createUser(userData);
                UserService.setCurrentUser($scope.user);
            }
            $location.path('/');
        });
    };


}]);
