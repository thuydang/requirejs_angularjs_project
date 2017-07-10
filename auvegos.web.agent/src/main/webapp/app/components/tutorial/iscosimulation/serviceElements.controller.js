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

                // Controller Logic
                //
                // GMAP Control
                //
                //
                ///center at TU



                $scope.manual = false;

                
                //service to display in details
                $scope.dispServ = {
                    name: "",
                    area: {},
                    sensor: [],
                    selectedSensor: "",
                    selectedTypeOfSensor: "",
                    locations: []
                };

                //type of services
                $scope.setRandom = false;

                //open the details' card
                $scope.detailed = false;

                //manual set locations
                $scope.locations = [];


                //service to visualize
                $scope.searchTerm;

                //to show adding part of the menu
                $scope.newSensorBool = false;

                //new sensor name
                $scope.newSensor;


                //showtype of sensor
                $scope.showType = false;


                // List of services
                $scope.serviceList = ServiceModuleService.getServiceList();

                //array of temp changes
                $scope.tempArr = $scope.serviceList.slice();

                // service functions

                //when a service is selected
                //assign the existing service parameters to the temporary one (which is being modified)
                $scope.getService = function (service) {
                    console.log(service);
                    $scope.detailed = true;
                    $scope.dispServ = service;
                    $scope.dispServ.sensor = service.sensor;

                };

                //decide the sensor
                $scope.selectSensor = function (item) {
                    $scope.dispServ.selectedSensor = item;
                    console.log($scope.dispServ.selectedSensor);
                    $scope.showType = true;
                }
                //allow manual selection
                $scope.setManual = function () {

                    console.log("inside");
                    $scope.dispServ.selectedTypeOfSensor = "Manual";
                    $scope.manual = true;
                    console.log($scope.dispServ.selectedTypeOfSensor);

                };

                //add new service
                $scope.addServices = function () {
                    $scope.detailed = true;
                    $scope.tempArr.push({ 'name': $scope.search });
                    $scope.dispServ.name = $scope.search;
                    $scope.search = '';
                    console.log($scope.tempArr);
                    //check if it is added to the real service list
                    console.log($scope.serviceList);
                    //check dispServ
                    console.log("DispServ" + $scope.dispServ.name);

                };


                //when save button is pressed
                $scope.saveChanges = function () {
                    $scope.serviceList = $scope.tempArr;
                    //check if locations are saved
                    console.log($scope.serviceList[0].locations);
                    console.log($scope.serviceList[0].selectedSensor);
                };

                //display the input box for new service
                $scope.addSensor = function () {
                    $scope.newSensorBool = true;
                }

                //add new sensor to the sensor list of the dispServ obj (changes will be ultimately saved on Save press)
                $scope.saveNewSenor = function () {
                    $scope.dispServ.sensor.push( $scope.newSensor );
                    $scope.dispServ.selectedSensor = $scope.newSensor;
                    $scope.showType = true;
                    console.log($scope.dispServ.sensor);
                    console.log($scope.dispServ.selectedSensor);
                }

                //when cancel button is pressed
                $scope.cancelAll = function () {
                    $scope.tempArr = $scope.serviceList;
                    $scope.dispServ = {
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


                $scope.makeRandom = function () {
                    $scope.setRandom = true;
                    $scope.dispServ.selectedTypeOfSensor = "Random";


                };

                $scope.visualize = function (service) {


                };

                //allow random generation (TODO)
                $scope.randomPos = function (event) {
                    $scope.setRandom = true;
                    $scope.positions = [[52.5128, 13.3119], [52.5127, 13.3120], [52.5125, 13.3121]];
                };

                $scope.addSensor = function () {
                    $scope.newSensorBool = true;
                    $scope.setRandom = true;
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
