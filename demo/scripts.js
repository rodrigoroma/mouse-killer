var app = angular.module('app', [
    "mouseKiller",
    "toastr"
]);

app.config(['mouseKillerProvider', function(mouseKillerProvider) {
    mouseKillerProvider.setTitleText('Be faster using the % shortcut');
    mouseKillerProvider.setHintStyle('title');
}]);

app.controller('MainController', function($scope, toastr) {

    $scope.buttonAction = function(txt) {
        console.log(txt);
        toastr.success(txt);
    }

});