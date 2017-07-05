define([
    /* RequireJS modules definition files (w/o .js) */
    'app/app.module',
    'angular-wizard',
    'angular-google-maps',
    //'bootstrap-dialog',
    'app/common/jsUtils/designPatterns',
    'app/components/maincontent/networkInfoServices'
], function (app) {
    // 'use strict';


    app.register.controller('ServiceCtrl',
			/* needed services */['$state', '$scope', '$timeout', '$uibModal', '$log', '$mdDialog',
                'EventAggregator', 'NetworkInfoWebsocketService', 'NetworkInfoRestServices', 'uiGmapGoogleMapApi', '$element',
            function ($state, $scope, $timeout, $uibModal, $log, $mdDialog,
                EventAggregator, NetworkInfoWebsocketService, NetworkInfoRestServices, uiGmapGoogleMapApi, $element) {

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

                            } 
                           //     var e = arguments[0];
                             //   $scope.lat = e.latLng.lat();
                              //  $scope.lng = e.latLng.lng();
                               

                               // $scope.dispServ.area = cirlce;
                                //put the selected area in the temporary service (which is being modified)
                               
                                //see if markers are added in the array
                                
                              //  $scope.$apply();
                              



                            
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
                    sensor: "",
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

                //sensor to be added
                $scope.newSensor;

                // List of services
                $scope.serviceList = [
                    {
                        name: "Weather",
                        area: {},
                        sensor: ['Temperature', 'Humidity'],
                        selectedSensor: "",
                        selectedTypeOfSensor: "",
                        locations: []
                    },
                    {
                        name: "Parking",
                        area: {},
                        sensor: ['Bike', 'Car'],
                        selectedSensor: "",
                        selectedTypeOfSensor:"",
                        locations: []

                    }
                ];

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
                    $scope.search = '';
                    console.log($scope.tempArr);
                    //check if it is added to the real service list
                    console.log($scope.serviceList);
                };


                //when save button is pressed
                $scope.saveChanges = function () {
                    $scope.serviceList = $scope.tempArr;
                    //check if locations are saved
                    console.log($scope.serviceList[0].locations);
                    console.log($scope.serviceList[0].selectedSensor);
                };

                //when cancel button is pressed
                $scope.cancelAll = function () {
                    $scope.tempArr = $scope.serviceList;
                    $scope.dispServ = {
                        name: "",
                        area: {},
                        sensor: "",
                        selectedSensor: "",
                        selectedTypeOfSensor: "",
                        locations: []
                    };
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