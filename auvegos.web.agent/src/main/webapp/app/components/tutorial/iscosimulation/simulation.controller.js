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
			/* needed services */['$state', '$scope', '$timeout', '$uibModal', '$log',
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
                        name: "Parking",
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


                $scope.updateService = function (service, prop, value) {
                    $scope.serviceList[prop] = value;
                };

                $scope.update = function (prop, value) {
                    $scope.onUpdate({ service: serviceList.name, prop: prop, value: value });
                };
            
            /*
            // Init list
            var contactList = new List('contacts', options);

            var idField = $('#id-field'),
                serviceField = $('#service-field'),
                sensorField = $('#sensor-field'),
                typeField = $('#type-field'),
                addBtn = $('#add-btn'),
                editBtn = $('#edit-btn').hide(),
                removeBtns = $('.remove-item-btn'),
                editBtns = $('.edit-item-btn');

            // Sets callbacks to the buttons in the list
            refreshCallbacks();

            addBtn.click(function () {
                contactList.add({
                    id: Math.floor(Math.random() * 110000),
                    service: serviceField.val(),
                    sensor: sensorField.val(),
                    type: typeField.val()
                });
                clearFields();
                refreshCallbacks();
            });

            editBtn.click(function () {
                var item = contactList.get('id', idField.val())[0];
                item.values({
                    id: idField.val(),
                    service: nameField.val(),
                    sens
               

            // end of controller  */

    }]);

});
