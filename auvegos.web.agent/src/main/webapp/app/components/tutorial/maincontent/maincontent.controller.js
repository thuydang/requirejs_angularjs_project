define([
		/* RequireJS modules definition files (w/o .js) */
		'app/app.module',
		//'bootstrap-dialog',
		'app/common/jsUtils/designPatterns',
		'app/components/maincontent/networkInfoServices'
], function (app) {
	'use strict';


	app.register.controller('MainContentCtrl', 
			/* needed services */ ['$state', '$scope', '$timeout', '$uibModal', '$log', 
			'EventAggregator', 'NetworkInfoWebsocketService', 'NetworkInfoRestServices',
			function ($state, $scope, $timeout, $uibModal, $log, 
				EventAggregator, NetworkInfoWebsocketService, NetworkInfoRestServices) {

				// ======================================================================
				// Controller Variables & Functions
				// ======================================================================

				/** Scope variables to be watched */
				// http://stackoverflow.com/questions/15112584/using-scope-watch-and-scope-apply-in-angularjs

				$scope.setReferenceResult = function () {
					// get current ref. result index
				  var list = NetworkInfoWebsocketService.networkInfoKeyList
					var index = list
						//.map(function(e) { return e.name; })
						.indexOf($scope.comparativeTimestamp);
					if (index < list.length -1) {
						index++;
					} else {
						index = 1;
					}
					console.log("this is it " + index);

					$scope.recalculateComparativeScopeVariable($scope.timestamp, list[index]);
				};

				// ======================================================================
				// Responsive content 
				// ======================================================================
				
				// =====================================================================
				// ui-bootstrap Modal: Dialogs 
				// ======================================================================
				/* Top 5 vulnerabilites dialog */
				$scope.dialogData = {"data":"this is it"};
				$scope.animationsEnabled = true;

				$scope.openVulnDialog = function (data, index) {

					var modalInstance = $uibModal.open({
						animation: $scope.animationsEnabled,
						templateUrl: 'app/components/maincontent/ceo.vuln.dialog.tpl.html',
						controller: 'CeoVulnDialogCtrl',
						//size: size,
						resolve: {
							dialogData: function () {
								data.percent= $scope.getRandomNumberSigned($scope.BugVariationNum, index);
								return data;
							}
						}
					});

					modalInstance.result.then(function (selectedItem) {
						$scope.selected = selectedItem;
					}, function () {
						$log.info('Modal dismissed at: ' + new Date());
					});
				};

				$scope.toggleAnimation = function () {
					$scope.animationsEnabled = !$scope.animationsEnabled;
				};

				/* Top 5 vuln. products dialog */
				$scope.openProductDialog = function (data, index) {

					var modalInstance = $uibModal.open({
						animation: $scope.animationsEnabled,
						templateUrl: 'app/components/maincontent/ceo.product.dialog.tpl.html',
						controller: 'CeoVulnDialogCtrl',
						//size: size,
						resolve: {
							dialogData: function () {
								data.percent= $scope.getRandomNumberSigned($scope.SoftwareVariationNum, index);
								return data;
							}
						}
					});

					modalInstance.result.then(function (selectedItem) {
						$scope.selected = selectedItem;
					}, function () {
						$log.info('Modal dismissed at: ' + new Date());
					});
				};

				// ======================================================================
				// Some Utility Functions
				// ======================================================================
				// Info about angular infdig prblem as described here:
				// http://stackoverflow.com/a/32585468
				//
				$scope.randomArray = [];

				$scope.randomGenerator = function () {
					// do some random here!
					var x = Math.floor((Math.random() * 4) + 1);
					var y;
					if (x==1){
						y=Math.floor((Math.random() * 10) + 1);
					} else if (x==2) {
						y=Math.floor((Math.random() * 100) + 1);
					} else if (x==3) {
						y=Math.floor((Math.random() * 1000) + 1);
					} else if (x==4) {
						y=Math.floor((Math.random() * 10000) + 1);
					}
					return y;
				};

				/** Function for random calculation */
				// Returns a random number between min (inclusive) and max (exclusive)
				$scope.getRandomArbitrary = function(min, max) {
					return Math.floor(Math.random() * (max - min)) + min;
				};
				
				/** Getter function called by html */
				$scope.getRandomNumber = function (index) {
					return $scope.randomArray[index];
				};
				// 
				$scope.getRandomNumber = function (arrayName, index) {
					return arrayName[index];
				};

				$scope.getRandomNumberSigned = function (arrayName, index) {
					//var num = (toPresent > 0) ? "+" + toPresent : "" + toPresent;
					return (arrayName[index] <0?'':'+') + arrayName[index];
				};

				$scope.makeNumberSigned = function (index) {
					//var num = (toPresent > 0) ? "+" + toPresent : "" + toPresent;
					return (index <0?'':'+') + index;
				};

				$scope.getAbs = function (num) {
					return Math.abs(num);
				}

				$scope.getPercent = function (numNew, numOld) {
					return Math.abs(Math.floor(numNew /numOld) *100);
				}

				$scope.getPercentDiff = function (numNew, numOld) {
					return Math.floor((numNew - numOld)/numOld *100);
				}
				// convert number to a string, then extract the first 2 digit
				$scope.getFirst2Digit = function (number) {
				  var numStr = String(number);
					var twonumStr = numStr.substring(0, 2);
				  // convert the digits back to an integer
				  var twod_number = Number(twonumStr);
					return parseFloat(Math.round(twod_number / 10 * 100) / 100).toFixed(1);
				}

				$scope.oneDecimal = function (number) {
					var rounded = Math.round( number * 10 ) / 10;
					return rounded.toFixed(1);
				}

				/** Softwares list randoms*/
				$scope.SoftwareNum = [];
				$scope.SoftwareVariationNum = [10, 8, 4, -5, -15];
				$scope.BugNum = [];
				$scope.BugVariationNum = [10, -2, 9, -5, -11];
				$scope.HostRisk = [];
				$scope.HostRiskVariation = [10, 5, 5, -3, -7];
				$scope.HostBug = [];
				$scope.HostBugDiff = [];

				$scope.textCutN = function (input, length) {
					var regex = /\s+/gi;
					//var inputWordCount = input.trim().replace(regex, ' ').split(' ').length;
					if (isNaN(length)) return input;
					if (length <= 0) return '';
          
					// trim the string to the maximum length
					input =	input.substring(0, length);
					//re-trim if we are in the middle of a word
					input = input.substr(0, Math.min(input.length, input.lastIndexOf(" ")));
					return input;
				};

				$scope.textCut = function (input) {
					var regex = /\s+/gi;
					var words = 8;
					//var inputWordCount = input.trim().replace(regex, ' ').split(' ').length;
					if (isNaN(words)) return input;
					if (words <= 0) return '';
					if (input) {
						var inputWords = input.split(/\s+/);
                        if (inputWords.length > words) {
                            var theLength = inputWords.length - words;
                            input = inputWords.slice(0, words).join(' ') + '...';
                        }
                    }
                    return input;
				};
				
				// self executing function to generate randomArrays
				(function(){
					var i;
					for (i = 0; i < 5; i++) { 
						$scope.randomArray.push( $scope.randomGenerator() );
						$scope.SoftwareNum.push( $scope.getRandomArbitrary(0,150) );
						//$scope.SoftwareVariationNum.push( $scope.getRandomArbitrary(-100,100) );
						$scope.BugNum.push( $scope.getRandomArbitrary(0,150) );
						//$scope.BugVariationNum.push( $scope.getRandomArbitrary(-100,100) );
						$scope.HostRisk.push( $scope.getRandomArbitrary(0,100) /10.0 );
						//$scope.HostRiskVariation.push( $scope.getRandomArbitrary(-100,100) );
						$scope.HostBug.push( $scope.getRandomArbitrary(0,100) );
						$scope.HostBugDiff.push( $scope.getRandomArbitrary(-10,10) );
					}

					//Bunch of code...
				})();


				// ======================================================================
				// SVG functions
				// http://tutorials.jenkov.com/svg/scripting.html
				// ======================================================================
				var svgElement = document.getElementById("svg_system_meter");
				//var width = svgElement.getAttribute("width");

				// setOpaque
				$scope.svgSetOpacity = function(svgElement) {
					svgElement.style.opacity = 0.5;	 
				};

				// setDisplay
				$scope.svgSetDisplay = function(svgElement) {
					svgElement.style.opacity = 0.6;	 
				};

				// enable arrow-out
				$scope.svgEnableArrowOut = function(chevronNum) {
					document.getElementById("chevron-" + chevronNum + "-arrow-out").style.display = "inline";
					document.getElementById("chevron-overlay-" + chevronNum).style.display = "inline";
				};
				// enable arrow-out
				$scope.svgEnableArrowIn = function(chevronNum) {
					document.getElementById("chevron-" + chevronNum + "-arrow-in").style.display = "inline";
					document.getElementById("chevron-overlay-" + chevronNum).style.display = "inline";
				};
				// reset
				$scope.svgChevronReset = function() {
					var chevronNum;
					for (chevronNum = 1; chevronNum <=10; chevronNum++) {
						document.getElementById("chevron-" + chevronNum + "-arrow-out").style.display = "none";
						document.getElementById("chevron-" + chevronNum + "-arrow-in").style.display = "none";
						document.getElementById("chevron-overlay-" + chevronNum).style.display = "none";
					}
				};
				
				// self executing all svg functions
				(function(){
					// Bunch of code...
					var svgElement;
					svgElement = document.getElementById("chevron");
					$scope.svgSetOpacity(svgElement);

					// Enable arrows
					//$scope.svgEnableArrowOut(3);
					//$scope.svgEnableArrowIn(8);
					
					//;
				})();

				///========= Large floating box position

				// distant from center point to box position = box height * tan(rad)
				$scope.largeBoxPosX = function(/*risk value*/x, h) {
					if (x < 1.5) x = 1.5;
					if (x > 7.5) x = 7.5;
					return Math.floor( h/Math.tan( ((11-x)*18) * Math.PI/180 ) );
				};

				// abs()
				$scope.abs = function(/*risk value*/a) {
					return Math.abs(a);
				};

				// ======================================================================
				// Websocket functions
				// ======================================================================
				/* Open websocket and handle network data */
				// https://parroty00.wordpress.com/2013/07/15/eventmachine-websocket-angularjs/
				// http://clintberry.com/2013/angular-js-websocket-service/
				/** TODO: these must be refreshed after new data is retrieved from Websocket */
				//$scope.networkData = $scope.dummyNetworkData;
				//console.log($scope.networkData);

				/* Get all network info data*/

				$scope.networkInfoList = {};
				// Init scope variables
				($scope.reloadScopeVariable= function(){
					
					$scope.networkInfoList = NetworkInfoWebsocketService.networkInfoList;
					console.log($scope.networkInfoList);

					//var firstKey = Object.keys(NetworkInfoWebsocketService.networkInfoList).sort()[0];
					var firstKey = NetworkInfoWebsocketService.networkInfoKeyList[0];
					$scope.networkData = $scope.networkInfoList[firstKey];

					console.log(($scope.networkData));

					$scope.softwareData = $scope.networkData.softwares[0];
					$scope.hostData = $scope.networkData.hosts[0];
					$scope.vulnerabilityData = $scope.networkData.vulnerabilites[0];
					$scope.statistics = $scope.networkData.statistics;
					$scope.timestamp = $scope.statistics.timestamp;

					var secondKey = NetworkInfoWebsocketService.networkInfoKeyList[1];
					if(secondKey === undefined){
						$scope.comparativeTimestamp = $scope.timestamp;
					} else {
						$scope.comparativeTimestamp = secondKey;
					}

				})();

				$scope.recalculateComparativeScopeVariable = function( currentTimestamp, refTimestamp){
					console.log("MainCtrl, comparing current: " + currentTimestamp + 
							" vs. ref: " + refTimestamp); 
					$scope.comparativeTimestamp = refTimestamp;
					$scope.refNetworkData = 
						$scope.networkInfoList[refTimestamp];
					$scope.refSoftwareData = $scope.refNetworkData.softwares[0];
					$scope.refHostData = $scope.refNetworkData.hosts[0];
					$scope.refVulnerabilityData = $scope.refNetworkData.vulnerabilites[0];
					$scope.refStatistics = $scope.refNetworkData.statistics;

					// Update Risk meter
					$scope.svgChevronReset();
					$scope.svgEnableArrowOut(Math.floor($scope.refStatistics.statisticOverallRisk));
					$scope.svgEnableArrowIn(Math.floor($scope.statistics.statisticOverallRisk));

					// Overview calculation directly
					// Product list
					/*
					$scope.SoftwareNum.push( $scope.getRandomArbitrary(0,150) );
					$scope.SoftwareVariationNum.push( $scope.getRandomArbitrary(-100,100) );
					// Vuln List
					$scope.BugNum.push( $scope.getRandomArbitrary(0,150) );
					$scope.BugVariationNum.push( $scope.getRandomArbitrary(-100,100) );
					// Host List
					$scope.HostRisk.push( $scope.getRandomArbitrary(0,100) /10.0 );
					$scope.HostRiskVariation.push( $scope.getRandomArbitrary(-100,100) );
					$scope.HostBug.push( $scope.getRandomArbitrary(0,100) );
					$scope.HostBugDiff.push( $scope.getRandomArbitrary(-10,10) );
					*/
					/// Updare difference
					var i=0;
					for ( i=0; i<5; i++ ){
						if ($scope.hostData[i] && ($scope.hostData[i].hostRiskIndex > 9) ) {
							$scope.HostRiskVariation[i] = Math.abs($scope.HostRiskVariation[i]);
						}
						//
						if ($scope.hostData[i] && $scope.refHostData[i] ) {
							$scope.HostBugDiff[i] = ( $scope.hostData[i].hostNumVulns - 
									$scope.refHostData[i].hostNumVulns);
						}
						//
						if ($scope.softwareData[i] && $scope.refSoftwareData[i] ) {
							$scope.SoftwareVariationNum[i] = $scope.getPercentDiff( $scope.softwareData[i].cpeNumVulns, $scope.refSoftwareData[i].cpeNumVulns );
						}
						//
						if ($scope.vulnerabilityData[i] && $scope.refVulnerabilityData[i] ) {
							$scope.BugVariationNum[i] = $scope.getPercentDiff( $scope.vulnerabilityData[i].cveNumAffectedHosts, $scope.refVulnerabilityData[i].cveNumAffectedHosts );
						}
					}
				};
				$scope.recalculateComparativeScopeVariable($scope.timestamp, $scope.comparativeTimestamp);

				// insert demo network as first key
				NetworkInfoRestServices.get().then(function(response){
					$scope.networkInfoList = {};
					var data = (response);
					$scope.networkInfoList[data.statistics.timestamp] = data;
					console.log($scope.networkInfoList);

					$scope.networkData = data;

					$scope.reloadScopeVariable(); // holding current scan result
					$scope.recalculateComparativeScopeVariable($scope.timestamp, $scope.comparativeTimestamp);
				});


				$scope.webSocketRequest = {"message":"give me network"};
				//
				// 1. open socket
				NetworkInfoWebsocketService.addCallback(function(message) {
					//http://jimhoskins.com/2012/12/17/angularjs-and-apply.html
					//$scope.networkData = JSON.parse( message );
					/** $timeout, $apply 
					 * http://stackoverflow.com/questions/12729122/angularjs-prevent-error-digest-already-in-progress-when-calling-scope-apply?answertab=active#21269546 */
					//$scope.$apply(function () {
					//console.log(JSON.stringify($scope.networkData));
					console.log(JSON.stringify(NetworkInfoWebsocketService.networkInfoList));
					$scope.reloadScopeVariable();
					$scope.recalculateComparativeScopeVariable($scope.timestamp, $scope.comparativeTimestamp);
					//}); // error handling
					//$scope.$apply();
				});

				//NetworkInfoWebsocketService.openWebsocket("ws://auvegos.aot.tu-berlin.de:8989/webgui/");
				//NetworkInfoWebsocketService.openWebsocket("ws://localhost:8989/webgui/");

				// 2. sent request. Reply is handled by callback.
				// service sends request NetworkInfoWebsocketService.sendMessage($scope.webSocketRequest);

				// ======================================================================
				// Handle Events 
				// ======================================================================
				EventAggregator.subscribe("TopBannerDropdownEvent", function(msg) {
					//$scope.topologyMessage = 'Topology Change: ' + msg.data;
					//updateTopology();
					console.log("TopBannerDropdownEvent" + msg);
					//$scope.$apply(function () {
						$scope.comparativeTimestamp = msg;
						$scope.recalculateComparativeScopeVariable($scope.timestamp, 
								$scope.comparativeTimestamp);
					//}); // error handling
					//$scope.$apply();
				});

			}]);

});
