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
			/* needed services */['$state', '$scope', '$timeout', '$uibModal', '$log',
            'EventAggregator', 'NetworkInfoWebsocketService', 'NetworkInfoRestServices', 'uiGmapGoogleMapApi',
            function ($state, $scope, $timeout, $uibModal, $log,
                EventAggregator, NetworkInfoWebsocketService, NetworkInfoRestServices, uiGmapGoogleMapApi) {

                // Controller Logic
                //
                // GMAP Control
                //
                //
                ///center at TU
                $scope.map = {
                    center: { latitude: 52.512230, longitude: 13.327135 },
                    zoom: 14,
                    onclick: {
                        click: function (maps, eventName, arguments) {
                            var e = arguments[0];
                            $scope.lat = e.latLng.lat();
                            $scope.lng = e.latLng.lng();
                            console.log("my lat is:" + $scope.lat + ", lng is:" + $scope.lng);
                        }
                    }
                };
                $scope.options = { scrollwheel: true };
                $scope.markers = [];
                $scope.coordsUpdates = 0;
                $scope.dynamicMoveCtr = 0;
                




                //uiGmapGoogleMapApi.then(function(maps) {
                //});

                // --


                // 
                // Directory Service Control
                // 

                //service to display in details
                $scope.dispServ = "";

                //type of services
                $scope.setRandom = false;

                //open the details' card
                $scope.detailed = false;

                //manual set locations
                $scope.locations = [];

                // List of services
                $scope.serviceList = [
                    {
                        name: "Weather",
                        area: "Berlin",
                        sensor: ['Temperature', 'Humidity']
                    },
                    {
                        name: "Parking",
                        area: "BErl",
                        sensor: ['Bike', 'Car']
                    }
                ];

                //array of temp changes
                $scope.tempArr = $scope.serviceList.slice();

                // service functions
                $scope.getService = function (service) {
                    console.log(service);
                    $scope.detailed = true;
                    $scope.dispServ = service;
                    $scope.dispServ.sensor = service.sensor;

                };




                $scope.setManual = function () {
                    console.log("inside");
                    var marker = new google.maps.Marker({
                        position: {
                            lat: parseFloat($scope.lat), lng: parseFloat($scope.lng)
                        },
                        id: Date.now(),
                        setMap: $scope.map,
                        title: "Alba is here"
                    });

                    $scope.markers.push(marker);
                    console.log($scope.markers);
                    

                };


                //  $scope.addService = function () {
                //     $scope.detailed = true;
                //};


                $scope.addServices = function () {
                    $scope.detailed = true;
                    $scope.tempArr.push({ 'name': $scope.search });
                    $scope.search = '';
                    console.log($scope.tempArr);
                    console.log($scope.serviceList);
                };

                $scope.editService = function ($index, i, updat) {
                    var place = $scope.change;
                    $scope.details = true;
                    console.log(index);
                    $scope.serviceList[index].i = "updat";
                    console.log(updat);

                };

                $scope.saveChanges = function () {
                    $scope.serviceList = $scope.tempArr;

                };


                $scope.cancelAll = function () {
                    $scope.tempArr = $scope.serviceList;
                };

                $scope.randomize = function () {
                    $scope.setRandom = true;
                };

                $scope.randomPos = function (event) {
                    $scope.setRandom = true;
                    $scope.positions = [[52.5128, 13.3119], [52.5127, 13.3120], [52.5125, 13.3121]];
                };


                //  $scope.addProperty = function (index) {
                //     $scope.serviceList[index].push({ '$scope.newProperty': 'Alba' });
                // }
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
