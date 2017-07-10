// JavaScript source code




var servModule = angular.module('myApp', []);

servModule.controller('servicesController', function ($scope, theService) {
    $scope.theServices = theService;

    $scope.getService = function (service) {
        console.log(service);
        $scope.theServices.detailed = true;
        $scope.theServices.dispServ = service;
        $scope.theServices.dispServ.sensor = service.sensor;

    };

    //decide the sensor
    $scope.selectSensor = function (item) {
        $scope.theService.dispServ.selectedSensor = item;
        console.log($scope.dispServ.selectedSensor);
        $scope.theService.showType = true;
    }


});