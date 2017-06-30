define([
    /* RequireJS modules definition files (w/o .js) */
    'app/app.module',
    'angular-wizard',
		'angular-google-maps',
    //'bootstrap-dialog',
    'app/common/jsUtils/designPatterns',
    'app/components/maincontent/networkInfoServices'
], function (app) {
    'use strict';


    app.register.controller('ServiceCtrl',
			/* needed services */['$state','$scope', '$timeout', '$uibModal', '$log',
                'EventAggregator', 'NetworkInfoWebsocketService', 'NetworkInfoRestServices', 'uiGmapGoogleMapApi',
                function ($state, $scope, $timeout, $uibModal, $log,
                EventAggregator, NetworkInfoWebsocketService, NetworkInfoRestServices, uiGmapGoogleMapApi) {

               // Controller Logic
							//
							// GMAP Control
							//
									//
							$scope.map = {center: {latitude: 52.1451, longitude: 13.6680 }, zoom: 12 };
    //$scope.map = {center: {latitude: 40.1451, longitude: -99.6680 }, zoom: 4 };
    $scope.options = {scrollwheel: false};
    $scope.coordsUpdates = 0;
    $scope.dynamicMoveCtr = 0;
    $scope.marker = {
      id: 0,
      coords: {
        latitude: 52.3451,
        longitude: 13.3680
      },
      options: { draggable: true },
      events: {
        dragend: function (marker, eventName, args) {
          $log.log('marker dragend');
          var lat = marker.getPosition().lat();
          var lon = marker.getPosition().lng();
          $log.log(lat);
          $log.log(lon);

          $scope.marker.options = {
            draggable: true,
            labelContent: "latitude: " + $scope.marker.coords.latitude + ' ' + 'longitude: ' + $scope.marker.coords.longitude,
            labelAnchor: "100 0",
            labelClass: "marker-labels"
          };
        }
      }
    };
    $scope.$watchCollection("marker.coords", function (newVal, oldVal) {
      if (_.isEqual(newVal, oldVal))
        return;
      $scope.coordsUpdates++;
    });
    $timeout(function () {
      $scope.marker.coords = {
        latitude: 52.3051,
        longitude: 13.3680
      };
      $scope.dynamicMoveCtr++;
      $timeout(function () {
        $scope.marker.coords = {
          latitude: 52.3051,
          longitude: 13.3680
        };
        $scope.dynamicMoveCtr++;
      }, 2000);
    }, 1000);		

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
                    $scope.serviceList[index].i ="updat" ;
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
