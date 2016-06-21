angular.module('app.controllers', [])

.controller('financialStatusCtrl', ['$scope', function($scope) {
    var ctrl = this;
    var deploy = new Ionic.Deploy();

    ctrl.properties = {
        updatesField: '',
        updatesAvailable: false
    }

    ctrl.actions = {
        doUpdate: function() {
            deploy.download().then(function() {
                // Extract the updates
                    ctrl.properties.updatesField = 'Updates downloaded';
                    $scope.$apply();
                deploy.extract().then(function() {
                    // Load the updated version
                    ctrl.properties.updatesField = 'Updates extracted';
                    $scope.$apply();
                    deploy.load();
                }, function(error) {
                    ctrl.properties.updatesAvailable = false;
                    ctrl.properties.updatesField = 'There has been an error updating the app. Please try again later: ' + JSON.stringify(error);
                    $scope.$apply();
                }, function(progress) {
                    console.log('Extraction Progress... ', progress);
                    ctrl.properties.updatesField = 'Extraction in Progress... ' + progress;
                    $scope.$apply();
                });
            }, function(error) {
                ctrl.properties.updatesAvailable = false;
                ctrl.properties.updatesField = 'There has been an error updating the app. Please try again later: ' + JSON.stringify(error);
                $scope.$apply();
            }, function(progress) {
                console.log('Download Progress... ', progress);
                ctrl.properties.updatesField = 'Download in Progress... ' + progress;
                $scope.$apply();
            });
            // deploy.update().then(function(res) {
            //     console.log('Update Success! ', res);
            //     ctrl.properties.updatesAvailable = false;
            //     ctrl.properties.updatesField = 'Updates have been successfully installed';

            //     $scope.$apply();
            // }, function(err) {
            //     console.log('Update error! ', err);
            //     ctrl.properties.updatesAvailable = false;
            //     ctrl.properties.updatesField = 'There has been an error updating the app. Please try again later: ' + err;
            //     $scope.$apply();
            // }, function(prog) {
            //     console.log('Progress... ', prog);
            //     ctrl.properties.updatesField = 'Update in Progress... ' + prog;
            //     $scope.$apply();
            // });
        },

        // Check Ionic Deploy for new code
        checkForUpdates: function() {
            console.log('Ionic Deploy: Checking for updates');
            deploy.check().then(function(hasUpdate) {
                console.log('Update available: ' + hasUpdate);
                if (hasUpdate) {
                    ctrl.properties.updatesAvailable = true;
                    ctrl.properties.updatesField = 'Update available';
                } else {
                    ctrl.properties.updatesField = 'No updates available';
                }
                $scope.$apply();
            }, function(err) {
                console.error('Unable to check for updates', err);
                ctrl.properties.updatesField = 'Unable to check for updates' + err;
                $scope.$apply();
            });
        }
    }

    // Update app code with new release from Ionic Deploy

}])

.controller('canIBuyCtrl', function($scope) {

})

.controller('loginCtrl', ['$scope', '$state', '$firebaseAuth', 'Auth', '$cordovaOauth', '$firebase', function($scope, $state, $firebaseAuth, Auth, $cordovaOauth, $firebase) {
    var ctrl = this;
    ctrl.Auth = Auth;
    ctrl.$firebase = $firebase;
    // $scope.$watch(function (argument) {
    //     return Auth.firebaseAuth;
    // },function (argument) {
    //     ctrl.properties.firebaseAuth = Auth.firebaseAuth;
    //     ctrl.properties.currentUserId = Auth.firebaseAuth;
    // })
    ctrl.login = function() {

        var auth = Auth.firebaseAuth = $firebaseAuth();
        var $firebase = $firebase;
        var provider = new firebase.auth.GoogleAuthProvider();
        // provider.addScope('https://www.googleapis.com/auth/plus.me');
        // provider.addScope('https://www.googleapis.com/auth/userinfo.email');
        // firebase.auth().signInWithRedirect(provider)
        //     .then(function(authData) {
        //         console.log("Logged in as:", authData.uid);
        //         Auth.currentUserId = authData;
        //     }).catch(function(error) {
        //         console.log("Authentication failed:", error);
        //     });288945686187-gcul78gqfuhridvv0tr05sr9l7rufv76.apps.googleusercontent.com
        //788382346450.apps.googleusercontent.com
        //288945686187-mlma2co6ukfcu4ugnn3mr2cakar3rnpi.apps.googleusercontent.com
        $cordovaOauth.google("788382346450.apps.googleusercontent.com", ["email"], {
            redirect_uri: "https://budgetapp-f972b.firebaseapp.com/__/auth/handler"
        }).then(function(result) {
            //login with Google
            var credential = firebase.auth.GoogleAuthProvider.credential(result.id_token);
            auth.$signInWithCredential(credential)
                .then(function(authData) {
                    console.log("Logged in as:", authData.uid);
                    Auth.currentUserId = authData;
                }).catch(function(error) {
                    console.log("Authentication failed:", error);
                });
            console.log(result)
        }, function(error) {
            alert(error);
            console.log(error);
        });


    };
}])

