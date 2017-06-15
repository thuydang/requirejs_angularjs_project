define(['app/app.module'], function (app) {
	'use strict';

	app.register.controller('AppCtrl', function ($state, $scope, $mdSidenav) {

		// *********************************
    // Internal methods
    // *********************************

    /**
     * Hide or Show the 'left' sideNav area
     */
    $scope.toggleList = function() {
      $mdSidenav('left').toggle();
    }
	});

}); //-

