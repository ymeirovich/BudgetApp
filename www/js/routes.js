angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider



    .state('tabsController.financialStatus', {
    url: '/status',
    views: {
      'tab3': {
        templateUrl: 'templates/financialStatus.html',
        controller: 'financialStatusCtrl',
        controllerAs: 'FinancialStatusCtrl',
        resolve: {
          // controller will not be loaded until $requireSignIn resolves
          // Auth refers to our $firebaseAuth wrapper in the example above
          "currentAuth": ["Auth", function(Auth) {
            // $requireSignIn returns a promise so the resolve waits for it to complete
            // If the promise is rejected, it will throw a $stateChangeError (see above) 

            //return Auth.firebaseAuth.$requireSignIn();
          }]
        }
      }
    }
  })

  .state('tabsController.canIBuy', {
    url: '/canibuy',
    views: {
      'tab2': {
        templateUrl: 'templates/canIBuy.html',
        controller: 'canIBuyCtrl',
        controllerAs: 'CanIBuyCtrl',
        resolve: {
          "currentAuth": ["Auth", function(Auth) {
            //return Auth.firebaseAuth.$requireSignIn();
          }]
        }
      }
    }
  })

  .state('tabsController', {
    url: '/main',
    templateUrl: 'templates/tabsController.html',
    abstract: true
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl',
    controllerAs: 'LoginCtrl'
  })

  .state('importRecords', {
    url: '/import',
    templateUrl: 'templates/importRecords.html',
    controller: 'importRecordsCtrl',
    controllerAs: 'ImportRecordsCtrl',
    resolve: {
      "currentAuth": ["Auth", function(Auth) {
        //return Auth.firebaseAuth.$requireSignIn();
      }]
    }
  })

  .state('backup', {
    url: '/backup',
    templateUrl: 'templates/backup.html',
    controller: 'backupCtrl',
    controllerAs: 'BackupCtrl',
    resolve: {
      "currentAuth": ["Auth", function(Auth) {
        //return Auth.firebaseAuth.$requireSignIn();
      }]
    }
  })

  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'signupCtrl'
  })

  .state('recordDetails', {
    url: '/details',
    templateUrl: 'templates/recordDetails.html',
    controller: 'recordDetailsCtrl',
    controllerAs: 'RecordDetailsCtrl',
    resolve: {
      "currentAuth": ["Auth", function(Auth) {
       // return Auth.firebaseAuth.$requireSignIn();
      }]
    }
  })

  .state('categories', {
    url: '/categories',
    templateUrl: 'templates/categories.html',
    controller: 'categoriesCtrl',
    controllerAs: 'CategoriesCtrl',
    resolve: {
      "currentAuth": ["Auth", function(Auth) {
        //return Auth.firebaseAuth.$requireSignIn();
      }]
    }
  })

  .state('settings', {
    url: '/settings',
    templateUrl: 'templates/settings.html',
    controller: 'settingsCtrl',
    controllerAs: 'SettingsCtrl',
    resolve: {
      "currentAuth": ["Auth", function(Auth) {
        //return Auth.firebaseAuth.$requireSignIn();
      }]
    }
  })

  .state('exportRecords', {
    url: '/export',
    templateUrl: 'templates/exportRecords.html',
    controller: 'exportRecordsCtrl',
    controllerAs: 'ExportRecordsCtrl',
    resolve: {
      "currentAuth": ["Auth", function(Auth) {
        //return Auth.firebaseAuth.$requireSignIn();
      }]
    }
  })
  .state('logout', {
    url: '/logout',
    controller: 'logoutCtrl'
  })
  .state('account', {
    url: '/account',
    templateUrl:'templates/account.html',
    controller: 'accountCtrl',
    controllerAs:'AccountCtrl'
  })

  $urlRouterProvider.otherwise('/main/status')



});