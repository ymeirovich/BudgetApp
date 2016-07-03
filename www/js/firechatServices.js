angular.module('angularFirechat.services', ['firebase'])

//------------------------------------------------------------------------------
//
//  Firebase
//
//------------------------------------------------------------------------------

.factory("FireRef", function($window) {
  // var config = {
  //               apiKey: "AIzaSyDoLE9hmM-S5BA9btNur2dOjGelS4HEIxo",
  //               //apiKey:"AIzaSyB75vkivQNnUDaTFRsQ8KgugJxshB7yOoc",
  //               authDomain: "budgetapp-f972b.firebaseapp.com",
  //               databaseURL: 'https//angular-firechat.firebaseio.com',
  //               storageBucket: "budgetapp-f972b.appspot.com",
  //           };
  //          return firebase.initializeApp(config);
  return firebase;
})

//--------------------------------------
//  Authentication
//--------------------------------------

.factory("AuthChat", function(FireRef, $firebaseAuth) {
  return $firebaseAuth(FireRef.auth());
})

//--------------------------------------
//  Data models
//--------------------------------------

.factory("User", function(FireRef, $firebaseObject) {
  return function(userId) {
    //return $firebaseObject(FireRef.database().ref().child('users').child(userId));

    return $firebaseObject(FireRef.database().ref().child('accounts').child('user').child(userId));
    //firebase.database().ref().child("categories");
  }
})

.factory("Users", function(FireRef, $firebaseArray) {
  return $firebaseArray(FireRef.database().ref().child('users'));
})

.factory("Room", function(FireRef, $firebaseObject) {
  return function(roomId) {
    return $firebaseObject(FireRef.database().ref().child('rooms').child(roomId));
  }
})

.factory("Rooms", function(FireRef, $firebaseArray) {
  return $firebaseArray(FireRef.database().ref().child('rooms'));
})

.factory("Message", function(FireRef, $firebaseObject) {
  return function(roomId) {
    return $firebaseObject(FireRef.database().ref().child('messages').child(roomId));
  }
})

.factory("Messages", function(FireRef, $firebaseArray) {
  return function(roomId) {
    return $firebaseArray(FireRef.database().ref().child('messages').child(roomId));
  }
})

.filter('keys', function() {
  return function(input) {
    if(input) {
      return Object.keys(input);
    } else {
      null;
    }
  }
})

