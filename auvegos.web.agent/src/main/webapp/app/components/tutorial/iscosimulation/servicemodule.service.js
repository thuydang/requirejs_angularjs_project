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
                    id: "",
                    providers: ["first", "second", "third"],
                    chosenProvider: "",
                    description: "",
                    acessibility: "",
                    area: {},
                    priority: "",
                    device: {
                        name: "",
                        owner: [],
                        activationStatus: "",
                        operationalArea: {
                            lat: "",
                            lng: "",
                            alt: "",
                        },
                        sensor: [],
                        selectedSensor: "",
                        selectedTypeOfSensor: "",
                        locations: [],

                    }

                };

                ServiceData.serviceList = [
                    {
                        name: "Weather",
                        id: "1",
                        providers: ["first", "second", "third"],
                        description: "bla bla bla blaa",
                        acessibility: "",
                        domain: "",
                        area: {},
                        priority: "",
                        device: {
                            name: "",
                            owner: [],
                            activationStatus: "",
                            sensor: ['Temperature', 'Humidity'],
                            selectedSensor: "",
                            selectedTypeOfSensor: "",
                            type: "manual",
                            locations: [],
                            area: {
                                lat: "",
                                lng: "",
                                alt: "",
                            },
                        }

                    },
                    {
                        name: "Parking",
                        id: "2",
                        providers: ["first", "second", "third"],
                        description: "Parking lalalala",
                        acessibility: "",
                        domain: "",
                        area: {},
                        device: {
                            name: "",
                            owner: [],
                            activationStatus: "",
                            sensor: ['Bike', 'Car'],
                            selectedSensor: "",
                            selectedTypeOfSensor: "",
                            locations: [],
                            area: {
                                lat: "",
                                lng: "",
                                alt: "",
                            },
                        }
                    },
                    {
                        name: "Sharing",
                        id: "3",
                        providers: ["first", "second", "third"],
                        description: "Sharing lalalala",
                        acessibility: "",
                        domain: "",
                        area: {},
                        device: {
                            name: "",
                            owner: [],
                            activationStatus: "",

                            sensor: ['Items', 'Rent'],
                            selectedSensor: "",
                            selectedTypeOfSensor: "",
                            locations: [],
                            area: {
                                lat: "",
                                lng: "",
                                alt: "",
                            },
                        }

                    },

                    {
                        name: "Drone",
                        id: "4",
                        providers: ["first", "second", "third"],
                        description: "Drone services lalalala",
                        acessibility: "",
                        domain: "",
                        area: {},
                        device: {
                            owner: [],
                            activationStatus: "",

                            sensor: ['City', 'Neighbourhood'],
                            selectedSensor: "",
                            selectedTypeOfSensor: "",
                            locations: [],
                            area: {
                                lat: "",
                                lng: "",
                                alt: "",
                            },
                        }
                    },



                ];


                //service to visualize
                ServiceData.searchTerm;
                //---------------FUNCTIONS--------------------------------------------



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

                //when a service is selected   (may not be needed)
                //assign the existing service parameters to the temporary one (which is being modified)
              //  ServiceData.getService = function (service) {
             //       console.log("This is the current service we will work on: " + service.name);
             //       ServiceData.dispServ = service;
             //       ServiceData.dispServ.sensor = service.sensor;
             //       console.log("DispServ: " + ServiceData.dispServ.name);

             //   };

                //add new service (Works)
                ServiceData.addServices = function (newServ) {
                    ServiceData.dispServ.name = newServ;
                    //check if it is added to the real service list
                    console.log("Inside add service (The service List): " + ServiceData.serviceList);
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
                    console.log("Service Data selectedTypeOF sensor: " + ServiceData.dispServ.selectedTypeOfSensor);

                };

                ServiceData.makeRandom = function () {
                    ServiceData.dispServ.selectedTypeOfSensor = "Random";
                    console.log("YEah it's random");
                };

                //add the sensor to the list of sensors
                ServiceData.saveNewSenor = function (sens) {

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

