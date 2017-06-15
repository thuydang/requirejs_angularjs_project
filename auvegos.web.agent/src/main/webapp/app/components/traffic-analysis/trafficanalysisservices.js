define(['app/app.module'], function (app) {
	'use strict';

	app.register.factory('TrafficAnalysisViewServices', ['$filter', 'EventAggregator', function($filter, EventAggregator) {

		var svc = {

				formTrafficAnalysisCharts: // Add charts

					function (statisticalTrafficData,scope) {
					var controllerScope = scope;

					controllerScope.updateChartAccordingToHost = function(scope, selectedIp) {

						var i;
						controllerScope.chartObjects = new Array();
						for (i=0; i < scope.flows.length; i++) {
							
							var inArray = false;
							var j;
							for (j = 0; j < controllerScope.chartObjects.length; j++) {
								var targetIpFirst = controllerScope.chartObjects[j].TargetIp;
								var targetIpSecond = scope.flows[i].TargetIp;
								
								var sourceIpFirst = controllerScope.chartObjects[j].SourceIp;
								var sourceIpSecond = scope.flows[i].SourceIp;

								if ((targetIpFirst == targetIpSecond) && (sourceIpFirst == sourceIpSecond)) {
									controllerScope.chartObjects[j].FlowCount = controllerScope.chartObjects[j].FlowCount + 1;
									controllerScope.chartObjects[j].TotalTransferredBytes = controllerScope.chartObjects[j].TotalTransferredBytes + scope.flows[i].TransferredBytes;
									controllerScope.chartObjects[j].PacketCount = controllerScope.chartObjects[j].PacketCount + scope.flows[i].PacketCount;
									controllerScope.chartObjects[j].PacketTransferredBytes = controllerScope.chartObjects[j].PacketTransferredBytes + scope.flows[i].PacketTransferredBytes;
									controllerScope.chartObjects[j].FlowDuration = controllerScope.chartObjects[j].FlowDuration + scope.flows[i].FlowDuration;
									inArray = true;
								}
							}
							if (!inArray) {
								var chartObject = new Object();
								chartObject.SourceIp = scope.flows[i].SourceIp;
								chartObject.TargetIp = scope.flows[i].TargetIp;
								chartObject.TotalTransferredBytes = scope.flows[i].TransferredBytes;
								chartObject.FlowCount  = 1;
								chartObject.PacketCount = scope.flows[i].PacketCount;
								chartObject.PacketTransferredBytes = scope.flows[i].PacketTransferredBytes;
								chartObject.FlowDuration = scope.flows[i].FlowDuration;
								controllerScope.chartObjects[controllerScope.chartObjects.length] = chartObject;
							} 
						}

						var chartFilteredObjects = [];
						var x;
						var size = 0;
						for (x=0; x < controllerScope.chartObjects.length; x++) {
							var y;
							for (y=0; y < selectedIp.length; y++) {
								
								if (selectedIp[y]=="AllDevices" && size <= 10) {
									chartFilteredObjects.push(controllerScope.chartObjects[x]);
									size++;
								}
								
								else if (controllerScope.chartObjects[x].SourceIp == selectedIp[y]) {
									chartFilteredObjects.push(controllerScope.chartObjects[x]);
								}
							}
						}

						controllerScope.chartFilteredObjects = chartFilteredObjects;
					}

					controllerScope.range = function (a,b) {
						var ret = [];
						for (var i = a; i < b; i++) {
							ret.push(i);
						}
						return ret;
					};

					controllerScope.openNetworkHostsChart = function() {
						d3.select("#chart").selectAll("*").remove();

						var selection = d3.select("#chart"); 
						WIDTH = selection[0][0].clientWidth - MARGIN.LEFT - MARGIN.RIGHT;
						colorScale = d3.scale.ordinal().domain(TYPES).range(TYPE_COLORS),
						highlightColorScale = d3.scale.ordinal().domain(TYPES).range(TYPE_HIGHLIGHT_COLORS),
						svg = d3.select("#chart").append("svg")
						// .style("width", WIDTH + MARGIN.LEFT +
						// MARGIN.RIGHT)
						.style("height", (HEIGHT + MARGIN.TOP + MARGIN.BOTTOM) + "px")
						.append("g")
						.attr("transform", "translate(" + MARGIN.LEFT + "," + MARGIN.TOP + ")");

						svg.append("g").attr("id", "links");
						svg.append("g").attr("id", "nodes");
						svg.append("g").attr("id", "collapsers");

						tooltip = d3.select("#chart").append("div").attr("id", "hosts-tooltip");

						tooltip.style("opacity", 0)
						.append("p")
						.attr("class", "hosts-value");

						biHiSankey = d3.biHiSankey();
						controllerScope.chart = biHiSankey;

						// Set the biHiSankey diagram properties
						biHiSankey
						.nodeWidth(NODE_WIDTH)
						.nodeSpacing(1)
						.linkSpacing(1)
						.arrowheadScaleFactor(0.5) // Specifies that 0.5 of
						// the link's stroke
						// WIDTH should be
						// allowed for the
						// marker at the end of
						// the link.
						.size([WIDTH, HEIGHT]);

						path = biHiSankey.link().curvature(0.55);

						defs = svg.append("defs");

						defs.append("marker")
						.style("fill", LINK_COLOR)
						.attr("id", "arrowHead")
						.attr("viewBox", "0 0 6 10")
						.attr("refX", "1")
						.attr("refY", "5")
						.attr("markerUnits", "strokeWidth")
						.attr("markerWidth", "1")
						.attr("markerHeight", "1")
						.attr("orient", "auto")
						.append("path")
						.attr("d", "M 0 0 L 1 0 L 6 5 L 1 10 L 0 10 z");

						defs.append("marker")
						.style("fill", OUTFLOW_COLOR)
						.attr("id", "arrowHeadInflow")
						.attr("viewBox", "0 0 6 10")
						.attr("refX", "1")
						.attr("refY", "5")
						.attr("markerUnits", "strokeWidth")
						.attr("markerWidth", "1")
						.attr("markerHeight", "1")
						.attr("orient", "auto")
						.append("path")
						.attr("d", "M 0 0 L 1 0 L 6 5 L 1 10 L 0 10 z");

						defs.append("marker")
						.style("fill", INFLOW_COLOR)
						.attr("id", "arrowHeadOutlow")
						.attr("viewBox", "0 0 6 10")
						.attr("refX", "1")
						.attr("refY", "5")
						.attr("markerUnits", "strokeWidth")
						.attr("markerWidth", "1")
						.attr("markerHeight", "1")
						.attr("orient", "auto")
						.append("path")
						.attr("d", "M 0 0 L 1 0 L 6 5 L 1 10 L 0 10 z");
						var n = new NetworkHosts();
						n.initDummy();
						biHiSankey
						.nodes(n.getNodes())
						.links(n.getLinks())
						.initializeNodes(function (node) {
							node.state = node.parent ? "contained" : "collapsed";
						})
						.layout(LAYOUT_INTERATIONS);

						disableUserInterractions(2 * TRANSITION_DURATION);

						update();
						d3.select(window).on("resize", controllerScope.resize);

					};

					controllerScope.resize = function() {
						var selection = d3.select("#chart"); 
						WIDTH = selection[0][0].clientWidth - MARGIN.LEFT - MARGIN.RIGHT;
						d3.select("#chart").select("svg").attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
						biHiSankey.size([WIDTH, HEIGHT]);
						biHiSankey.layout(LAYOUT_INTERATIONS);
						update();
					}


					controllerScope.resetChartsAll = function () {
						controllerScope.chartFilteredList = controllerScope.allChartItems;
						controllerScope.newEmpId = '';
						controllerScope.newName = '';
						controllerScope.newEmail = '';
						controllerScope.searchText = '';
						controllerScope.currentChartPage = 0;
						controllerScope.Header = ['','',''];
					};

					controllerScope.openNetworkFlowDensityChart = function() {
						svg = d3.select("#chart").select("svg");
						svg.selectAll("*").remove();
						svg.style("height", scope.getHeight() - 50 + "px")
						controllerScope.chartPageSize = 6;
						controllerScope.pageCount = 10;
						controllerScope.pageCountIncrement = 4;
						controllerScope.reverse = false;

						var chartData = [];
						var i;

						if (controllerScope.chartFilteredObjects != null) {
							var size = 0;
							for (i=0; i < controllerScope.chartFilteredObjects.length && size <= 8; i++) {
								chartData.push({"x":controllerScope.chartFilteredObjects[i].TargetIp,"y":controllerScope.chartFilteredObjects[i].FlowCount});
								size++;
							}
						}

						controllerScope.allChartItems = statisticalTrafficData[0]["values"];
						controllerScope.resetChartsAll();
						controllerScope.chartData = [{'key':"Network Flow Density",'values':chartData}];
						//	controllerScope.chartData = [statisticalTrafficData[0]];
						//	controllerScope.chartData = [{'values': controllerScope.chartObjects,"key":"test"}];
						//controllerScope.chartData = [{'key':statisticalTrafficData[0]["key"],'values':controllerScope.ChartItemsByPage[controllerScope.currentChartPage]}];
						nv.addGraph(function() {
							controllerScope.chart = nv.models.discreteBarChart()
							.x(function(d) { return d.x;})    // Specify the
							// data
							// accessors.
							.y(function(d) { return d.y;})
							//.staggerLabels(true)    // Too many bars and not
							// enough room? Try
							// staggering labels.
							.tooltips(false)        
							.showValues(true)       // ...instead, show the bar
							// value right on top of
							// each bar.
							.transitionDuration(350);
							/*
							 * chart.xAxis .tickFormat(function(d) { return
							 * operationCodeMap[""+d]; });
							 * 
							 * 
							 * chart.yAxis .tickFormat(d3.format('.02f'))
							 * .axisLabel("Count");
							 */

							d3.select('#chart svg')
							.datum(controllerScope.chartData)
							.call(controllerScope.chart);

							nv.utils.windowResize(scope.updateChart);

							return controllerScope.chart;
						});
					};
					controllerScope.openNetworkFlowDensityChart();
					
					controllerScope.openNetworkTotalBytesChart = function() {
						svg = d3.select("#chart").select("svg");
						svg.selectAll("*").remove();
						svg.style("height", scope.getHeight() - 50 + "px")
						controllerScope.chartPageSize = 6;
						controllerScope.pageCount = 10;
						controllerScope.pageCountIncrement = 4;
						controllerScope.reverse = false;

						var chartData = [];
						var i;

						if (controllerScope.chartFilteredObjects != null) {
							var size = 0;
							for (i=0; i < controllerScope.chartFilteredObjects.length && size <= 8; i++) {
								chartData.push({"x":controllerScope.chartFilteredObjects[i].TargetIp,"y":controllerScope.chartFilteredObjects[i].TotalTransferredBytes});
								size++;
							}
						}

						controllerScope.allChartItems = statisticalTrafficData[0]["values"];
						controllerScope.resetChartsAll();
						controllerScope.chartData = [{'key':"Network Flow Density",'values':chartData}];
						//	controllerScope.chartData = [statisticalTrafficData[0]];
						//	controllerScope.chartData = [{'values': controllerScope.chartObjects,"key":"test"}];
						//controllerScope.chartData = [{'key':statisticalTrafficData[0]["key"],'values':controllerScope.ChartItemsByPage[controllerScope.currentChartPage]}];
						nv.addGraph(function() {
							controllerScope.chart = nv.models.discreteBarChart()
							.x(function(d) { return d.x;})    // Specify the
							// data
							// accessors.
							.y(function(d) { return d.y;})
							//.staggerLabels(true)    // Too many bars and not
							// enough room? Try
							// staggering labels.
							.tooltips(false)        
							.showValues(true)       // ...instead, show the bar
							// value right on top of
							// each bar.
							.transitionDuration(350);
							/*
							 * chart.xAxis .tickFormat(function(d) { return
							 * operationCodeMap[""+d]; });
							 * 
							 * 
							 * chart.yAxis .tickFormat(d3.format('.02f'))
							 * .axisLabel("Count");
							 */

							d3.select('#chart svg')
							.datum(controllerScope.chartData)
							.call(controllerScope.chart);

							nv.utils.windowResize(scope.updateChart);

							return controllerScope.chart;
						});
					};
					controllerScope.openNetworkTotalBytesChart();
					
					controllerScope.openNetworkPacketCountChart = function() {
						svg = d3.select("#chart").select("svg");
						svg.selectAll("*").remove();
						svg.style("height", scope.getHeight() - 50 + "px")
						controllerScope.chartPageSize = 6;
						controllerScope.pageCount = 10;
						controllerScope.pageCountIncrement = 4;
						controllerScope.reverse = false;

						var chartData = [];
						var i;

						if (controllerScope.chartFilteredObjects != null) {
							var size = 0;
							for (i=0; i < controllerScope.chartFilteredObjects.length && size <= 8; i++) {
								chartData.push({"x":controllerScope.chartFilteredObjects[i].TargetIp,"y":controllerScope.chartFilteredObjects[i].PacketCount});
								size++;
							}
						}

						controllerScope.allChartItems = statisticalTrafficData[0]["values"];
						controllerScope.resetChartsAll();
						controllerScope.chartData = [{'key':"Network Packet Count",'values':chartData}];
						//	controllerScope.chartData = [statisticalTrafficData[0]];
						//	controllerScope.chartData = [{'values': controllerScope.chartObjects,"key":"test"}];
						//controllerScope.chartData = [{'key':statisticalTrafficData[0]["key"],'values':controllerScope.ChartItemsByPage[controllerScope.currentChartPage]}];
						nv.addGraph(function() {
							controllerScope.chart = nv.models.discreteBarChart()
							.x(function(d) { return d.x;})    // Specify the
							// data
							// accessors.
							.y(function(d) { return d.y;})
							//.staggerLabels(true)    // Too many bars and not
							// enough room? Try
							// staggering labels.
							.tooltips(false)        
							.showValues(true)       // ...instead, show the bar
							// value right on top of
							// each bar.
							.transitionDuration(350);
							/*
							 * chart.xAxis .tickFormat(function(d) { return
							 * operationCodeMap[""+d]; });
							 * 
							 * 
							 * chart.yAxis .tickFormat(d3.format('.02f'))
							 * .axisLabel("Count");
							 */

							d3.select('#chart svg')
							.datum(controllerScope.chartData)
							.call(controllerScope.chart);

							nv.utils.windowResize(scope.updateChart);

							return controllerScope.chart;
						});
					};
					controllerScope.openNetworkPacketCountChart();
					
					controllerScope.openNetworkPacketByteCountChart = function() {
						svg = d3.select("#chart").select("svg");
						svg.selectAll("*").remove();
						svg.style("height", scope.getHeight() - 50 + "px")
						controllerScope.chartPageSize = 6;
						controllerScope.pageCount = 10;
						controllerScope.pageCountIncrement = 4;
						controllerScope.reverse = false;

						var chartData = [];
						var i;

						if (controllerScope.chartFilteredObjects != null) {
							var size = 0;
							for (i=0; i < controllerScope.chartFilteredObjects.length && size <= 8; i++) {
								chartData.push({"x":controllerScope.chartFilteredObjects[i].TargetIp,"y":controllerScope.chartFilteredObjects[i].PacketTransferredBytes});
								size++;
							}
						}

						controllerScope.allChartItems = statisticalTrafficData[0]["values"];
						controllerScope.resetChartsAll();
						controllerScope.chartData = [{'key':"Network Packet Count",'values':chartData}];
						//	controllerScope.chartData = [statisticalTrafficData[0]];
						//	controllerScope.chartData = [{'values': controllerScope.chartObjects,"key":"test"}];
						//controllerScope.chartData = [{'key':statisticalTrafficData[0]["key"],'values':controllerScope.ChartItemsByPage[controllerScope.currentChartPage]}];
						nv.addGraph(function() {
							controllerScope.chart = nv.models.discreteBarChart()
							.x(function(d) { return d.x;})    // Specify the
							// data
							// accessors.
							.y(function(d) { return d.y;})
							//.staggerLabels(true)    // Too many bars and not
							// enough room? Try
							// staggering labels.
							.tooltips(false)        
							.showValues(true)       // ...instead, show the bar
							// value right on top of
							// each bar.
							.transitionDuration(350);
							/*
							 * chart.xAxis .tickFormat(function(d) { return
							 * operationCodeMap[""+d]; });
							 * 
							 * 
							 * chart.yAxis .tickFormat(d3.format('.02f'))
							 * .axisLabel("Count");
							 */

							d3.select('#chart svg')
							.datum(controllerScope.chartData)
							.call(controllerScope.chart);

							nv.utils.windowResize(scope.updateChart);

							return controllerScope.chart;
						});
					};
					controllerScope.openNetworkPacketByteCountChart();
					
					
					controllerScope.openNetworkPacketDurationChart = function() {
						svg = d3.select("#chart").select("svg");
						svg.selectAll("*").remove();
						svg.style("height", scope.getHeight() - 50 + "px")
						controllerScope.chartPageSize = 6;
						controllerScope.pageCount = 10;
						controllerScope.pageCountIncrement = 4;
						controllerScope.reverse = false;

						var chartData = [];
						var i;
						var size = 0;
						if (controllerScope.chartFilteredObjects != null) {
							for (i=0; i < controllerScope.chartFilteredObjects.length && size <= 8; i++) {
								chartData.push({"x":controllerScope.chartFilteredObjects[i].TargetIp,"y":controllerScope.chartFilteredObjects[i].FlowDuration});
								size++;
							}
						}

						controllerScope.allChartItems = statisticalTrafficData[0]["values"];
						controllerScope.resetChartsAll();
						controllerScope.chartData = [{'key':"Network Packet Count",'values':chartData}];
						//	controllerScope.chartData = [statisticalTrafficData[0]];
						//	controllerScope.chartData = [{'values': controllerScope.chartObjects,"key":"test"}];
						//controllerScope.chartData = [{'key':statisticalTrafficData[0]["key"],'values':controllerScope.ChartItemsByPage[controllerScope.currentChartPage]}];
						nv.addGraph(function() {
							controllerScope.chart = nv.models.discreteBarChart()
							.x(function(d) { return d.x;})    // Specify the
							// data
							// accessors.
							.y(function(d) { return d.y;})
							//.staggerLabels(true)    // Too many bars and not
							// enough room? Try
							// staggering labels.
							.tooltips(false)        
							.showValues(true)       // ...instead, show the bar
							// value right on top of
							// each bar.
							.transitionDuration(350);
							/*
							 * chart.xAxis .tickFormat(function(d) { return
							 * operationCodeMap[""+d]; });
							 * 
							 * 
							 * chart.yAxis .tickFormat(d3.format('.02f'))
							 * .axisLabel("Count");
							 */

							d3.select('#chart svg')
							.datum(controllerScope.chartData)
							.call(controllerScope.chart);

							nv.utils.windowResize(scope.updateChart);

							return controllerScope.chart;
						});
					};
					controllerScope.openNetworkPacketDurationChart();
				},
				

				init: function(scope) {


					scope.sort = function(keyname){
						scope.sortKey = keyname;
						scope.reverse = !scope.reverse;
					}

					scope.showTrafficAnalysis = function() {
						scope.cols = ["SourceIp", "TargetIp", "SourcePort", "TargetPort", "TransferredBytes", "Activity"];
						scope.rows = scope.flows;
					}

					scope.updateTable = function(ip) {
						if (scope.tableType == "option1") {
							scope.updateFlowsTable(ip);
						} else {
							scope.updateDnsTable(ip);
						}

					}

					scope.updateFlowsTable = function(ipList) {
						
						var ips = [];
						ips = ipList;
						
						var updatedNetworkTraffics = []; 
						var i;
						for (i=0; i < scope.flows.length; i++) {

							var j;
							for (j = 0; j < ips.length; j++) {
								if ((ips[j] == "AllDevices") || (ips[j] == scope.flows[i].SourceIp)) {
									updatedNetworkTraffics[updatedNetworkTraffics.length+1] = scope.flows[i];
								}
							} 
							scope.rows = updatedNetworkTraffics;
						}
					}

					scope.updateDnsTable = function(ip) {
						scope.showDnsAnalysis();
					}

					scope.shuffle = function(a) {
						var j, x, i;
						for (i = a.length; i; i--) {
							j = Math.floor(Math.random() * i);
							x = a[i - 1];
							a[i - 1] = a[j];
							a[j] = x;
						}
					}

					scope.getHeight = function() {
						var div = $('#chartBody');
						return div.height();
					}

					scope.showDnsAnalysis = function() {
						// for demonstration display some random items for the
						// selected device
						scope.shuffle(scope.dnsDataAll);
						scope.currentDnsItems = [];
						var start = Math.floor(Math.random() * (scope.dnsDataAll.length - 100));
						for (var i = start; i < start + Math.floor(Math.random() * 80) + 20; i++) {
							scope.currentDnsItems.push(scope.dnsDataAll[i]);
						}

						scope.cols = ["Domain", "Subdomains", "Age", "Addresses", "ASN", "TTL", "Class"];
						scope.rows = scope.currentDnsItems;

						if (scope.chartType == 'option1') {
							scope.openDnsClassChart();
						} else if (scope.chartType == 'option2') {
							scope.openDnsQueryStatisticsChart();
						} else {
							scope.openDnsHistoryChart();
						}
					}

					scope.openDnsQueryStatisticsChart = function () {
						var queries = [];
						var failures = [];

						var i = 0;
						scope.rows.forEach(function(entry) {
							if (i < 10) {
								queries.push({"x":entry.Domain,"y":entry.Count});
								failures.push({"x":entry.Domain,"y":entry.Failed});
							}

							i++;
						});

						scope.chartData = [{'key':"Queries",'values':queries},{'key':"Failures",'values':failures}];
						scope.openDnsAnalysisChart();
					}

					scope.openDnsHistoryChart = function () {
						var dictTimestamps = {};
						scope.rows.forEach(function(entry) {

							for (var i = 0; i < entry.Count; i++) {
//								if (entry.Queries[i][0].timestamp > 0) {
//								var timestamp = new Date(entry.Queries[i][0].timestamp);
								var timestamp = new Date();
								timestamp.setDate(Math.floor(Math.random() * 30));
								timestamp.setHours(0);
								timestamp.setMinutes(0);
								timestamp.setSeconds(0);
								timestamp.setMilliseconds(0);
								timestamp = timestamp.getTime();
								if (dictTimestamps[timestamp] == undefined) {
									dictTimestamps[timestamp] = 1;
								} else {
									dictTimestamps[timestamp] = dictTimestamps[timestamp] + 1;
								}
//								}
							}
							i++;
						});

						var valuesQueries = [];

						Object.keys(dictTimestamps).sort().forEach(function(entry) {
							valuesQueries.push({"x":entry,"y":dictTimestamps[entry]});
						});

						scope.chartData = [{'key':"Queries",'values':valuesQueries}];
						scope.createDnsHistoryChart();
					}

					scope.openDnsAnalysisChart = function() {

						nv.addGraph(function() {
							scope.chart = nv.models.multiBarChart()
							.x(function(d) { return d.x.substr(0,6) + "...";})
							.y(function(d) { return d.y;})
							.reduceXTicks(false)
							.transitionDuration(350);

							scope.updateChart();

							return scope.chart;

						});
					}

					scope.createDnsHistoryChart = function() {

						nv.addGraph(function() {
							scope.chart = nv.models.stackedAreaChart()
							.x(function(d) { return d.x;})
							.y(function(d) { return d.y;})
							.useInteractiveGuideline(true)
							.clipEdge(false)
							.showControls(false);

							scope.chart.xAxis.tickFormat(function(d) { return d3.time.format('%x')(new Date(d * 1)) });

							scope.updateChart();

							return scope.chart;

						});
					}

					scope.openDnsClassChart = function() {

						var benign = 0;
						scope.rows.forEach(function(entry) {
							if (typeof entry !== 'undefined' && entry.Class == "BENIGN") {
								benign++;
							}
						});

						scope.chartData = [{'label':"Benign",'value':benign},{'label':"Malicious",'value':scope.rows.length - benign}];

						scope.createPieChart();
					}

					scope.createPieChart = function() {
						nv.utils.windowResize(scope.updateChart);

						nv.addGraph(function() {
							scope.chart = nv.models.pieChart()
							.x(function(d) { return d.label })
							.y(function(d) { return d.value })
							.showLabels(true);

							scope.updateChart();

							return scope.chart;
						});
					}

					scope.updateChart = function() {
						if (scope.tableType == "option1") {
							svg = d3.select("#chart").select("svg");
						} else {
							svg = d3.select("#chartDns").select("svg");
						}
						svg.selectAll("*").remove();
						svg.style("height", scope.getHeight() - 50 + "px");
						svg.datum(scope.chartData)
						.transition().duration(350)
						.call(scope.chart);
					}
				}
		};

		return svc;
	}]);

	app.register.factory('TrafficAnalysisServicesConf', 
			// app.service('NetworkInfoWebsocketService',
			// needed services ['Restangular', '$state', '$q', '$rootScope',
			function(Restangular) {
		return Restangular.withConfig(function(RestangularConfigurer) {
			RestangularConfigurer.setBaseUrl('http://localhost:8989/rest/');
		});
	});	// -- app.register

	app.register.factory('TrafficAnalysisServices', function(TrafficAnalysisServicesConf) {
		var svc = {
				queryFlows: function(hostAddresses) {
					return TrafficAnalysisServicesConf.one('flows').post("hostAddresses",JSON.stringify(hostAddresses));
				},
				queryDNSData: function(hostAddresses) {
					return TrafficAnalysisServicesConf.one('dns').post("hostAddresses",JSON.stringify(hostAddresses));
				},

				data: null,
				TOPOLOGY_CONST: {
					HT_SERVICE_ID:"host-tracker-service:id",
					IP:"ip",
					HT_SERVICE_ATTPOINTS:"host-tracker-service:attachment-points",
					HT_SERVICE_TPID:"host-tracker-service:tp-id",
					NODE_ID:"node-id",
					SOURCE_NODE:"source-node",
					DEST_NODE:"dest-node",
					SOURCE_TP:"source-tp",
					DEST_TP:"dest-tp",
					ADDRESSES:"addresses",
					HT_SERVICE_ADDS:"host-tracker-service:addresses",
					HT_SERVICE_IP:"host-tracker-service:ip"
				}
		};

		svc.getCurrentData = function() {
			return svc.data;
		};

		svc.getTestData = function() {
			return svc.test();
		};

		svc.getData = function() {
			svc.data = svc.base().one("topology","flow:1").get();
			return svc.data;
		};

		svc.getNode = function(node,cb) {
			return;
		};

		return svc;
	});


	app.register.factory('DummyTrafficServices', 
			// app.service('NetworkInfoWebsocketService',
			/* needed services ['$state', '$q', '$rootScope', */ 
			function ($state, $q, $rootScope) { /*
			 * NOTE: $scope is not avail
			 * for service
			 */
		var service = {
				/* variable */
				callbacks : {},
				currentCallbackId : 0,

				/* functions */
				// This creates a new callback ID for a request
				getCallbackId : function() {
					currentCallbackId += 1;
					if(currentCallbackId > 10000) {
						currentCallbackId = 0;
					}
					return currentCallbackId;
				},
				setCallback: function(callback) {
					service.callback = callback;
				},
				openWebsocket: function(socketLocation) {
					try {
						var notificationSocket = new WebSocket(socketLocation);

						notificationSocket.onmessage = function (event) {
							// we process our received event here
							console.log('Received Websocket message');
							// console.log(event);
							// Call function registered by the
							// controller to update page.
							service.callback(event.data);
							/*
							 * We are not using event notification!!!
							 * EventAggregator.publish('TopologyChangeEvent',
							 * [event]);
							 */
						}
						notificationSocket.onerror = function (error) {
							console.log("Socket error: " + error);
						}
						notificationSocket.onopen = function (event) {
							console.log("Socket connection opened.");
							console.log("Sending request...");
							// this. will not work
							service.sendMessage({'type':'request'});
						}
						notificationSocket.onclose = function (event) {
							console.log("Socket connection closed.");
						};

						// if there is a problem on socket creation we
						// get exception
						// (i.e. when socket address is incorrect)
						this.ws = notificationSocket;
					} catch(e) {
						alert("Error when creating WebSocket" + e );
					}
				},
				sendMessage: function(jsonObject) {
					// this causes: 'WebSocket': Still in CONNECTING
					// state, in some case.
					service.ws.send(JSON.stringify(jsonObject));
					/*
					 * // TODO: better:
					 * http://clintberry.com/2013/angular-js-websocket-service/
					 * var defer = $q.defer(); var callbackId =
					 * getCallbackId(); callbacks[callbackId] = { time:
					 * new Date(), cb:defer }; request.callback_id =
					 * callbackId; console.log('Sending request',
					 * request); ws.send(JSON.stringify(request));
					 * return defer.promise;
					 */
				},
				ws: null
		}; // -- service
		return service;

	}); // -- app.register
});