.controller('importRecordsCtrl', ['$scope', 'ExcelService', '$firebaseArray', 'Auth', 'BANK_PROFILES', function($scope, xlsvc, $firebaseArray, Auth, BANK_PROFILES) {

    var ctrl = this;
    var refImportRecs = firebase.database().ref().child("importRecords");
    var refTransRecs = firebase.database().ref().child("transRecords");
    ctrl.init = function init(argument) {
        ctrl.watch.loggedIn();
        ctrl.watch.openFile();
    }
    ctrl.properties = {
        fileName: '',
        account_type_ids: [],
        import_records: $firebaseArray(refImportRecs),
        selected_account: '',
        loggedIn: false,
        selectedAll: false,
        BANK_PROFILES: BANK_PROFILES
    }
    ctrl.actions = {
        openFileDialog: function openFileDialog() {
            if (!ctrl.properties.selected_bank_profile) {
                alert('you must select an account type');
                return false;
            } else {
                console.log('fire! $scope.openFileDialog()');
                ionic.trigger('click', {
                    target: document.getElementById('file')
                });
            }
        },
        moveRecords: function moveRecords() {
            var oldRef = refImportRecs,
                newRef = refTransRecs;
            oldRef.once('value', function(snap) {
                newRef.set(snap.val(), function(error) {
                    if (!error) {
                        oldRef.remove();
                        ctrl.properties.fileName = '';
                    } else if (typeof(console) !== 'undefined' && console.error) {
                        console.error(error);
                    }
                });
            });
        },
        deleteRecord: function deleteRecords(rec) {

        },
        deleteAllRecords: function deleteRecords() {
            refImportRecs.remove(function(error) {
                if (error) {
                    console.log('Synchronization failed');
                } else {
                    console.log('Synchronization succeeded');
                }
            });
            ctrl.properties.fileName = '';
        },
        checkAll: function checkall() {
            var selectedAll = ctrl.properties.selectedAll;
            if (selectedAll) {
                selectedAll = true;
            } else {
                selectedAll = false;
            }
            angular.forEach(ctrl.properties.selected_account.accounts.records, function(item) {
                item.Selected = selectedAll;
            });
        }
    }
    ctrl.watch = {
        loggedIn: function loggedIn(argument) {
            $scope.$watch(function(argument) {
                return Auth.firebaseAuth && Auth.firebaseAuth.$getAuth();
            }, function function_name(authValue) {
                if (authValue !== null) ctrl.properties.loggedIn = true
                else ctrl.properties.loggedIn = false;
            })
        },
        openFile: function openFile() {
                angular.element('#file').on('change', function(event) {
                    console.log('fire! angular#element change event');
                    xlsvc.handleFile(event, $firebaseArray(refImportRecs), ctrl.properties.selected_bank_profile);
                    var file = event.target.files[0];
                    ctrl.properties.fileName = file.name;
                    angular.element('#file').val(null);
                    $scope.$apply();
                });
            }
            // getTransRecords: function getTransRecords() {
            //     $scope.$watch(function() {
            //         return $localStorage.get('transRecords');
            //     }, function getTransWatch(val) {
            //         ctrl.properties.import_records = val;
            //     })
            // }
    }

    ctrl.init();

}])

.controller('backupCtrl', function($scope) {

})

.controller('signupCtrl', function($scope) {

})

.controller('recordDetailsCtrl', function($scope) {

})

