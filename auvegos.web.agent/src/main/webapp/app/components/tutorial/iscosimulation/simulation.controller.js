define([
		/* RequireJS modules definition files (w/o .js) */
		'app/app.module',
		'angular-wizard',
		//'bootstrap-dialog',
		'app/common/jsUtils/designPatterns',
		'app/components/maincontent/networkInfoServices'
], function (app) {
	'use strict';


	app.register.controller('ServiceCtrl', 
			/* needed services */ ['$state', '$scope', '$timeout', '$uibModal', '$log', 
			'EventAggregator', 'NetworkInfoWebsocketService', 'NetworkInfoRestServices', 
			function ($state, $scope, $timeout, $uibModal, $log, 
				EventAggregator, NetworkInfoWebsocketService, NetworkInfoRestServices, WizardHandler) {

                // List of object
                $scope.serviceList = [
                    {
                        name: "weather",
                        type: "manual",
                        area: "Berlin",
                        sensors: [

                            {
                                name: "sensor1",
                                type: "temperature",
                                value: "23",
                                valueType: "C",
                                latitude: "32.9999",
                                longitude: "32.44444"
                            },
                            {
                                name: "sensor2",
                                type: "humidity",
                                value: "23",
                                valueType: "C",
                                latitude: "32.9999",
                                longitude: "32.44444"
                            }
                        ]
                    },
                    {
                        name: "weather2",
                        type: "manual",
                        area: "Berlin",
                        sensors: [

                            {
                                name: "sensor1",
                                type: "temperature",
                                value: "23",
                                valueType: "C",
                                latitude: "32.9999",
                                longitude: "32.44444"
                            },
                            {
                                name: "sensor2",
                                type: "humidity",
                                value: "23",
                                valueType: "C",
                                latitude: "32.9999",
                                longitude: "32.44444"
                            }
                        ]
                    }
                ];
                // Controller Logic
                var options = {
                    valueNames: ['id', 'service', 'sensor', 'type']
                };

                // service functions

                $scope.removeService = function (idx) {
                    $scope.serviceList.splice(idx, 1);
                    console.log(idx);
                };

           



             
                    
                   

                // end of controller
			}]);

    });
