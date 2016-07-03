angular.module('app.services', [])

.factory('CurrentUserProfile', [function CurrentUserProfile() {
	return {
		username: 'ymeirovich',
		bank_profile: '04'
	}
}])

.factory("Auth", ['$firebaseAuth', 'StorageService', 'AuthChat','$rootScope','$ionicHistory','$state','User','$firebaseAuth',
	function($firebaseAuth, StorageService,AuthChat,$rootScope,$ionicHistory,$state,User,$firebaseAuth) {

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
}])

.factory('StorageService', ['$firebaseUrl', '$firebaseObject', function($firebaseUrl, $firebaseObject) {


	var _ref = function ref(type) {
		//return new Firebase($firebaseUrl + type);
		//return firebase.database().ref();
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
	this.handleFile = function(e, $firebaseRef, selected_bank_profile) {
		var files = e.target.files;
		var i, f;
		for (i = 0, f = files[i]; i != files.length; ++i) {
			var reader = new FileReader();
			var name = f.name;
			reader.readAsText(f, 'iso-8859-8');
			reader.onload = function(e) {
				var data = e.target.result;
				self.processWorkbook(data, $firebaseRef, selected_bank_profile);
				// var workbook = XLSX.read(data, {
				// 	type: 'file'
				// });
				// var first_sheet_name = workbook.SheetNames[0];
				// var address_of_cell = 'A1';

				// /* Get worksheet */
				// var worksheet = workbook.Sheets[first_sheet_name];

				// /* Find desired cell */
				// var desired_cell = worksheet[address_of_cell];

				// /* Get the value */
				// var desired_value = desired_cell.v;
				// console.log(desired_value);
				// if(typeof workbook !== "undefined"){
				// 	return workbook;
				// }else{
				// 	return undefined;
				// }
			};
		}
	};
	this.processWorkbook = function processWorkbook(data, $firebaseRef, selected_bank_profile) {
		var account_type_id = selected_bank_profile,
			account = BANK_PROFILES[account_type_id];
		var account_numbers = account.getAccountNumbers(data);
		var account_records = account.getRecords.call(account, data, account_numbers);
		var wkStore = 'transRecords';
		//StorageService.createStore(wkStore);
		account_records.forEach(function account_records(v, i, arr) {
			//StorageService.add(this, v);
			$firebaseRef.$add({
				user: self.Auth.currentUserId.uid,
				accounts: v
			});
		});
	};
	this.exportWorkbookData = function exportWorkbookData(data) {

	}

}]);