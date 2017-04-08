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

    $scope.openSweetAlert = function () {
        swal({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'success',

            showCancelButton: true,
            cancelButtonColor: '#d33',
            cancelButtonText: 'No',

            confirmButtonText: 'Yes'
        }).then(function () {
            toastr.info('You clicked yes')
        }, function () {
            toastr.error('You clicked no')
        })
    }

});