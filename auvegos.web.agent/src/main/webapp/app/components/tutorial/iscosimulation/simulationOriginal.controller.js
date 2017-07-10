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


    app.register.controller('ServiceCtrl',
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

                $scope.map = {



                    center: { latitude: 52.512230, longitude: 13.327135 },
                    zoom: 14,
                    markers: [],
                    events: {
                        click: function (maps, eventName, arguments) {
                            //
                            if ($scope.manual === true) {
                                if ($scope.dispServ.name === "") {
                                    alert("Select service first");
                                    console.log($scope.dispServ.name);
                                }
                                else {
                                    console.log($scope.dispServ.name);
                                    var e = arguments[0];
                                    $scope.lat = e.latLng.lat();
                                    $scope.lng = e.latLng.lng();
                                    console.log("my lat is:" + $scope.lat + ", lng is:" + $scope.lng);
                                    var marker = {
                                        id: Date.now(),
                                        coords: {
                                            latitude: $scope.lat,
                                            longitude: $scope.lng
                                        }
                                    };
                                    $scope.map.markers.push(marker);
                                    //put the selected area in the temporary service (which is being modified)
                                    $scope.dispServ.locations = $scope.map.markers;
                                    //see if markers are added in the array
                                    console.log($scope.dispServ.locations);
                                    $scope.$apply();
                                }
                            }

                            else if ($scope.setRandom === true) {
                                var e = arguments[0];
                                $scope.circles[0].center.latitude = e.latLng.lat();
                                $scope.circles[0].center.longitude = e.latLng.lng();

                                // refresh circle center
                                $scope.$apply();
                                //$scope.map.refresh = true;

                                //$scope.circle = new google.maps.Circle({
                                //  center: { latitude: 52.512230, longitude: 13.327135 },
                                //  radius: 500,
                                //  editable: true

                            }

                            else {
                                return;
                            }
                        }
                    }
                };
                $scope.options = { scrollwheel: true };
                /*   var drawingManager = new google.maps.drawing.DrawingManager({
                       //drawingMode: google.maps.drawing.OverlayType.MARKER,
                       drawingControl: true,
                       drawingControlOptions: {
                           position: google.maps.ControlPosition.TOP_RIGHT,
                           drawingModes: [
                               google.maps.drawing.OverlayType.MARKER,
                               google.maps.drawing.OverlayType.CIRCLE
                           ]
                       },
                       markerOptions: {
                           icon: 'images/POI-1.png'
                       },                                                              
                       circleOptions: {
                           fillColor: '#A0A0A0',
                           fillOpacity: 0.3,
                           strokeWeight: 1,
                           strokeOpacity: 0.5,
                           clickable: true,
                           editable: true,
                           draggable: true,
                           zIndex: 1
                       }
                   });
                   drawingManager.setMap($scope.map); */


                // Circle
                $scope.circles = [
                    {
                        id: 1,
                        center: {},
                        radius: 500,
                        stroke: {
                            color: '#08B21F',
                            weight: 2,
                            opacity: 1
                        },
                        fill: {
                            color: '#08B21F',
                            opacity: 0.5
                        },
                        geodesic: true, // optional: defaults to false
                        draggable: true, // optional: defaults to false
                        clickable: true, // optional: defaults to true
                        editable: true, // optional: defaults to false
                        visible: true, // optional: defaults to true
                        control: {},
                        events: {
                            radius_changed: function (googleCircle, eventName, circle) {
                                console.log("Radius changed 1: " + googleCircle + " " +
                                    "2: " + eventName + " " +
                                    "3: " + circle);
                            },
                            center_changed: function (googleCircle, eventName, circle) {
                                console.log("Center changed 2: " + googleCircle + " " +
                                    "2: " + eventName + " " +
                                    "3: " + circle);
                            }
                        }
                    }
                ];



                //uiGmapGoogleMapApi.then(function(maps) {
                //});

                // -------------------------------------------


                // 
                // Directory Service Control
                // 

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
