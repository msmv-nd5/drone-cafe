angular
    .module('DroneCafe')
    .factory('UserService', function($http) {

        let currentUser = {};

            return {

                getUser: function(userEmail) {
                    return $http.get('/api/v1/users/' + userEmail);
                },

                createUser: function(userData) {
                    return $http({
                        method: 'POST',
                        url: '/api/v1/users/',
                        data: userData
                    });
                },

                editUser: function(userData) {
                    return $http({
                        method: 'PUT',
                        url: '/api/v1/users/',
                        data: userData
                    });
                },

                getCurrentUser: function () {
                    return currentUser;
                },
                setCurrentUser: function(value) {
                    currentUser = value;
                }

            }

        }

    );