.controller('categoriesCtrl', ['$scope', '$firebaseArray', 'Auth', function($scope, $firebaseArray, Auth) {
    var ctrl = this;
    var ref = firebase.database().ref().child("categories");
    // create a synchronized array
    // click on `index.html` above to see it used in the DOM!

    ctrl.properties = {
        categoryStoreName: 'categoryRecords',
        categoryStore: $firebaseArray(ref),
        newCategory: '',
        loggedIn: false
    }

    ctrl.actions = {
        init: function init() {
            $scope.$watch(function(argument) {
                return Auth.currentUserId;
            }, function() {
                if (Auth.currentUserId !== null) ctrl.properties.loggedIn = true
                else ctrl.properties.loggedIn = false;
            })
        },
        // categoryStoreExists: function categoryStoreExists(categoryStoreName) {
        //     return angular.isDefined($localStorage.get(categoryStoreName));
        // },
        // loadCategories: function loadCategories(argument) {
        //     ctrl.properties.categoryStore = $localStorage.get(ctrl.properties.categoryStoreName);
        // },
        addCategories: function addCategories() {
            if (Auth.currentUserId !== null) {
                ctrl.properties.categoryStore.$add(ctrl.properties.newCategory);
                ctrl.properties.newCategory = '';
            }
            // if (!ctrl.actions.categoryStoreExists(ctrl.properties.categoryStoreName)) {
            //     $localStorage.createStore(ctrl.properties.categoryStoreName);
            // }
            // $localStorage.add(ctrl.properties.categoryStoreName, {
            //     name: ctrl.properties.newCategory,
            //     id: 'Cat-' + Math.random().toString().substring(2, 7)
            // });
            // ctrl.properties.categoryStore = $localStorage.get(ctrl.properties.categoryStoreName)

        },
        editCategories: function editCategories(oldCategory, newCategory) {
            ctrl.actions.deleteCategories(oldCategory);
            ctrl.actions.addCategories(newCategory);
        },
        deleteCategories: function deleteCategories(rec) {
            ctrl.properties.categoryStore.$remove(rec)
                .then(function(ref) {
                    console.log('deleted successfully:' + ref);
                })
                .catch(function(ref) {
                    console.log('deleted unsuccessfully:' + ref);
                })

        }
    }

    ctrl.actions.init();
}])

.controller('settingsCtrl', function($scope) {

})

.controller('exportRecordsCtrl', ['$scope', 'ExcelService', function($scope, xlsvc) {
    var ctrl = this;

    var ref = firebase.database().ref().child("transRecords");
    ctrl.properties = {
        exportOptions: [{
            text: 'Local Device',
            value: 'local',
            selected: true
        }, {
            text: 'Google Docs',
            value: 'google',
            selected: false
        }, {
            text: 'Dropbox',
            value: 'dropbox',
            selected: false
        }],
        formatOptions: [{
            text: 'Excel',
            value: 'xls',
            selected: true
        }, {
            text: 'CSV',
            value: 'csv',
            selected: false
        }, {
            text: 'JSON',
            value: 'json',
            selected: false
        }],
        selectedExportOption: null,
        selectedFormatOption: null,
        selected_account: null,
        export_records: null
    }
    ctrl.actions = {
        init: function init(argument) {
            ctrl.actions.getTransRecords();
        },
        exportData: function exportData() {
            var exportTo = ctrl.properties.selectedExportOption,
                fileFormat = ctrl.properties.selectedFormatOption;

            /* output format determined by filename */
            //XLSX.writeFile(workbook, 'out.xlsx');
            /* at this point, out.xlsx is a file that you can distribute */

            //- write to binary string (using FileSaver.js):
            /* bookType can be 'xlsx' or 'xlsm' or 'xlsb' */



            function datenum(v, date1904) {
                if (date1904) v += 1462;
                var epoch = Date.parse(v);
                return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
            }

            function sheet_from_array_of_arrays(data, opts) {
                var ws = {};
                var range = {
                    s: {
                        c: 10000000,
                        r: 10000000
                    },
                    e: {
                        c: 0,
                        r: 0
                    }
                };
                for (var R = 0; R != data.length; ++R) {
                    for (var C = 0; C != data[R].length; ++C) {
                        if (range.s.r > R) range.s.r = R;
                        if (range.s.c > C) range.s.c = C;
                        if (range.e.r < R) range.e.r = R;
                        if (range.e.c < C) range.e.c = C;
                        var cell = {
                            v: data[R][C]
                        };
                        if (cell.v == null) continue;
                        var cell_ref = XLSX.utils.encode_cell({
                            c: C,
                            r: R
                        });

                        if (typeof cell.v === 'number') cell.t = 'n';
                        else if (typeof cell.v === 'boolean') cell.t = 'b';
                        else if (cell.v instanceof Date) {
                            cell.t = 'n';
                            cell.z = XLSX.SSF._table[14];
                            cell.v = datenum(cell.v);
                        } else cell.t = 's';

                        ws[cell_ref] = cell;
                    }
                }
                if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
                return ws;
            }
            var props = ctrl.properties;
            /* original data */

            var data = props.selected_account.accounts.records.map(
                function(item, i, arr) {
                    var that = [];
                    that.push((item.credit || null));
                    that.push((item.debit || null));
                    that.push(item.description);
                    that.push(item.reference_number);
                    that.push(item.transaction_date);
                    return that;
                });
            data.unshift(['credit', 'debit', 'description', 'reference_number', 'transaction_date'])
            var ws_name = "Transaction Records";

            function Workbook() {
                if (!(this instanceof Workbook)) return new Workbook();
                this.SheetNames = [];
                this.Sheets = {};
            }

            // var data = [
            //     [1, 2, 3],
            //     [true, false, null, "sheetjs"],
            //     ["foo", "bar", new Date("2014-02-19T14:30Z"), "0.3"],
            //     ["baz", null, "qux"]
            // ]

            var wb = new Workbook(),
                ws = sheet_from_array_of_arrays(data);

            /* add worksheet to workbook */
            wb.SheetNames.push(ws_name);
            wb.Sheets[ws_name] = ws;
            // var wbout = XLSX.write(wb, {
            //     bookType: 'xlsx',
            //     bookSST: true,
            //     type: 'binary'
            // });
            var wopts = {
                bookType: 'xlsx',
                bookSST: true,
                type: 'binary'
            };

            var wbout = XLSX.write(wb, wopts);

            function s2ab(s) {
                var buf = new ArrayBuffer(s.length);
                var view = new Uint8Array(buf);
                for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                return buf;
            }

            /* the saveAs call downloads a file on the local machine */
            saveAs(new Blob([s2ab(wbout)], {
                type: ""
            }), "test.xlsx")
        },
        getTransRecords: function getTransRecords(argument) {
            ref.once('value', function(snap) {
                ctrl.properties.export_records = snap.val();
            });
        }
    }
    ctrl.actions.init();
}])

