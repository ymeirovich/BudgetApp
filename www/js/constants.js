angular.module('app.constants', [])
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
	});
