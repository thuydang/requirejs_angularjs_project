define(['app/app.module'], function (app) {
    'use strict';

		// ======================================================================
		// Event publish & subscribe 
		// ======================================================================
		app.register.factory('EventAggregator', 
				function () { /*NOTE: $scope is not avail for service */
					var cache = {};
					return {
						publish: function(topic, args) {
							//cache[topic] && $.each(cache[topic], function(func) {
							cache[topic] && angular.forEach(cache[topic], function(func) {
								func.apply(null, args || []);
							});
						},
							subscribe: function(topic, callback) {
								if(!cache[topic]) {
									cache[topic] = [];
								}
								cache[topic].push(callback);
								return [topic, callback];
							},
							unsubscribe: function(handle) {
								var t = handle[0];
								cache[t] && angular.forEach(cache[t], function(idx){
									if(this == handle[1]){
										cache[t].splice(idx, 1);
									}
								});
							}
						}
					}); //-- EventAggregator

				}); //-- Define

