var app = angular.module('app', [
    "mouseKiller",
    "toastr"
]);

app.config(['mouseKillerProvider', function(mouseKillerProvider) {
    mouseKillerProvider.setHint('title');
}]);

app.controller('MainController', function($scope, toastr) {
	$scope.toastr = toastr;
});