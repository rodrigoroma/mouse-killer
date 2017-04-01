var app = angular.module('app', [
    "mouseKiller",
    "toastr"
]);

app.config(['mouseKillerConfigProvider', function(mouseKillerConfigProvider) {
    mouseKillerConfigProvider.setTitleText('Be faster using the % shortcut');
    mouseKillerConfigProvider.setHintStyle('title');
}]);

app.controller('MainController', function($scope, toastr) {

    $scope.buttonAction = function(txt) {
        console.log(txt);
        toastr.success(txt);
    }

});