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
                $scope.showCircle = false;
                $scope.showMarkers = false;

              

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
                                
                                if (ServiceModuleService.dispServ.name === "") {
                                    alert("Select Service first");
                                }
                            
                                else {

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

                // end of controller  */
            }]);

});


