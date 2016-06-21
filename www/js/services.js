angular.module('app.services', [])
	.constant('$firebaseUrl', "https://budgetapp-f972b.firebaseio.com/")
	.constant('RECORD_MODEL', function RECORD_MODEL(data) {
		model = {};
		model.account_type_id = data.account_type_id;
		model.account_number = data.account_number;
		model.record_id = data.record_id;
		model.transaction_date = data.transaction_date;
		model.reference_number = data.reference_number;
		model.debit = data.debit;
		model.credit = data.credit;
		model.description = data.description;
		model.category = data.category;
		return model;
	})
	.constant('BANK_PROFILES', {
		"04-Chk": {
			name: 'Bank Yahav Checking',
			account_type_id: "04-Chk",
			profile: {
				//array position for header row
				'transaction_date': 0,
				'reference_number': 2,
				'debit': 3,
				'credit': 4,
				'description': 1
			},
			getRows: function getRows(data) {
				return $(data).find('#mytable_body');
			},
			getRecords: function function_name(data, account_numbers) {
				var report = this;
				var rows = report.getRows(data);
				var records = rows.map(function rows(i, v) {
					var rowsArray = $(v).find('tr').map(function rowsArray(indx, val) {
						var dataArray = report.getData(val);
						return {
							transaction_date: dataArray[report.profile.transaction_date],
							reference_number: dataArray[report.profile.reference_number],
							debit: dataArray[report.profile.debit] === '&nbsp;' ? '' : dataArray[report.profile.debit],
							credit: dataArray[report.profile.credit] === '&nbsp;' ? '' : dataArray[report.profile.credit],
							description: $.trim(dataArray[report.profile.description])
						}
					})
					var ra = [];
					ra.push({
						account_number: account_numbers[i],
						records: $.makeArray(rowsArray).splice(0, rowsArray.length - 1).splice(2)
					});
					return ra;
				})
				return $.makeArray(records);
			},
			getData: function getData(row) {
				var arr = [],
					cells = $(row).children('td');
				arr = $.makeArray(cells).map(function cells(v, i, arr) {
					return $(v).html();
				});
				return arr;
			},
			getAccountNumbers: function getAccountNumber(data) {
				//can have more than one account number listed in a spreadsheet
				var account_numbers = $(data).find('#trBlueOnWhite12B').map(function(i, v) {
					return $(v).parent().next().find('font').last().html().trim();
				});

				return account_numbers;
			}
		},
		"04-CC": {
			name: 'Bank Yahav CC',
			account_type_id: "04-CC",
			account_number: 0,
			profile: {
				//array position for header row
				'record_id': '',
				'transaction_date': 0,
				'reference_number': 2,
				'debit': 3,
				'credit': 4,
				'description': 1
			}
		}
	})

.factory('CurrentUserProfile', [function CurrentUserProfile() {
		return {
			username: 'ymeirovich',
			bank_profile: '04'
		}
	}])
	// .factory("firebaseArray", ['firebaseArray','$firebaseRef',function($firebaseArray,$firebaseRef) {
	// 	return $firebaseArray($firebaseRef);
	// }])
	.factory("Auth", ['$firebaseAuth', 'StorageService', function($firebaseAuth, StorageService) {
		return {
			currentUserId: null,
			firebaseAuth: null
		}
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
	}]);