.controller('logoutCtrl', ['Auth', '$state', function(Auth, $state) {
    Auth.firebaseAuth.$signOut();
    $state.go('login');
}])

.controller('accountCtrl', ['$scope', 'Auth', '$firebaseArray', function($scope, Auth, $firebaseArray) {
    var ctrl = this;
    var ref = firebase.database().ref().child("accounts");

    ctrl.properties = {
        accountStore: [],
        accountRecord: null,
        friends: [],
        profile: {
            displayName: '',
            email: ''
        },
        loggedIn: false
    }

    ctrl.actions = {
        init: function init() {
            $scope.$watch(function() {
                return Auth.currentUserId;
            }, function() {
                if (Auth.currentUserId !== null) {
                    ctrl.properties.loggedIn = true;
                    ctrl.properties.profile.displayName = Auth.currentUserId.displayName;
                    ctrl.properties.profile.email = Auth.currentUserId.email;
                } else ctrl.properties.loggedIn = false;
            })
            var list = $firebaseArray(ref);
            list.$loaded()
                .then(function(res) {
                    ctrl.properties.accountStore = res;
                    ctrl.properties.accountRecord = res[0];
                    ctrl.properties.friends = res[0].user.friends;
                })
                .catch(function(error) {
                    console.log("AcctCtrl Error:", error);
                });
        },
        addFriend: function addFriend() {
            ctrl.properties.friends.push({
                email: '',
                permissionToView: true
            })
        },
        deleteFriend: function deleteFriend(rec) {
            ctrl.properties.friends = ctrl.properties.friends.filter(function(v, i, arr) {
                return this.$$hashKey !== v.$$hashKey;
            }, rec)
        },
        saveChanges: function saveChanges() {
            var rec = {
                user: {
                    uid: Auth.currentUserId.uid,
                    profile: ctrl.properties.profile,
                    friends: ctrl.properties.friends
                }
            }
            if (ctrl.properties.accountRecord.$id) {
                var record = ctrl.properties.accountRecord;
                record.user = rec.user;
                ctrl.properties.accountStore.$save(record)
                    .then(function(res) {
                        console.log('rec updated')
                    })
                    .catch(function(err) {
                        console.log('rec update error');
                        console.log(err);
                    });
            } else {
                $firebaseArray(ref).$add(rec)
                    .then(function(res) {
                        console.log('changes saved');
                        console.log(res);
                    })
                    .catch(function(err) {
                        console.log('error');
                        console.log(err);
                    });
            }

        }
    }
    ctrl.actions.init();
}]);