define([
		/* RequireJS modules definition files (w/o .js) */
		'app/app.module',
		'cytoscape',
		'angular-utils-pagination',
		'app/components/traffic-analysis/trafficanalysisservices'
], function (app, cytoscape) {
	'use strict';


	app.register.controller('TrafficAnalysisCtrl', 
			/* needed services */ ['$state', '$scope', '$timeout', 'TrafficAnalysisServices', 'NetworkTopologyServices', 
			       				'IPLayerDisplay', 'TrafficAnalysisViewServices', 'EventAggregator',
			function ($state, $scope, $timeout, TrafficAnalysisServices, NetworkTopologyServices, 
					IPLayerDisplay,TrafficAnalysisViewServices, EventAggregator) {

				// set the radio option for the table radio group
				$scope.tableType = 'option1';
				// set the radio option for the chart radio group
				$scope.chartType = 'option1';
				
				//Test Data
				var flowChartData = [{"values":[{"x":"101.98.112.4","y":4,"label":"Benign"},{"x":"101.98.112.3","y":3,"label":"Benign"},{"x":"101.98.112.6","y":5,"label":"Benign"},{"x":"101.98.112.5","y":7,"label":"Benign"},{"x":"101.98.112.2","y":7,"label":"Benign"},{"x":"101.98.112.1","y":2,"label":"Benign"},{"x":"111.111.111.119","y":7,"label":"Benign"},{"x":"10.0.2.9","y":4,"label":"Benign"},{"x":"111.111.111.117","y":5,"label":"Benign"},{"x":"111.111.111.118","y":4,"label":"Benign"},{"x":"10.0.2.6","y":5,"label":"Benign"},{"x":"10.0.2.5","y":5,"label":"Benign"},{"x":"10.0.2.8","y":4,"label":"Benign"},{"x":"10.0.2.7","y":5,"label":"Benign"},{"x":"120.110.211.21","y":3,"label":"Benign"},{"x":"10.0.2.2","y":5,"label":"Benign"},{"x":"10.0.2.1","y":3,"label":"Benign"},{"x":"10.0.2.4","y":4,"label":"Benign"},{"x":"111.111.111.120","y":2,"label":"Benign"},{"x":"111.111.111.121","y":5,"label":"Benign"},{"x":"10.0.2.3","y":6,"label":"Benign"},{"x":"120.110.211.20","y":3,"label":"Benign"},{"x":"111.111.111.115","y":5,"label":"Benign"},{"x":"111.111.111.116","y":3,"label":"Benign"},{"x":"10.0.2.11","y":2,"label":"Benign"},{"x":"111.111.111.113","y":11,"label":"Benign"},{"x":"10.0.2.12","y":5,"label":"Benign"},{"x":"120.110.211.5","y":5,"label":"Benign"},{"x":"10.0.2.13","y":4,"label":"Benign"},{"x":"111.111.111.114","y":6,"label":"Benign"},{"x":"120.110.211.6","y":4,"label":"Benign"},{"x":"120.110.211.3","y":3,"label":"Benign"},{"x":"10.0.2.14","y":5,"label":"Benign"},{"x":"111.111.111.112","y":4,"label":"Benign"},{"x":"10.0.2.15","y":7,"label":"Benign"},{"x":"120.110.211.4","y":3,"label":"Benign"},{"x":"10.0.2.16","y":5,"label":"Benign"},{"x":"120.110.211.1","y":8,"label":"Benign"},{"x":"120.110.211.2","y":5,"label":"Benign"},{"x":"10.0.2.17","y":7,"label":"Benign"},{"x":"101.98.112.4","y":1,"label":"Malicious"},{"x":"101.98.112.3","y":1,"label":"Malicious"},{"x":"101.98.112.1","y":1,"label":"Malicious"},{"x":"10.0.2.9","y":1,"label":"Malicious"},{"x":"111.111.111.117","y":2,"label":"Malicious"},{"x":"111.111.111.118","y":1,"label":"Malicious"},{"x":"10.0.2.5","y":1,"label":"Malicious"},{"x":"10.0.2.7","y":1,"label":"Malicious"},{"x":"10.0.2.2","y":1,"label":"Malicious"},{"x":"120.110.211.21","y":3,"label":"Malicious"},{"x":"10.0.2.1","y":1,"label":"Malicious"},{"x":"10.0.2.4","y":1,"label":"Malicious"},{"x":"111.111.111.121","y":2,"label":"Malicious"},{"x":"10.0.2.3","y":1,"label":"Malicious"},{"x":"120.110.211.20","y":1,"label":"Malicious"},{"x":"10.0.2.12","y":3,"label":"Malicious"},{"x":"120.110.211.5","y":1,"label":"Malicious"},{"x":"111.111.111.113","y":1,"label":"Malicious"},{"x":"111.111.111.114","y":1,"label":"Malicious"},{"x":"120.110.211.6","y":2,"label":"Malicious"},{"x":"10.0.2.14","y":1,"label":"Malicious"},{"x":"10.0.2.15","y":3,"label":"Malicious"},{"x":"111.111.111.112","y":1,"label":"Malicious"},{"x":"120.110.211.4","y":2,"label":"Malicious"},{"x":"10.0.2.16","y":3,"label":"Malicious"},{"x":"120.110.211.1","y":1,"label":"Malicious"}],"key":"Flows Target Ips"}];
				
				$.getJSON("app/components/traffic-analysis/data/flows.json", function(json) {
				    $scope.flows = json;
				});
				
				$.getJSON("app/components/traffic-analysis/data/dns.json", function(json) {
				    $scope.dnsDataAll = json;
					$scope.currentDnsItems = $scope.dnsDataAll;
					$scope.showTrafficAnalysis();
				});

				
				TrafficAnalysisViewServices.init($scope);
				TrafficAnalysisViewServices.formTrafficAnalysisCharts(flowChartData, $scope);
				
				
				EventAggregator.subscribe("SelectHostInTrafficAnalysisViewEvent", function(msg) {
					
					var jointMSG;
					if (typeof msg !== 'undefined') {
						jointMSG = msg.join();
					} else {
						jointMSG = undefined;
					}
					var ipList = [];
					ipList = jointMSG.split(",");
					$scope.updateChartAccordingToHost($scope, ipList);
					$scope.updateTable(ipList);
					if ($scope.chartType == "option1") {
						$scope.openNetworkFlowDensityChart();
					} else if($scope.chartType == "option2") {
						$scope.openNetworkTotalBytesChart();
					} else if($scope.chartType == "option3") {
						$scope.openNetworkPacketCountChart();
					} else if($scope.chartType == "option4") {
						$scope.openNetworkPacketByteCountChart();
					} else if($scope.chartType == "option5") {
						$scope.openNetworkPacketDurationChart();
					}
					$scope.$apply();
					
				});
				EventAggregator.publish('UpdateTopoplogy');
				
				EventAggregator.subscribe("SelectSubnetInTrafficAnalysisViewEvent", function(msg) {
					
					var jointMSG;
					if (typeof msg !== 'undefined') {
						jointMSG = msg.join();
					} else {
						jointMSG = undefined;
					}
					
					var ipList = [];
					ipList = jointMSG.split(",");

					$scope.updateChartAccordingToHost($scope, ipList);
					$scope.updateTable(ipList);
					if ($scope.chartType == "option1") {
						$scope.openNetworkFlowDensityChart();
					} else if($scope.chartType == "option2") {
						$scope.openNetworkTotalBytesChart();
					} else if($scope.chartType == "option3") {
						$scope.openNetworkPacketCountChart();
					} else if($scope.chartType == "option4") {
						$scope.openNetworkPacketByteCountChart();
					} else if($scope.chartType == "option5") {
						$scope.openNetworkPacketDurationChart();
					}
 					
					$scope.$apply();
					
				});
				EventAggregator.publish('UpdateTopoplogy');
				
				EventAggregator.subscribe("SelectAllNetworkEvent", function(msg) {
					
					var jointMSG;
					if (typeof msg !== 'undefined') {
						jointMSG = msg.join();
					} else {
						jointMSG = undefined;
					}
					var ipList = [];
					ipList = jointMSG.split(",");

					$scope.updateChartAccordingToHost($scope, ipList);
					$scope.updateTable(ipList);
					if ($scope.chartType == "option1") {
						$scope.openNetworkFlowDensityChart();
					} else if($scope.chartType == "option2") {
						$scope.openNetworkTotalBytesChart();
					} else if($scope.chartType == "option3") {
						$scope.openNetworkPacketCountChart();
					} else if($scope.chartType == "option4") {
						$scope.openNetworkPacketByteCountChart();
					} else if($scope.chartType == "option5") {
						$scope.openNetworkPacketDurationChart();
					}
					
					$scope.$apply();
					
				});
				EventAggregator.publish('UpdateTopoplogy');
			}]); // -- END
		});
