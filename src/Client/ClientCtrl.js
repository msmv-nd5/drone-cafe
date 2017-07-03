'use strict';

droneCafe.controller('ClientCtrl', function ($scope, MenuService, $q, UserService, OrderService, $location) {

    $scope.currentUser = UserService.getCurrentUser();
    if (!$scope.currentUser.isLogged) {
        $location.path('/login');
    }

    $scope.list1Class = "col-md-12";
    $scope.list2Class = "hide";
    $scope.list3Class = "hide";
    $scope.list4Class = "hide";

    $scope.openMenu = function () {
        $scope.list1Class = "hide";
        $scope.list2Class = "col-md-6";
        $scope.list3Class = "col-md-6";
        $scope.list4Class = "col-md-12";
    };


    $scope.addToOrder = function (position) {
        $scope.list1Class = "col-md-12";
        $scope.list2Class = "hide";
        $scope.list3Class = "hide";
        $scope.list4Class = "hide";

        if (position != undefined) {
            if (position.status == 'problem') {
                position.status = 'deleted';
                OrderService.editOrder(position);
                position.price = position.price - position.price / 100 * 5;
            }

            let userData = {};
            userData.name = $scope.currentUser.name;
            userData.email = $scope.currentUser.email;
            userData.credit = $scope.currentUser.credit - position.price;
            $scope.currentUser.credit -= position.price;
            UserService.editUser(userData).then(function (response) {
                position.email = $scope.currentUser.email;
                position.status = "new";
                OrderService.createOrder(position).then(function (response) {
                    Materialize.toast('Блюдо успешно заказано!', 2000);
                    loadLists();
                });
            });


        }
    };

    $scope.changeStatus = function (order, status) {
        order.status = status;
        OrderService.editOrder(order);

    };

    $scope.timerRunning = true;

    $scope.startTimer = function () {
        $scope.$broadcast('timer-start');
        $scope.timerRunning = true;
    };

    $scope.stopTimer = function () {
        $scope.$broadcast('timer-stop');
        $scope.timerRunning = false;
    };

    $scope.$on('timer-stopped', function (event, data) {
        console.log('Timer Stopped - data = ', data);
    });


    $scope.changeStatus = function (order, status) {
        order.status = status;
        OrderService.editOrder(order);

    };


    $scope.loadLists = function () {
        loadLists();
    };


    function loadLists() {
        OrderService.getOrders($scope.currentUser.email).then(function (response) {
            $scope.orders = response.data;
            MenuService.getMenu().then(function (response) {
                $scope.menu = response.data;
                $scope.menuFirstList = $scope.menu.slice(0, 24);
                $scope.menuSecondList = $scope.menu.slice(24, 49);
            });
        });
    }

    loadLists();


    $scope.addCredits = function (amount) {
        let userData = {};
        userData.name = $scope.currentUser.name;
        userData.email = $scope.currentUser.email;
        userData.credit = $scope.currentUser.credit + amount;
        $scope.currentUser.credit += amount;
        UserService.setCurrentUser(userData);
        $scope.currentUser = UserService.getCurrentUser();
        UserService.editUser(userData).then(function (response) {
            Materialize.toast('Баланс успешно пополнен на ' + amount + ' ГК!', 2000);
        });
    };

    $scope.updateBalance = function () {

        UserService.getUser($scope.currentUser.email).then(function (response) {
            UserService.setCurrentUser(response.data[0]);
            $scope.currentUser = UserService.getCurrentUser();

        });


    }


});
