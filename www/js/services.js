angular.module('app.services', [])

.factory('CurrentUserProfile', [function CurrentUserProfile() {
    return {
        username: 'ymeirovich',
        bank_profile: '04'
    }
}])

.factory("Auth", ['$firebaseAuth', 'StorageService', 'AuthChat', '$rootScope', '$ionicHistory', '$state', 'User',
    function($firebaseAuth, StorageService, AuthChat, $rootScope, $ionicHistory, $state, User) {

        var _currentUserId = null,
            _firebaseAuth = null,
            _isAuthCompleted = false;

        $rootScope.authData = null;
        $rootScope.currentUser = null;
        var onAuthCompleted = function(authData) {
            $rootScope.authData = authData;

            if (authData === null) {
                console.info("Not joined yet");
                //$ionicLoading.hide();
            } else {
                console.info("Joined as", authData.uid);
                // console.debug(authData);

                $rootScope.currentUser = User(authData.uid);

                $rootScope.currentUser.$loaded().then(function(data) {
                    // console.debug(data);
                    if (!data.name || !data.avatar) {
                        //if (!data.name || !data.avatar) {
                        data.name = authData.displayName
                            //email: "ymeirovich@gmail.com"
                            // switch (authData.provider) {
                            // 	case 'facebook':
                            // 		data.name = authData['facebook'].displayName;
                            // 		data.avatar = authData['facebook'].cachedUserProfile.picture.data.url;
                            // 		break;
                            // 	case 'twitter':
                            // 		data.name = authData['twitter'].displayName;
                            // 		data.avatar = authData['twitter'].cachedUserProfile.profile_image_url;
                            // 		break;
                            // 	case 'google':
                            // 		data.name = authData['google'].displayName;
                            // 		data.avatar = authData['google'].cachedUserProfile.picture;
                            // 		break;
                            // 	case 'github':
                            // 		data.name = authData['github'].displayName;
                            // 		data.avatar = authData['github'].cachedUserProfile.avatar_url;
                            // 		break;
                            // }

                        data.$save();
                    }

                    //$ionicLoading.hide();

                    // if ($state.current.name === 'entry') {
                    // 	$location.path('/home');
                    // }
                });
            }
        };

        // $rootScope.$watch(function () {
        // 	return _currentUserId;
        // },function (nv,ov) {
        // 	if(!_isAuthCompleted){
        // 		onAuthCompleted(nv);
        // 		_isAuthCompleted = true;
        // 	}
        // })
        // AuthChat.$onAuth(function(authData) {
        // 	if (!_isAuthCompleted) {
        // 		// alert('Auth.$onAuth');
        // 		onAuthCompleted(_currentUserId);
        // 		_isAuthCompleted = true;
        // 	}
        // });

        // AuthChat.$waitForAuth().then(function(authData) {
        // 	if (!_isAuthCompleted) {
        // 		// alert('Auth.$waitForAuth');
        // 		onAuthCompleted(_currentUserId);
        // 		_isAuthCompleted = true;
        // 	}
        // });


        var signOut = function() {
            AuthChat.$unauth();
            _isAuthCompleted = false;
            $rootScope.authData = null;

            $rootScope.currentUser.$destroy();
            $rootScope.currentUser = null;

            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true,
                historyRoot: true
            });

            $state.go('entry');
        };

        return {
            currentUserId: _currentUserId,
            firebaseAuth: _firebaseAuth,
            onAuthCompleted: onAuthCompleted,
            signOut: signOut
        }
    }
])

.factory('StorageService', ['$firebaseUrl', '$firebaseObject', function($firebaseUrl, $firebaseObject) {


    var _ref = function ref(type) {
        //return new Firebase($firebaseUrl + type);
        return firebase.database().ref();
    }

    // var _createStore = function(storeName) {
    // 	$localStorage[storeName] = [];
    // 	return this;
    // };
    var _get = function(store) {
        return $localStorage[store];
    };
    var _add = function(store, data) {
        //$localStorage[store].push(data);

    };
    var _remove = function(store, data) {
        $localStorage[store].splice($localStorage[store].indexOf(data), 1);
    };
    return {
        ref: _ref,
        //createStore: _createStore,
        get: _get,
        add: _add,
        remove: _remove
    };
}])

.service('ExcelService', ['BANK_PROFILES', 'StorageService', 'Auth', function(BANK_PROFILES, StorageService, Auth) {
        var self = this;
        self.Auth = Auth;
        self.StorageService = StorageService;
        this.handleFile = function(e, $firebaseRef, props) {
            var files = e.target.files;
            var i, f;
            for (i = 0, f = files[i]; i != files.length; ++i) {
                var reader = new FileReader();
                reader.onloadend = function(e) {
                    var data = e.target.result;
                    var workbook = XLSX.read(data, { type: 'binary' });
                    self.processWorkbook(workbook, $firebaseRef, props);

                };
                reader.readAsBinaryString(f); //iso-8859-8          
            }
        };
        this.processWorkbook = function processWorkbook(data, $firebaseRef, props) {
            var account_type_id = props.selected_bank_profile,
                account = BANK_PROFILES[account_type_id];
            var account_numbers = account.getAccountNumbers(data);
            var account_records = account.getRecords.call(account, data, account_numbers, $firebaseRef);
            //var wkStore = 'transRecords';
            //var store = this.StorageService.get(wkStore);
            props.import_records.accounts = [];
            account_records.forEach(function account_records(v, i, arr) {
                //StorageService.add(this, v); .equalTo(self.Auth.currentUserId.uid)
                // var recs = props.refTransRecs.orderByChild('accounts').once('value', function(snap) {
                //     var recs = snap;
                // });
                v.user = self.Auth.currentUserId.uid;
                props.import_records.$add({
                    accounts: v
                });
            });
        };
        this.exportWorkbookData = function exportWorkbookData(data) {

        }

    }])
    .filter('removeUser', function() {
        return function(x) {
            var i, c, txt = "";
            for (i = 0; i < x.length; i++) {
                c = x[i];
                if (i % 2 == 0) {
                    c = c.toUpperCase();
                }
                txt += c;
            }
            return txt;
        };
    });