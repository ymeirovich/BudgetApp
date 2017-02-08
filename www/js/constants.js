angular.module('app.constants', [])
    .constant('$firebaseUrl', 'https://budgetapp-f972b.firebaseio.com/')
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
        '04-Chk': {
            name: 'Bank Yahav Checking',
            account_type_id: '04-Chk',
            profile: {
                // array position for header row
                'transaction_date': 'G',
                'reference_number': 'E',
                'debit': 'C',
                'credit': 'B',
                'description': 'D',
                'balance': 'A',
            },
            getRows: function getRows(workbook) {
                return workbook.Sheets[workbook.SheetNames[0]]['!ref'].split(':')[1].substring(1);
            },
            getRecords: function getRecords(data, account_numbers) {
                var report = this;
                var rows = report.getRows(data);
                var records = [];
                var dataArray = data.Sheets[data.SheetNames[0]];
                for (var i = 7; i <= rows; i++) {
                    if (angular.isDefined(dataArray[report.profile.transaction_date + i])) {
                        records.push({
                            transaction_date: dataArray[report.profile.transaction_date + i].w,
                            reference_number: dataArray[report.profile.reference_number + i].v,
                            debit: dataArray[report.profile.debit] === '&nbsp;' ? '' : dataArray[report.profile.debit + i].v,
                            credit: dataArray[report.profile.credit] === '&nbsp;' ? '' : dataArray[report.profile.credit + i].v,
                            description: $.trim(dataArray[report.profile.description + i].v),
                            recUID: dataArray[report.profile.transaction_date + i].w + dataArray[report.profile.reference_number + i].v + dataArray[report.profile.balance + i].v,
                        });
                    }
                }
                var ra = [];
                ra.push({
                    [account_numbers]: records,
                });
                return ra;

                // var records = rows.map(function rows(i, v) {
                //     var rowsArray = $(v).find('tr').map(function rowsArray(indx, val) {
                //         var dataArray = report.getData(val);
                //         return {
                //             transaction_date: dataArray[report.profile.transaction_date],
                //             reference_number: dataArray[report.profile.reference_number],
                //             debit: dataArray[report.profile.debit] === '&nbsp;' ? '' : dataArray[report.profile.debit],
                //             credit: dataArray[report.profile.credit] === '&nbsp;' ? '' : dataArray[report.profile.credit],
                //             description: $.trim(dataArray[report.profile.description]),
                //         };
                //     });
                //     var ra = [];
                //     ra.push({
                //         account_number: account_numbers[i],
                //         records: $.makeArray(rowsArray).splice(0, rowsArray.length - 1).splice(2),
                //     });
                //     return ra;
                // });
                // return $.makeArray(records);
            },
            // getData: function getData(row) {
            //     var arr = [];
            //     //     cells = $(row).children('td');
            //     // arr = $.makeArray(cells).map(function cells(v, i, arr) {
            //     //     return $(v).html();
            //     // });
            //     return arr;
            // },
            getAccountNumbers: function getAccountNumber(workbook) {
                // can have more than one account number listed in a spreadsheet
                // var account_numbers = $(data).find('#trBlueOnWhite12B').map(function(i, v) {
                //     return $(v).parent().next().find('font').last().html().trim();
                // });

                return workbook.Sheets[workbook.SheetNames[0]]['A4'].v;
            },
        },
        '04-CC': {
            name: 'Bank Yahav CC',
            account_type_id: '04-CC',
            account_number: 0,
            profile: {
                // array position for header row
                'record_id': '',
                'transaction_date': 0,
                'reference_number': 2,
                'debit': 3,
                'credit': 4,
                'description': 1,
            },
        },
    });