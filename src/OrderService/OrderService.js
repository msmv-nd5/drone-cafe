angular
    .module('DroneCafe')
    .factory('OrderService', function ($http) {

            return {

                getOrders: function (userEmail) {
                    return $http.get('/api/v1/orders/' + userEmail);
                },

                getAllOrders: function () {
                    return $http.get('/api/v1/orders/');
                },

                createOrder: function (orderData) {
                    return $http({
                        method: 'POST',
                        url: '/api/v1/orders/',
                        data: orderData
                    });
                },

                editOrder: function (orderData) {
                    return $http({
                        method: 'PUT',
                        url: '/api/v1/orders/' + orderData._id,
                        data: orderData
                    });
                },


            }

        }
    );
