// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.services',
  'app.directives', 'ngCordova', 'firebase', 'ngCordovaOauth', 'ionic.service.core'
])


.run(['$ionicPlatform', '$firebaseAuth', 'Auth', '$state', '$cordovaNetwork', '$rootScope', function($ionicPlatform, $firebaseAuth, Auth, $state, $cordovaNetwork, $rootScope) {
  $ionicPlatform.ready(function() {
    $rootScope.$watch(function() {
      return $rootScope.online;
    }, function() {
      if ($rootScope.online === false)
        console.log("offline") //This is consoled only once
      else console.log("online")

      //var browser = angular.injector(['app']).get('$cordovaInAppBrowser');
      //console.log('browser:' + browser);
      // $rootScope.urlchange = function($url, $rootScope) {
      //   cordova.InAppBrowser.open($url, "_blank", "location=no", "clearcache: no", "toolbar: no");
      // }
      // $rootScope.urlchange('http://www.cnn.com', $rootScope);
      
      $rootScope.$on('$cordovaInAppBrowser:loadstart', function(e, event) {
        console.log('inappbrowser load start');
      });

      $rootScope.$on('$cordovaInAppBrowser:loaderror', function(e, event) {
        console.log('inappbrowser load error' + e);
      });

      // if ($cordovaNetwork.getNetwork) {
      //   var type = $cordovaNetwork.getNetwork()

      //   var isOnline = $cordovaNetwork.isOnline()

      //   var isOffline = $cordovaNetwork.isOffline()
      //   console.log("cordovaNetwork: " + type);
      //   console.log("cordovaNetwork isOnline: " + isOnline);
      //   console.log("cordovaNetwork isOffline: " + isOffline);
      // }

      // listen for Online event
      $rootScope.$on('$cordovaNetwork:online', function(event, networkState) {
        var onlineState = networkState;
        console.log('Connection type: ' + onlineState);
      })

      // listen for Offline event
      $rootScope.$on('$cordovaNetwork:offline', function(event, networkState) {
        var offlineState = networkState;
        console.log('Connection type: ' + onlineState);
      })


    });


    function checkConnection() {

      setTimeout(function() {
        networkState = navigator.connection.type;

        var states = {};
        states[Connection.UNKNOWN] = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI] = 'WiFi connection';
        states[Connection.CELL_2G] = 'Cell 2G connection';
        states[Connection.CELL_3G] = 'Cell 3G connection';
        states[Connection.CELL_4G] = 'Cell 4G connection';
        states[Connection.NONE] = 'No network connection';

        console.log('Connection type: ' + states[networkState]);
      }, 1750);
    }

    //checkConnection();

    // document.addEventListener("offline", onOffline, false);

    // function onOffline() {
    //   alert('offline');
    // }
    // document.addEventListener("online", onOnline, false);

    // function onOnline() {
    //   alert('online');
    // }
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    var auth = $firebaseAuth();
    if (auth.$getAuth() === null) {
      //$state.go('login');
    }

    auth.$onAuthStateChanged(function(authData) {
      if (authData) {
        Auth.currentUserId = authData;
        Auth.firebaseAuth = auth;
        console.log("Logged in as:", authData.uid);
      } else {
        Auth.currentUserId = null;
        Auth.firebaseAuth = null;
        console.log("Logged out");
      }
    });
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    var presenceRef = firebase.database().ref("disconnectmessage");
    // Write a string when this client loses connection
    presenceRef.onDisconnect().set("I disconnected!");
    presenceRef.onDisconnect().remove(function(err) {
      if (err) {
        console.error('could not establish onDisconnect event', err);
      }
    });
    var onDisconnectRef = presenceRef.onDisconnect();
    onDisconnectRef.set('I disconnected');
    // some time later when we change our minds
    onDisconnectRef.cancel();
    var connectedRef = firebase.database().ref(".info/connected");
    connectedRef.on("value", function(snap) {
      if (snap.val() === true) {
        console.log("connected");
      } else {
        console.log("not connected");
      }
    });
    var push = new Ionic.Push({
      "debug": true
    });

    push.register(function(token) {
      console.log("Device token:", token.token);
    });
  });
}])

.config(['$ionicAppProvider', '$stateProvider', '$urlRouterProvider',
  function($ionicAppProvider, $stateProvider, $urlrouterProvider) {
    $ionicAppProvider.identify({
      app_id: '4446bd52',
      api_key: 'df6676e227917d70fb1114bc77aa8e6bb070eedba3465199'
    })
  }
])