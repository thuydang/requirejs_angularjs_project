define([
		/* RequireJS modules definition files (w/o .js) */
		'app/app.module',
		'angular-google-maps',
		//'bootstrap-dialog',
		'app/common/jsUtils/designPatterns',
		'app/components/maincontent/networkInfoServices'
], function (app) {
	'use strict';


	app.register.controller('GmapCtrl', 
			/* needed services */ ['$state', '$scope', '$timeout', '$uibModal', '$log', 
			'EventAggregator', 'uiGmapGoogleMapApi', 
			function ($state, $scope, $timeout, $uibModal, $log, 
				EventAggregator, uiGmapGoogleMapApi) {

					uiGmapGoogleMapApi.then(function(maps) {

    			});

 
			}]);
	//-- end gmap controller
});
