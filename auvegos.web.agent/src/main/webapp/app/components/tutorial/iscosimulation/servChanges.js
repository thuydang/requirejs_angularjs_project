// JavaScript source code

var servChanges = angular.module('servChanges', ['mapModule','myApp']);

mapModule.controller('servChanges', function ($scope, theService) {
    $scope.theServices = theService;

    //add new service
    $scope.addServices = function () {
        $scope.theServices.detailed = true;
        $scope.theServices.tempArr.push({ 'name': $scope.search });
        $scope.theServices.dispServ.name = $scope.search;
        $scope.search = '';
        console.log($scope.theServices.tempArr);
        //check if it is added to the real service list
        console.log($scope.theServices.serviceList);
        //check dispServ
        console.log("DispServ" + $scope.theServices.dispServ.name);

    };


    //when save button is pressed
    $scope.saveChanges = function () {
        $scope.theServices.serviceList = $scope.theServices.tempArr;
        //check if locations are saved
        console.log($scope.theServices.serviceList[0].locations);
        console.log($scope.theServices.serviceList[0].selectedSensor);
    };

    //display the input box for new service
    $scope.addSensor = function () {
        $scope.theServices.newSensorBool = true;
    }

    //add new sensor to the sensor list of the dispServ obj (changes will be ultimately saved on Save press)
    $scope.saveNewSenor = function () {
        $scope.theServices.dispServ.sensor.push($scope.newSensor);
        $scope.theServices.dispServ.selectedSensor = $scope.newSensor;
        $scope.theServices.showType = true;
        console.log(dispServ.sensor);
        console.log($scope.dispServ.selectedSensor);
    }

    //when cancel button is pressed
    $scope.cancelAll = function () {
        $scope.theServices.tempArr = $scope.serviceList;
        $scope.theServices.dispServ = {
            name: "",
            area: {},
            sensor: [],
            selectedSensor: "",
            selectedTypeOfSensor: "",
            locations: []
        };
        $scope.circles[0].center = {};
        console.log($scope.tempArr);
        console.log($scope.serviceList);
        console.log($scope.dispServ.name);
        console.log($scope.dispServ.sensor);


    };

});