define([
    /* RequireJS modules definition files (w/o .js) */
    'app/app.module',
    'angular-wizard',
    'angular-google-maps',
    //'bootstrap-dialog',
    'app/components/tutorial/iscosimulation/servicemodule.service',
    'app/common/jsUtils/designPatterns',
    'app/components/maincontent/networkInfoServices'
], function (app) {
    // 'use strict';


    app.register.controller('ServiceElementsCtrl',
			/* needed services */['$state', '$scope', '$timeout', '$uibModal', '$log', '$mdDialog',
            'EventAggregator', 'NetworkInfoWebsocketService', 'NetworkInfoRestServices', 'ServiceModuleService', 'uiGmapGoogleMapApi', '$element',
            function ($state, $scope, $timeout, $uibModal, $log, $mdDialog,
                EventAggregator, NetworkInfoWebsocketService, NetworkInfoRestServices, ServiceModuleService, uiGmapGoogleMapApi, $element) {

                // elements needed from service module
                $scope.serviceList = ServiceModuleService.serviceList;
                $scope.dispServ = ServiceModuleService.dispServ;
                $scope.setRandom = true;


                //view helper elements
                $scope.newSensorBool = false;
                $scope.detailed = false;
                $scope.showType = false;
                $scope.manual = false;
                $scope.setRandom = false;
                $scope.newSensor;

                //array of temp changes (copied by value)
                $scope.tempArr = ServiceModuleService.serviceList.slice();

                //-----FUNCTIONS-------------------------------------------------------

                //add new service (WORKS)
                $scope.addServices = function () {
                    if ($scope.dispServ.name === "") {
                        $scope.dispServ.name = $scope.search;
                        ServiceModuleService.addServices($scope.search);

                        $scope.tempArr.push({ 'name': $scope.search });
                        $scope.search = '';
                        $scope.detailed = true;
                        console.log("Temporary array: " + $scope.tempArr);

                        console.log("Disp Servicee: " + $scope.dispServ.name);
                    }
                    else {
                        //to prevent overwriting a service
                        alert("Pres cancel or save to finish with  " + $scope.dispServ.name + "  Service and continue with a new service");
                    }
                };


                //select one of the services which u want to modify (i.e change sensor, add sensor, change area etc) (WORKS)
                $scope.getService = function (service) {
                    $scope.detailed = true;
                    ServiceModuleService.getService(service);
                    $scope.dispServ.name = service.name;
                    $scope.dispServ.sensor = service.sensor;
                };

                //decide the sensor (WORKS)
                $scope.selectSensor = function (item) {
                    ServiceModuleService.selectSensor(item);
                    $scope.showType = true;
                    $scope.dispServ.selectedSensor = item;
                    console.log("Selected Sensor: " + $scope.dispServ.selectedSensor);
                };

                //display the input box for new service (WORKS)
                $scope.addSensor = function () {
                    $scope.newSensorBool = true;
                    console.log($scope.newSensorBool);
                };


                //allow manual selection (WORKS)
                $scope.setManual = function () {
                    $scope.manual = true;
                    $scope.setRandom = false;
                    ServiceModuleService.setManual();
                    $scope.dispServ.selectedTypeOfSensor = "Manual";
                    console.log("Selected type of sensor: " + $scope.dispServ.selectedTypeOfSensor);

                };

                //allow random selections (WORKS)
                $scope.makeRandom = function () {
                    $scope.setRandom = true;
                    ServiceModuleService.makeRandom();
                    $scope.dispServ.selectedTypeOfSensor = "Random";
                };


                //add new sensor to the sensor list of the dispServ obj (changes will be ultimately saved on Save press) (WORKS)
                $scope.saveNewSenor = function () {
                    if ($scope.newSensor === '') {
                        alert("enter a sensor first");
                        console.log("Newwww: " + $scope.newSensor);
                    }
                    else {
                        ServiceModuleService.saveNewSenor($scope.newSensor);
                        $scope.dispServ.selectedSensor = $scope.newSensor;
                        $scope.showType = true;
                        console.log("Service list: " + $scope.serviceList);
                        console.log("In scope sensors: " + $scope.dispServ.sensor);
                        console.log("In scope selected sensor: " + $scope.dispServ.selectedSensor);
                    }
                }



                //when save button is pressed
                $scope.saveChanges = function () {
                    if ($scope.dispServ.name === "") {
                        alert("You do not have any changes to be saved");
                    }
                    else {
                        for (var i = 0; i < $scope.serviceList.length; i++) {
                            if ($scope.dispServ.name === $scope.serviceList[i].name) {
                                console.log("xx " + JSON.stringify($scope.dispServ));
                                console.log("yy " + JSON.stringify($scope.serviceList[i]));
                                if (!angular.equals($scope.serviceList[i].selectedSensor, $scope.dispServ.selectedSensor)) {
                                    $scope.serviceList[i] = $scope.dispServ;
                                    console.log("Updated service: " + $scope.serviceList[i].name);
                                    return;
                                }
                                else {
                                    alert("You cannot add an existing service");
                                }
                                return;
                            }
                            else {
                                $scope.serviceList.push($scope.dispServ);
                                return;
                            }
                        };
                        ServiceModuleService.saveChanges($scope.serviceList);
                        console.log("Locations: " + $scope.dispServ.locations);
                        $scope.dispServ = {
                            name: "",
                            area: {},
                            sensor: [],
                            selectedSensor: "",
                            selectedTypeOfSensor: "",
                            locations: []
                        };
                    }


                    //check if locations are saved
                    //  console.log(ServiceModuleService.serviceList[0].locations);
                    //  console.log(ServiceModuleService.serviceList[0].selectedSensor);
                };




                //when cancel button is pressed
                $scope.cancelAll = function () {
                    ServiceModuleService.cancelAll();
                    $scope.tempArr = ServiceModuleService.serviceList;
                    $scope.detailed = false;

                    $scope.dispServ = {
                        name: "",
                        area: {},
                        sensor: [],
                        selectedSensor: "",
                        selectedTypeOfSensor: "",
                        locations: []
                    };
                    //    $scope.circles[0].center = {};
                    console.log("Temparr: " + $scope.tempArr);
                    console.log("ServiceList: " + $scope.serviceList);
                    console.log("Dispserv: " + $scope.dispServ.name);
                    console.log("DispSErv sensor: " + $scope.dispServ.sensor);


                };




                $scope.visualize = function (service) {


                };

                //allow random generation (TODO)
                $scope.randomPos = function (event) {
                    $scope.setRandom = true;
                    $scope.positions = [[52.5128, 13.3119], [52.5127, 13.3120], [52.5125, 13.3121]];
                };


                $scope.clearSearchTerm = function () {
                    $scope.searchTerm = '';
                };
                // The md-select directive eats keydown events for some quick select
                // logic. Since we have a search input here, we don't need that logic.
                //  $element.find('input').on('keydown', function (ev) {
                //      ev.stopPropagation();
                // });

                //remove service (still not decided)
                $scope.removeService = function (index) {
                    //can add alert later


                    var x = document.getElementById("my select");
                    x.remove(x.selectedIndex);
                    // $scope.serviceList.splice(index, 1);
                    //  console.log(index)
                };




                // end of controller  */

            }]);

});


/*function displayLocation(latitude, longitude) {
    var request = new XMLHttpRequest();

    var method = 'GET';
    var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng='
        + latitude + ',' + longitude + '&sensor=true';
    var async = true;

    request.open(method, url, async);
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            var data = JSON.parse(request.responseText);
            var address = data.results[0];
            var value = address.formatted_address.split(",");
            count = value.length;
            country = value[count - 1];
            state = value[count - 2];
            city = value[count - 3];
            alert(city);
            // document.write(address.formatted_address);

        }
    };
    request.send();
};

var successCallback = function (position) {
    var x = position.coords.latitude;
    var y = position.coords.longitude;
    displayLocation(x, y);
};

var errorCallback = function (error) {

};

var options = {
    enableHighAccuracy: true,
    timeout: 1000,
    maximumAge: 0
};

navigator.geolocation.getCurrentPosition(successCallback, errorCallback,
    options);


*/
