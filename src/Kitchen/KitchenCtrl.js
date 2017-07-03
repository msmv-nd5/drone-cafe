'use strict';

droneCafe.controller('KitchenCtrl', function ($scope, MenuService, $q, OrderService) {

    $scope.timerRunning = true;

    $scope.changeStatus = function (order, status) {
        order.status = status;
        OrderService.editOrder(order);

    };


    $scope.loadLists = function () {
        loadLists();
    };


    function loadLists() {
        OrderService.getAllOrders().then(function (response) {
            $scope.orders = response.data;
        });
    }

    loadLists();


});
