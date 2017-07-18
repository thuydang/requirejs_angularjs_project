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


    app.register.controller('MapElementsCtrl',
			/* needed services */['$state', '$scope', '$rootScope', '$timeout', '$uibModal', '$log', '$mdDialog',
            'EventAggregator', 'NetworkInfoWebsocketService', 'NetworkInfoRestServices', 'ServiceModuleService', 'uiGmapGoogleMapApi', '$element',
            function ($state, $scope, $rootScope, $timeout, $uibModal, $log, $mdDialog,
                EventAggregator, NetworkInfoWebsocketService, NetworkInfoRestServices, ServiceModuleService, uiGmapGoogleMapApi, $element) {

                // Controller Logic
                //
                // GMAP Control
                //
                //
                ///center at TU
                $scope.showCircle = false;
                $scope.showMarkers = false;

                $scope.nrOfRandomMarkers = 0;

                $scope.map = {
                    center: { latitude: 52.512230, longitude: 13.327135 },
                    zoom: 14,
                    markers: [],
                    events: {
                        click: function (maps, eventName, arguments) {
                            //chose markers or circle
                            console.log("entering the map");
                            console.log("Selected  sensor type: " + ServiceModuleService.dispServ.selectedTypeOfSensor);


                            if (ServiceModuleService.dispServ.selectedTypeOfSensor === "Manual") {

                                console.log("inside manual");

                                $scope.showMarkers = true;
                                $scope.showCircle = false;

                                var e = arguments[0];
                                $scope.lat = e.latLng.lat();
                                $scope.lng = e.latLng.lng();
                                console.log("my lat is:" + $scope.lat + ", lng is:" + $scope.lng);
                                var marker = {
                                    id: Date.now(),
                                    coords: {
                                        latitude: $scope.lat,
                                        longitude: $scope.lng

                                    },
                                    options: { draggable: true }
                                };
                                $scope.map.markers.push(marker);
                                $scope.$apply();

                                //put the selected area in the temporary service (which is being modified)
                                ServiceModuleService.dispServ.locations = $scope.map.markers;

                                console.log("MArkerks: " + ServiceModuleService.dispServ.locations);

                            }

                            else if (ServiceModuleService.dispServ.selectedTypeOfSensor === "Random") {
                                $scope.map.markers = [];
                                $scope.$apply();
                                $scope.showMarkers = false;
                                $scope.showCircle = true;
                                var e = arguments[0];
                                $scope.circles[0].center.latitude = e.latLng.lat();
                                $scope.circles[0].center.longitude = e.latLng.lng();

                                // refresh circle center
                                $scope.$apply();

                                ServiceModuleService.dispServ.area = $scope.circles;
                                console.log(ServiceModuleService.dispServ.area);

                            }
                            else {
                                return;

                            }
                        }
                    }
                };

                $scope.options = { scrollwheel: true };

                $scope.Math = window.Math;

                $scope.getRandomArbitrary = function (min, max) {
                    return Math.floor(Math.random() * (max - min)) + min;
                };

                $scope.theRandMArk = function () {
                    console.log("inside theRAndMArk");

                    for (var i = 0; i < $scope.nrOfRandomMarkers; i++) {
                        var aLAt = $scope.getRandomArbitrary(-$scope.circles[0].radius, $scope.circles[0].radius) / 120000 + $scope.circles[0].center.latitude;
                        var aLng = $scope.getRandomArbitrary(-$scope.circles[0].radius, $scope.circles[0].radius) / 120000 + $scope.circles[0].center.longitude;

                        var marker = {
                            id: Date.now(),
                            coords: {
                                latitude: aLAt,
                                longitude: aLng

                            }
                        };
                        $scope.map.markers.push(marker);

                        console.log($scope.getRandomArbitrary(-10, 10));
                        // console.log("Radius of the circle : " + $scope.circles[0].radius);
                        //console.log("markers's Latitude : " + marker.coords.latitude);
                        //console.log("marker's Langitude : " + marker.coords.longitude);

                    }
                };

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

                // Map events handling
                $scope.$on('REMOVE_CIRCLE', function (event, args) {
                    // remove all markers
                    $scope.circles = [];
                    $scope.map.markers = [];
                    console.log(args);
                });

                //add random markers
                $scope.$on('ADD_RANDOM_MARKERS', function (event, args) {
                    $scope.nrOfRandomMarkers = args.a;

                    console.log("NR of markers: " + $scope.nrOfRandomMarkers);
                    $scope.theRandMArk();


                });

                // Map events handling
                $scope.$on('REMOVE_MARKERS', function (event, args) {
                    // remove all markers
                    $scope.map.markers = [];
                    console.log(args);
                })


                // end of controller  */
            }]);

});


