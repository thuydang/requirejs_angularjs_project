define([
		/* RequireJS modules definition files (w/o .js) */
		'app/app.module'
		//'bootstrap-dialog',
], function (app) {
	'use strict';


	// =====================================================================
	// Dialogs 
	// https://angular-ui.github.io/bootstrap/#/modal
	// - Passing data to modal: http://stackoverflow.com/questions/18576454/pass-parameter-to-modal
	// ======================================================================
	app.register.controller('CeoVulnDialogCtrl', 
			/* needed services */ ['$state', '$scope', '$uibModalInstance', 'dialogData',
			function ($state, $scope, $uibModalInstance, dialogData) {
				// dialogData is the item from ng-repeat
				$scope.item = dialogData;
				console.log(dialogData);

				$scope.selected = {
					//item: $scope.items[0]
				};

				$scope.ok = function () {
					$uibModalInstance.close($scope.selected);
				};

				$scope.cancel = function () {
					$uibModalInstance.dismiss('cancel');
				};

			}]); /// - controller

}); /// -- define




