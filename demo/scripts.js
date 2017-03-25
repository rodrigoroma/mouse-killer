var app = angular.module('app', [
    "mouseKiller",
    "toastr"
]);

app.config(['mouseKillerConfigProvider', function(mouseKillerConfigProvider) {
    mouseKillerConfigProvider.setTitleText('Be faster using the % shortcut');
    mouseKillerConfigProvider.setHintType('title');
}]);

app.controller('MainController', function($scope, toastr) {

    $scope.buttonAction = function(txt) {
        toastr.success(txt);
    }

});