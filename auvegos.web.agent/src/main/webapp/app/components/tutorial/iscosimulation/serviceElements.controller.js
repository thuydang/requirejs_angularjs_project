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
                $scope.newSensor = "";
                $scope.search = "";

                //array of temp changes (copied by value)
                $scope.tempArr = ServiceModuleService.serviceList.slice();

                //-----FUNCTIONS-------------------------------------------------------

                //add new service (WORKS)
                $scope.addServices = function () {
                    if ($scope.search.length !== 0) {
                        if ($scope.dispServ.name === "") {
                            $scope.dispServ.name = $scope.search;
                            ServiceModuleService.addServices($scope.search);

                            $scope.tempArr.push({ 'name': $scope.search });
                            $scope.search = '';
                            $scope.detailed = true;
                            console.log("Inside add service (Temporary array): " + $scope.tempArr);

                            console.log("Inside add service(Disp Service name): " + $scope.dispServ.name);
                        }
                        else {
                            //to prevent overwriting a service
                            alert("Pres cancel or save to finish with  " + $scope.dispServ.name + "  Service and continue with a new service");
                        }
                    }
                    else {
                        alert("You have not entered a valid name");
                    }
                };


                //select one of the services which u want to modify (i.e change sensor, add sensor, change area etc) (WORKS)
                $scope.getService = function (service) {
                    if ($scope.dispServ.name === "") {
                        $scope.detailed = true;
                        ServiceModuleService.getService(service);
                        $scope.dispServ.name = service.name;
                        $scope.dispServ.sensor = service.sensor;
                        $scope.dispServ.locations = service.locations;
                    }
                    else {
                        alert("Pres cancel or save to finish with " + $scope.dispServ.name + " Service and continue with a new service ")
                    }
                };

                //decide the sensor (WORKS)
                $scope.selectSensor = function (item) {
                    ServiceModuleService.selectSensor(item);
                    $scope.showType = true;
                    $scope.dispServ.selectedSensor = item;
                    console.log("Selected Sensor: " + $scope.dispServ.selectedSensor);
                };

                //display the input box for the new sensor adding for the new service created (WORKS)
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
                    if ($scope.newSensor.length === 0) {
                        alert("enter a sensor first");

                    }
                    else {
                        ServiceModuleService.saveNewSenor($scope.newSensor);
                        $scope.dispServ.selectedSensor = $scope.newSensor; //does this cause a wrong pass by reff???
                        $scope.dispServ.sensor.push($scope.newSensor);
                        $scope.showType = true;
                        console.log("Inside saveNewSensor(Service list): " + $scope.serviceList);
                        console.log("Inside saveNewSensor In serviceElementsController ( sensors): " + $scope.dispServ.sensor);
                        console.log("Inside saveNewSensor In serviceElementsController( selected sensor:) " + $scope.dispServ.selectedSensor);
                    }
                }



                //when save button is pressed (Problems with updating)
                $scope.saveChanges = function () {
                    if ($scope.dispServ.name === "") {
                        alert("You do not have any changes to be saved");  //this is not necessary if the detailed card is closed 
                    }

                    else {
                     //   console.log("The length of service list is : " + $scope.serviceList.length);
                        for (var i = 0; i < $scope.serviceList.length; i++) {
                       //     console.log("Inside save: DispServ name: " + $scope.dispServ.name);
                        //    console.log("Inside save: Servicelist[i] name: " + $scope.serviceList[i].name);

                            if ($scope.dispServ.name === $scope.serviceList[i].name) {


                                if (!(angular.equals($scope.dispServ), $scope.serviceList[i])) {
                                    

                                    angular.copy($scope.dispServ, $scope.serviceList[i]);
                                    console.log("Inside save: DispServ : " + JSON.stringify($scope.dispServ));
                                    console.log("Inside save: Servicelist[i] : " + JSON.stringify($scope.serviceList[i]));
                                    console.log("Updated service sensor: " + $scope.serviceList[i].sensor);
                                    ServiceModuleService.saveChanges($scope.serviceList);
                                    $scope.dispServ = {
                                        name: "",
                                        area: {},
                                        sensor: [],
                                        selectedSensor: "",
                                        selectedTypeOfSensor: "",
                                        locations: []
                                    };
                                  //  console.log("this is the disp Serv name after saving, it should be nothing: " + $scope.dispServ.name);
                                    console.log("The service was updated");
                                    return;
                                }
                                else {
                                    console.log("No updates");
                                    $scope.dispServ = {
                                        name: "",
                                        area: {},
                                        sensor: [],
                                        selectedSensor: "",
                                        selectedTypeOfSensor: "",
                                        locations: []
                                    };
                                    console.log("this is the disp Serv name after saving, it should be nothing: " + $scope.dispServ.name);
                                    return;
                                }

                            }
                        }

                        $scope.serviceList.push($scope.dispServ);
                        ServiceModuleService.saveChanges($scope.serviceList);
                        console.log("(inside save function) Locations: " + $scope.dispServ.locations);
                        console.log("The length of service list is : " + $scope.serviceList.length);

                        $scope.dispServ = {
                            name: "",
                            area: {},
                            sensor: [],
                            selectedSensor: "",
                            selectedTypeOfSensor: "",
                            locations: []
                        };
                        console.log("this is the disp Serv name after saving, it should be nothing: " + $scope.dispServ.name);



                    }


                
            };


    //check if locations are saved
    //  console.log(ServiceModuleService.serviceList[0].locations);
    //  console.log(ServiceModuleService.serviceList[0].selectedSensor);





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
