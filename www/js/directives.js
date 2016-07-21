angular.module('app.directives', [])

.directive('ngEnterKey', function() {
    return function(scope, element, attrs) {

        element.bind("keydown keypress", function(event) {
            var keyCode = event.which || event.keyCode;

            // If enter key is pressed
            if (keyCode === 13) {
                scope.$apply(function() {
                    // Evaluate the expression
                    scope.$eval(attrs.ngEnterKey);
                });

                event.preventDefault();
            }
        });
    };
})

.directive('ngFinishedLoading', ['$rootScope', function($rootScope) {
    return function(scope, element, attrs) {
        if (scope.$last) {
            $rootScope.$broadcast('ngFinishedLoading','done');
        }
    };
}]);