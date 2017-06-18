angular
    .module('DroneCafe')
    .factory('MenuService', function($http) {

            return {

                getMenu: function() {
                    return $http.get('/api/v1/menu/');
                }

            }

        }

    );
