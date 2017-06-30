define([
		/* RequireJS modules definition files (w/o .js) */
		'app/app.module',
		'angular-wizard',
		//'bootstrap-dialog',
		'app/common/jsUtils/designPatterns',
		'app/components/maincontent/networkInfoServices'
], function (app) {
	'use strict';


	app.register.controller('WizardCtrl', 
			/* needed services */ ['$state', '$scope', '$timeout', '$uibModal', '$log', 
			'EventAggregator', 'NetworkInfoWebsocketService', 'NetworkInfoRestServices', 'WizardHandler', 
			function ($state, $scope, $timeout, $uibModal, $log, 
				EventAggregator, NetworkInfoWebsocketService, NetworkInfoRestServices, WizardHandler) {

        $scope.canExit = true;
        $scope.stepActive = true;

        $scope.finished = function() {
            alert("Wizard finished :)");
        };
        $scope.logStep = function() {
            console.log("Step continued");
        };
        $scope.goBack = function() {
            WizardHandler.wizard().goTo(0);
        };
        $scope.exitWithAPromise = function() {
            var d = $q.defer();
            $timeout(function() {
                d.resolve(true);
            }, 1000);
            return d.promise;
        };
        $scope.exitToggle = function() {
            $scope.canExit = !$scope.canExit;
        };
        $scope.stepToggle = function() {
            $scope.stepActive = !$scope.stepActive;
        }
        $scope.exitValidation = function() {
            return $scope.canExit;
        };

			}]);

});
