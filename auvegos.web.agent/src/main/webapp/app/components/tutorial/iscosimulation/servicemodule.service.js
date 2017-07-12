define([
    /* RequireJS modules definition files (w/o .js) */
    'app/app.module',
    'app/common/jsUtils/designPatterns'
], function (app) {
    // 'use strict';

    app.register.factory('ServiceModuleService',
			/* needed services */['$state', '$rootScope', '$timeout', '$log',
            'EventAggregator',
            function ($state, $rootScope, $timeout, $log,
                EventAggregator) {

                // emty object
                var ServiceData = {};

                //service to display in details
                //put here because it's needed it the map as well
                ServiceData.dispServ = {
                    name: "",
                    area: {},
                    sensor: [],
                    selectedSensor: "",
                    selectedTypeOfSensor: "",
                    locations: []
                };

                //manual set locations
                ServiceData.locations = [];

                ServiceData.serviceList = [
                    {
                        name: "Weather",
                        area: {},
                        sensor: ['Temperature', 'Humidity'],
                        selectedSensor: "",
                        selectedTypeOfSensor: "",
                        type: "manual",
                        locations: [],
                        area: [],

                    },
                    {
                        name: "Parking",
                        area: {},
                        sensor: ['Bike', 'Car'],
                        selectedSensor: "",
                        selectedTypeOfSensor: "",
                        locations: [],
                        area: []

                    }];


                //service to visualize
                ServiceData.searchTerm;
                //---------------FUNCTIONS--------------------------------------------


                ServiceData.getHelpfulBools = function () {
                    return helpfulBools;
                }

                ServiceData.getNewSensorBool = function () {
                    return ServiceData.newSensorBool;
                };

                ServiceData.getTypeOfSensor = function () {
                    return ServiceData.dispServ.selectedTypeOfSensor;
                    console.log("getting type of sensor");

                };

                ServiceData.getDispServSensor = function () {
                    return ServiceData.dispServ.selectedSensor;
                };


                ServiceData.setdispServiceLocations = function (locations) {
                    ServiceData.dispServ.locations = locations;
                    //see if markers are added in the array
                    console.log(ServiceData.dispServ.locations);

                };
                // create the service object FUNCTIONS
                ServiceData.getServiceList = function () {
                    // in the future we request data from rest server
                    //return $http.get(urlBase + '/GetStudents');

                    // for now we just creat an object and return
                    return serviceList;

                };

                //when a service is selected
                //assign the existing service parameters to the temporary one (which is being modified)
                ServiceData.getService = function (service) {
                    console.log(service);
                    ServiceData.dispServ = service;
                    ServiceData.dispServ.sensor = service.sensor;
                    console.log("DispServ: " + ServiceData.dispServ.name);

                };

                //add new service (Works)
                ServiceData.addServices = function (newServ) {
                    ServiceData.dispServ.name = newServ;
                    //check if it is added to the real service list
                    console.log("Service List: " + ServiceData.serviceList);
                    //check dispServ
                    //  console.log("DispServ: " + ServiceData.dispServ.name);
                };

                //decide the sensor 
                ServiceData.selectSensor = function (item) {
                    ServiceData.dispServ.selectedSensor = item;
                    console.log(ServiceData.dispServ.selectedSensor);

                };


                //allow manual or random  selection
                ServiceData.setManual = function () {
                    ServiceData.dispServ.selectedTypeOfSensor = "Manual";
                    console.log("Service Data: " + ServiceData.dispServ.selectedTypeOfSensor);

                };

                ServiceData.makeRandom = function () {
                    ServiceData.dispServ.selectedTypeOfSensor = "Random";
                    console.log("YEah it's random");
                };

                //add the sensor to the list of sensors
                ServiceData.saveNewSenor = function (sens) {
                    ServiceData.dispServ.sensor.push(sens);
                    ServiceData.dispServ.selectedSensor = sens;
                    //test
                    console.log("List of sensors: " + ServiceData.dispServ.sensor);
                    console.log("Selected Sensor: " + ServiceData.dispServ.selectedSensor);
                }

                //--------SAVE & CANCEL FUNCTIONS----------------------------------------------------
                //when save button is pressed
                ServiceData.saveChanges = function (arr) {
                    ServiceData.serviceList = arr;
                    //check if locations are saved
   
                    console.log(" sensors of weather " + ServiceData.serviceList[0].sensor);
                    console.log("Service list array: " + ServiceData.serviceList);
                    console.log("locations in services file : " + ServiceData.dispServ.locations)
                    ServiceData.dispServ = {
                        name: "",
                        area: {},
                        sensor: [],
                        selectedSensor: "",
                        selectedTypeOfSensor: "",
                        locations: []
                    };
                };

                ServiceData.cancelAll = function () {

                    ServiceData.dispServ = {
                        name: "",
                        area: {},
                        sensor: [],
                        selectedSensor: "",
                        selectedTypeOfSensor: "",
                        locations: []
                    };
                    
                    console.log("ServiceData serviceList: " + ServiceData.serviceList)

                };
                // return the object
                return ServiceData;


                // end of service  */
            }]);

});

