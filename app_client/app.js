
(function () {

  angular.module('giscolab', ['ngRoute', 'ui-leaflet']);

  function config ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.view.html',
        controller: 'homeCtrl',
        controllerAs: 'vm'
      })
      .when('/register', {
        templateUrl: 'views/register.view.html',
        controller: 'registerCtrl',
        controllerAs: 'vm'
      })
      .when('/profile', {
        templateUrl: 'views/profile.view.html',
        controller: 'profileCtrl',
        controllerAs: 'vm'
      })
        .when('/current', {
          templateUrl: 'views/current.view.html',
            controller: 'currentCtrl',
            controllerAs: 'vm'
        })
        .when('/projects', {
          templateUrl: 'views/projects.view.html',
            controller: 'projectsCtrl',
            controllerAs: 'vm'
        })
        .when('/projectCreate', {
          templateUrl: 'views/projectCreate.view.html',
            controller: 'projectsCreateCtrl',
            controllerAs: 'vm'
        })
        .when('/projectActive', {
          templateUrl: 'views/projectActive.view.html',
            controller: 'projectActiveCtrl',
            controllerAs: 'vm'
        })
        .when('/projectUpdate', {
          templateUrl: 'views/projectUpdate.view.html',
            controller: 'projectUpdateCtrl',
            controllerAs: 'vm'
        })
        .when('/userProfile', {
          templateUrl: 'views/userProfile.view.html',
            controller: 'userProfileCtrl',
            controllerAs: 'vm'
        })
        .when('/account', {
          templateUrl: 'views/account.view.html',
            controller: 'accountCtrl',
            controllerAs: 'vm'
        })
        .when('/about', {
            templateUrl: 'views/about.view.html',
            controller: 'aboutCtrl',
            controllerAs: 'vm'
        })
      .otherwise({redirectTo: '/'});

    // use the HTML5 History API
    $locationProvider.html5Mode(true);
  }

  function run($rootScope, $location, authentication) {
    $rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) {
      if ($location.path() === '/profile' && !authentication.isLoggedIn()) {
        $location.path('/');
      }
    });
  }
  
  angular
    .module('giscolab')
    .config(['$routeProvider', '$locationProvider', config])
    .run(['$rootScope', '$location', 'authentication', run]);

})();