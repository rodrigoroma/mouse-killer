var app = angular.module('app', [
    "mouseKiller",
    "toastr",
    "ui.bootstrap"
]);

app.config(['mouseKillerProvider', function (mouseKillerProvider) {
    mouseKillerProvider.setHint('title');
}]);

app.controller('MainController', function ($scope, toastr, $uibModal) {
    $scope.toastr = toastr;

    $scope.openModal = function () {
        $uibModal.open({
            templateUrl: 'modal1.html',
            size: 'lg',
            controller: function ($scope, toastr) {
                $scope.toastr = toastr;

                $scope.openModal = function () {
                    $uibModal.open({
                        templateUrl: 'modal2.html',
                        controller: function ($scope, toastr) {
                            $scope.toastr = toastr;
                        }
                    });
                };
                
            }
        });
    };

});