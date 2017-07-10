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

		// create the service object FUNCTIONS

		// create the service object FUNCTIONS
                ServiceData.getServiceList = function () {
                    // in the future we request data from rest server
                    //return $http.get(urlBase + '/GetStudents');

                    // for now we just creat an object and return

                    var serviceList = [
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
                            selectedTypeOfSensor: "",
                            locations: []

                        }];
                    return serviceList;

                };

                ServiceData.addService = function (service) {
                    //return $http.post(urlBase + '/AddStudent', stud);

                    return {};
                };

		// return the object
                return ServiceData;

 
                // end of service  */
            }]);

});

