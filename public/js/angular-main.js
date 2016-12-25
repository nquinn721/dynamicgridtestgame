angular.module('game', ['ngRoute'])
    .config(['$routeProvider', '$locationProvider',
        function($routeProvider, $locationProvider) {
            console.log('main');
            $routeProvider
                .when('/', {
                    templateUrl: '/main-view'
                })
                .when('/character-select', {
                    templateUrl: '/character-select-view',
                    controller: 'BookCtrl',
                    controllerAs: 'book'
                })
                .when('/game', {
                    templateUrl: '/game-view',
                    controller: 'GameCtrl',
                    controllerAs: 'game'
                })
                .otherwise({redirectTo: '/'});

            $locationProvider.html5Mode({enabled : true, requireBase : false});
        }])
    .controller('BodyCtrl', function () {

    })
    .controller('MainCtrl', ['$route', '$routeParams', '$location',
        function MainCtrl($route, $routeParams, $location) {
            console.log('mainctrl');
            this.$route = $route;
            this.$location = $location;
            this.$routeParams = $routeParams;
        }])
    .controller('BookCtrl', ['$routeParams', function BookCtrl($routeParams) {
        this.name = 'BookCtrl';
        this.params = $routeParams;
    }])
    .controller('GameCtrl', [function () {
        startGame();
    }]);