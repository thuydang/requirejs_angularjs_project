define([
		/* RequireJS modules definition files (w/o .js) */
		'app/app.module',
		'app/common/jsUtils/designPatterns',
		'app/components/maincontent/networkInfoServices'
], function (app) {
	'use strict';


	app.register.controller('TopBannerCtrl', 
			/* needed services */ ['$state', '$scope', 'EventAggregator', 'NetworkInfoWebsocketService',
			function ($state, $scope, EventAggregator, NetworkInfoWebsocketService) {

				// ======================================================================
				// Utility functions
				// ======================================================================

				// ======================================================================
				// Scope variables
				// ======================================================================
				($scope.reloadScopeVariable = function(){
					// List of network info timestamps sorted descendingly
					var firstKey = NetworkInfoWebsocketService.networkInfoKeyList[0];
					$scope.networkData = NetworkInfoWebsocketService.networkInfoList[firstKey];
					// Current report timestamp
					$scope.timestamp = $scope.networkData.statistics.timestamp;
					//$scope.timestamp = "26 16:32:44 CEST 2016";
					console.log($scope.timestamp);

					// Set comparative timestamp
					var secondKey = NetworkInfoWebsocketService.networkInfoKeyList[1];
					if(secondKey === undefined){
						$scope.comparativeTimestamp = $scope.timestamp;
					} else {
						$scope.comparativeTimestamp = secondKey;
					}

					// Dropdown: Timestamp to put in banner dropdown
					$scope.dropdownItems = NetworkInfoWebsocketService.networkInfoKeyList.slice(1);
				})();
				 //$scope.reloadScopeVariable(); // auto executed function
				
				// ======================================================================
				// Get data from NetworkInfoWebsocketService callback 
				// ======================================================================
				NetworkInfoWebsocketService.addCallback(function(message) {
					// New data arrived at NetworkInfoWebsocketService
					$scope.$apply(function () {
						// All data are put in networkInfoList
						//console.log(JSON.stringify(NetworkInfoWebsocketService.networkInfoList));
						$scope.reloadScopeVariable();
					}); // error handling
					//$scope.$apply();
				});

				// ======================================================================
				// Components
				// ======================================================================

				/** Dropdown */
				$scope.status = {
					isopen: false
				};

				$scope.toggled = function(open) {
					console.log('Dropdown is now: ', open);
				};

				$scope.toggleDropdown = function($event) {
					$event.preventDefault();
					$event.stopPropagation();
					$scope.status.isopen = !$scope.status.isopen;
				};

				// handle actions
				$scope.setSelectedItem = function( item ) {
					$scope.seltectedItem = item;
					$scope.timestamp = item;
					$scope.comparativeTimestamp = item;
					console.log("Banner dropdown selected: " + item);
					EventAggregator.publish('TopBannerDropdownEvent', [item]);
					//notifyBannerDropdownListener(item);
				};

				// Notify ceo view to show comparativeTimestamp at first load 
				$scope.seltectedItem = $scope.comparativeTimestamp;

			}]); //-- controller

}); ///-- define
