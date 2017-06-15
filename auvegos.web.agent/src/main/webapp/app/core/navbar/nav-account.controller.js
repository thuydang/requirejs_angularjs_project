define([
		/* RequireJS modules definition files (w/o .js) */
		'app/app.module',
		//'bootstrap-dialog',
		'app/common/jsUtils/designPatterns'
], function (app) {
	'use strict';


	app.register.controller('NavAccountCtrl', 
			/* needed services */ ['$state', '$scope', '$timeout', '$log', 
			'EventAggregator',
			function ($state, $scope, $timeout, $log, 
				EventAggregator) {

				// ======================================================================
				// Controller Variables 
				// ======================================================================

				/* Quick hack for role abbrev.*/
				//console.log($state);
				if ($state.current.name.indexOf("networkParent")>=0) {
					$scope.account = "SO";
				} else {
					$scope.account = "CEO";
				}

				/*
				$scope.accountClick = function() {
					if ($state.current.name.indexOf("networkParent")>=0) {
						$scope.account = "SO";
					} else {
						$scope.account = "CEO";
					}

				};
				*/

			}]);

});
