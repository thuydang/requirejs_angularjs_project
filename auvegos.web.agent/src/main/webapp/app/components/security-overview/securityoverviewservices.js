define(['app/app.module','cytoscape', 'cytoscape-cose-bilkent'], function (app,cytoscape,regCose) {
	'use strict';
	// register extension
	regCose(cytoscape);
	app.register.factory('SecurityOverviewServicesConf', 
			//app.service('NetworkInfoWebsocketService', 
			// needed services ['Restangular', '$state', '$q', '$rootScope', 
			function(Restangular) {
		return Restangular.withConfig(function(RestangularConfigurer) {
			RestangularConfigurer.setBaseUrl('http://localhost:8989/rest/');
		});
	});	//-- app.register

	app.register.factory('SecurityOverviewServices', ['SecurityOverviewServicesConf','$rootScope', function(SecurityOverviewServicesConf, $rootScope) {
		var svc = {
				queryPosture: function() {
					return SecurityOverviewServicesConf.one('posture').post();
				},
				queryAttackGraphs: function() {
					return SecurityOverviewServicesConf.one('attackgraphs').post();
				},
				queryAttackGraphStatistics: function(attackGraphName,hostAddress){
					return SecurityOverviewServicesConf.one('attackgraphs').post("hostAddress",attackGraphName+":"+hostAddress);
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
	}]);
	
	// DORUK - Start Infected hosts table

	app.register.factory('SecurityOverviewServices', ['$filter',function($filter){
		
		var factory = {};
		
		factory.formInfectedHostsTable = function(data, scope) {
					
			var controllerScope = scope;
			
			scope.sort = function(keyname){
				scope.sortKey = keyname;
				scope.reverse = !scope.reverse;
		    }
			
//			scope.sortVulnerability = function(keyname){
//				scope.sortKeyVulnerability = keyname;
//				scope.reverseVulnerability = !scope.reverseVulnerability;
//		    }
//			
//			controllerScope.updateInfectedHostsTable = function(element) {
//				
//				var filteredProducts = [];
//				var i = 0;
//				while(controllerScope.dataResults[i] != null) {
//					
//					
//					if (controllerScope.dataResults[i].Products.length == 0) {
//						break;
//					}
//					
//					var j;
//					for (j=0; j < controllerScope.dataResults[i].Products.length; j++) {
//						if (controllerScope.dataResults[i].Products[j].Product == element.Product) {
//							filteredProducts.push(controllerScope.dataResults[i].Products[j]);
//							factory.formVulnerabilityTable(filteredProducts, controllerScope);
//						}
//					
//					}
//					i++;	
//				}
//				
//			};

			controllerScope.range = function (a,b) {
				var ret = [];
				for (var i = a; i < b; i++) {
					ret.push(i);
				}
				return ret;
			};
			
			var hostsData = "";
			
			if (data != "") {
				hostsData = data;
				}
			
			controllerScope.allTableItems = hostsData;
		//	console.log(controllerScope.allTableItems);
		//	console.log(controllerScope.allTableItems.children.children.name);
		//	controllerScope.sort ('hosts');

			controllerScope.range = function (a,b) {
				var ret = [];
				for (var i = a; i < b; i++) {
					ret.push(i);
				}
				return ret;
			};
		}

	return factory;
	
}]);
	
	// DORUK - End Infected Hosts Table
	
	
	app.register.factory('SecurityOverviewAnalysisViewServices', ['$filter', function($filter) {

		var svc = {
				formAttackGraphAnalysisCharts: //Add charts
					function (statisticalAttackGraphData,scope) {
					var controllerScope = scope;
					function searchUtil(item, toSearch) {
						return (item.Application.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.Operation.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.Ip.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.Time.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 || item.Entity.toLowerCase().indexOf(toSearch.toLowerCase()) > -1) ? true : false;
					}

					controllerScope.searched = function (valLists,toSearch) {
						return _.filter(valLists, 
								function (i) {
							return searchUtil(i, toSearch);
						});        
					};

					controllerScope.pageVals = function (valLists,pageSize)
					{
						var retVal = [];
						for (var i = 0; i < valLists.length; i++) {
							if (i % pageSize === 0) {
								retVal[Math.floor(i / pageSize)] = [valLists[i]];
							} else {
								retVal[Math.floor(i / pageSize)].push(valLists[i]);
							}
						}
						return retVal;
					};
					controllerScope.resetChartsAll = function () {
						controllerScope.chartFilteredList = controllerScope.allChartItems;
						controllerScope.newEmpId = '';
						controllerScope.newName = '';
						controllerScope.newEmail = '';
						controllerScope.searchText = '';
						controllerScope.currentChartPage = 0;
						controllerScope.Header = ['','',''];
					};

					controllerScope.chartpagination = function () {
						controllerScope.ChartItemsByPage = controllerScope.pageVals( controllerScope.chartFilteredList, controllerScope.chartPageSize );
						var lastPageNumber = controllerScope.pageCount;
						if(lastPageNumber>=controllerScope.ChartItemsByPage.length)
						{
							lastPageNumber=controllerScope.ChartItemsByPage.length-1;
						}
						controllerScope.shownChartPageNumbers = [0,lastPageNumber];
					};

					controllerScope.setChartPage = function () {
						controllerScope.currentChartPage = this.nc;
						controllerScope.chartData = [{'key':statisticalLogData[0]["key"],'values':controllerScope.ChartItemsByPage[controllerScope.currentChartPage]}];
						d3.select('#chart svg')
						.datum(controllerScope.chartData)
						.call(controllerScope.chart);
					};

					controllerScope.previousChartPage = function () {
						if(controllerScope.shownChartPageNumbers[0]>0)
						{
							var lastPageNumber = controllerScope.shownChartPageNumbers[1]-controllerScope.pageCountIncrement;
							if(lastPageNumber<0)
							{
								lastPageNumber=controllerScope.ChartItemsByPage.length-1;
							}
							var firstPageNumber = controllerScope.shownChartPageNumbers[0]-controllerScope.pageCountIncrement;
							if(firstPageNumber < 0)
							{
								firstPageNumber = 0;
							}
							controllerScope.shownChartPageNumbers = [firstPageNumber,lastPageNumber];
						}
					};

					controllerScope.nextChartPage = function () {
						var lastPageNumber = controllerScope.shownChartPageNumbers[1]+controllerScope.pageCountIncrement;
						if(lastPageNumber>=controllerScope.ChartItemsByPage.length)
						{
							lastPageNumber=controllerScope.ChartItemsByPage.length-1;
						}
						var firstPageNumber = controllerScope.shownChartPageNumbers[0]+controllerScope.pageCountIncrement;
						if(firstPageNumber >=controllerScope.ChartItemsByPage.length)
						{
							firstPageNumber = 0;
						}
						controllerScope.shownChartPageNumbers = [firstPageNumber,lastPageNumber];
					};

					controllerScope.firstChartPage = function () {
						controllerScope.currentChartPage = 0;
					};

					controllerScope.lastChartPage = function () {
						controllerScope.currentChartPage = controllerScope.ChartItemsByPage.length - 1;
					};

					controllerScope.range = function (a,b) {
						var ret = [];
						for (var i = a; i < b; i++) {
							ret.push(i);
						}
						return ret;
					};

					controllerScope.chartPageSize = 6;
					controllerScope.pageCount = 10;
					controllerScope.pageCountIncrement = 4;
					controllerScope.reverse = false;

					controllerScope.allChartItems = statisticalAttackGraphData[0]["values"];
					controllerScope.resetChartsAll();
					controllerScope.chartpagination();
					var chart;
					controllerScope.chartData = [{'key':statisticalAttackGraphData[0]["key"],'values':controllerScope.ChartItemsByPage[controllerScope.currentChartPage]}];
					nv.addGraph(function() {
						controllerScope.chart = nv.models.discreteBarChart()
						.x(function(d) { return d.x;})    //Specify the data accessors.
						.y(function(d) { return d.y;})
						.staggerLabels(true)    //Too many bars and not enough room? Try staggering labels.
						.tooltips(false)        
						.showValues(true)       //...instead, show the bar value right on top of each bar.
						.transitionDuration(350)
						;
						/*
						chart.xAxis
						.tickFormat(function(d) {         
							return operationCodeMap[""+d];
						});


						chart.yAxis
						.tickFormat(d3.format('.02f'))
				        .axisLabel("Count");
						 */

						d3.select('#chart svg')
						.datum(controllerScope.chartData)
						.call(controllerScope.chart);

						nv.utils.windowResize(controllerScope.chart.update);

						return chart;
					});
				}
		};

		return svc;
	}]);

	app.register.factory('AttackGraphDisplay', [ '$q', 'SecurityOverviewServices', 'SecurityOverviewAnalysisViewServices','$state', '$rootScope', 
	                                             function($q,SecurityOverviewServices,SecurityOverviewAnalysisViewServices,$state,$rootScope){

		//DORUK - Wine and cheese functions
		var layoutPadding = 50;
		var layoutDuration = 500;

		function highlight( node ){
			var nhood = node.closedNeighborhood();

			cy_so.batch(function(){
				cy_so.elements().not( nhood ).removeClass('highlighted').addClass('faded');
				nhood.removeClass('faded').addClass('highlighted');

				var npos = node.position();
				var w = window.innerWidth;
				var h = window.innerHeight;
				cy_so.stop().animate({
					fit: {
						eles: cy_so.elements(),
						padding: layoutPadding
					}
				}, {
					duration: layoutDuration
				}).delay( layoutDuration, function(){
					
					nhood.layout({
						name: 'concentric',
						padding: layoutPadding,
						animate: true,
						animationDuration: layoutDuration,
						boundingBox: {
							x1: npos.x - w/2,
							x2: npos.x + w/2,
							y1: npos.y - w/2,
							y2: npos.y + w/2
						},
						fit: true,
						concentric: function( n ){
							if( node.id() === n.id() ){
								return 2;
							} else {
								return 1;
							}
						},
						levelWidth: function(){
							return 1;
						}
					});
				} );

			});
		}

		function clear(){
			cy_so.batch(function(){
				console.log("INSIDE CLEAR");
				cy_so.$('.highlighted').forEach(function(n){
					console.debug("OrgPos is: " , n.data('orgPos'));	
					n.animate({
						position: n.data('orgPos')
					});
				});

				cy_so.elements().removeClass('highlighted').removeClass('faded');
			});
		}


	  function showNodeInfo( node ){
		  
		  var data = node.data();
		  console.debug(data);
		  if(data.type == "Privilege"){
			  console.debug(data.id);
			  if(data.state == "alarmed"){
			  $rootScope.$broadcast('eventFired', data.cause);
			  $('#malware_table').removeClass('table-fixed');
			  $('#malware_table').removeClass('table-striped');
//			  var list = [];
//			  list.push(data.id);
//			  cy_so.filter('node[id = "'+ data.id +'"]')
//				.css({ 
//					'background-image':	'url(app/icons/information_source.png)',
//					'background-fit':	'cover'
//					});
     		  }
		   }
		  if (data.cves !== undefined) {
			  var x=  data.cves.length;
			  if (data.type == "VulnerabilityExploit"){
				  var html = "<div class='infobox'>Vulnerability Type: "+data.label +"</div>";
				  $('#info').html( html).show();
			  if(x>1){
			    html += "<ul style='list-style-type: decimal'>";
			      for(var i=0; i<data.cves.length; i++){
			    	 html +=  " <li>"+ data.cves[i] +'</li>';
			      }
			  html += "</ul>";
			  $('#info').html( html).show();
			  	}
			  }
		  }
	    }
		  
	  function hideNodeInfo(){
		    $('#info').hide();
		    cy_so.elements().removeClass('nodeActive');
		    $rootScope.$broadcast('remove');
		    $('#malware_table').addClass('table-fixed');
			$('#malware_table').addClass('table-striped');
		    
		  }

	  
		// DORUK: end of wine and cheese functions
		var cy_so;
		var attackGraphDisplay = function(attackGraph,scope){ 
			var deferred = $q.defer(); 
			var controllerScope = scope;
			$(function(){ 
				cy_so = cytoscape({
					container: $('#attackgraphcy')[0],
				layout: { 
					name: 'cose-bilkent',
					// Whether to enable incremental mode
					randomize: true,
					// Nesting factor (multiplier) to compute ideal edge length for nested edges
					nestingFactor: 0.15,
					// Gravity force (constant)
					gravity: 50,
					// For enabling tiling
					tile: true,
					// Represents the amount of the vertical space to put between the zero degree members during the tiling operation(can also be a function)
					tilingPaddingVertical: 100,
					// Represents the amount of the horizontal space to put between the zero degree members during the tiling operation(can also be a function)
					tilingPaddingHorizontal: 100,
					// Gravity range (constant) for compounds
					gravityRangeCompound: 0.9,
					// Gravity force (constant) for compounds
					gravityCompound: 0.1,
					// Gravity range (constant)
					gravityRange: 1,
					// Maximum number of iterations to perform
					numIter: 1500,
					// Type of layout animation. The option set is {'during', 'end', false}
					animate: 'false',
					animationDuration: 0, // duration of animation in ms if enabled
					useMultitasking:true,
					// Node repulsion (non overlapping) multiplier
					nodeRepulsion: 350000,
					avoidOverlap: true
					
//					name: 'breadthfirst',
//					directed: 'true',
//					circle: true,
//					fit: true,
////					nodeRepulsion: function( node ){ return 400000; },
////					nodeOverlap: 50,
//					padding: 10,
//					avoidOverlap: true,
//					spacingFactor: 1.75, 
//					condense: true,
//					avoidOverlapPadding: 90
//					}, 
//					layout: { 
//
//						name: 'dagre',
//						nodeSep: 10, // the separation between adjacent nodes in the same rank
//						edgeSep: 10, // the separation between adjacent edges in the same rank
//						rankSep: undefined, // the separation between adjacent nodes in the same rank
//						rankDir: undefined, // 'TB' for top to bottom flow, 'LR' for left to right
//						minLen: function( edge ){ return 1; }, // number of ranks to keep between the source and target of the edge
//						edgeWeight: function( edge ){ return 1; }, // higher weight edges are generally made shorter and straighter than lower weight edges
//
//						// general layout options
//						fit: true, // whether to fit to viewport
//						padding: 30, // fit padding
//						animate: false, // whether to transition the node positions
//						animationDuration: 500, // duration of animation in ms if enabled
//						animationEasing: undefined, // easing of animation if enabled
//						boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
//						ready: function(){}, // on layoutready
//						stop: function(){} // on layoutstop

//						name: 'concentric',

//						fit: true, // whether to fit the viewport to the graph
//						padding: 30, // the padding on fit
//						startAngle: 3 / 2 * Math.PI, // where nodes start in radians
//						sweep: undefined, // how many radians should be between the first and last node (defaults to full circle)
//						clockwise: true, // whether the layout should go clockwise (true) or counterclockwise/anticlockwise (false)
//						equidistant: false, // whether levels have an equal radial distance betwen them, may cause bounding box overflow
//						minNodeSpacing: 10, // min spacing between outside of nodes (used for radius adjustment)
//						boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
//						avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
//						height: undefined, // height of layout area (overrides container height)
//						width: undefined, // width of layout area (overrides container width)
//						concentric: function( node ){ // returns numeric value for each node, placing higher nodes in levels towards the centre
//						return node.degree();
//						},
//						levelWidth: function( nodes ){ // the variation of concentric values in each level
//						return nodes.maxDegree() / 4;
//						},
//						animate: false, // whether to transition the node positions
//						animationDuration: 500, // duration of animation in ms if enabled
//						animationEasing: undefined, // easing of animation if enabled
//						ready: undefined, // callback on layoutready
//						stop: undefined // callback on layoutstop
//						name: 'cose',
//						nodeRepulsion: function( node ){ return 400000; },
//						nodeOverlap: 50,
//						padding: 30,
//						fit: true,
//						avoidOverlap: true,
//						componentSpacing: 100,
//						avoidOverlapPadding: 90
					}, 
					elements: attackGraph,
					style: cytoscape.stylesheet() 
					.selector('node') 
					.css({ 
						'content': 'data(label)', 
						'height': function(ele){ var eleType=ele.data('type');
						if(eleType==='HostAttackGraph')
						{
							return 1000;
						}else if(eleType==='Product')
						{
							return 500;
						}else {
							return 128;
						}
						},
						'width': function(ele){ var eleType=ele.data('type');
						if(eleType==='HostAttackGraph')
						{
							return 1000;
						}else if(eleType==='Product')
						{
							return 500;
						}else {
							return 128;
						}
						},
//						'height': 250, 
//						'width': 250, 
						'text-valign': 'top',
						'text-halign':'center',
						'text-outline-width': 1, 
						'text-outline-color': '#888',
						'border-width': 2,
						'border-color': 'black',
						'border-style': 'solid',
						'border-opacity': 1,
						'font-family': 'calibri',
						'font-size': function(ele){ var eleType=ele.data('type');
						if(eleType==='HostAttackGraph')
						{
							return 40;
						}else if(eleType==='Product')
						{
							return 30;
						}else {
							return 20;
						}
						},
						'color': function(ele){ var eleType=ele.data('type');
						if(eleType==='HostAttackGraph')
						{
							return '#a0a0a0';
						}else if(eleType==='Product')
						{
							return '#a0a0a0';
						}else if(eleType==='Privilege')
						{
							return '#00435C';
						}else {
							return '#00435C';
						}
						},
						'background-color': function(ele){ var eleType=ele.data('type');
						if(eleType==='HostAttackGraph')
						{
							return '#e9e9e7';
						}else if(eleType==='Product')
						{
							return 'white';
							//return '#add8e6';
						}else if(eleType==='VulnerabilityExploit')
						{
							return '#00435C';
						}else if(eleType==='Privilege')
						{
							return 'white';
						}else if(eleType==='PrivilegeConjunction')
						{
							return 'gray';
						}else if(eleType==='InformationSourceUsage')
						{
							return 'white';
						}
						},
						'shape': 'ellipse',
//						function(ele){ var eleType=ele.data('type');
//						if(eleType==='PrivilegeConjunction')
//						{
//						return 'triangle';
//						}else if(eleType==='HostAttackGraph')
//						{
//						return 'ellipse';
//						}
//						else
//						{
//						//return 'roundrectangle';
//						return 'ellipse';
//						}
//						}
					}).selector('.nodeActive')
						.css({
							//'overlay-color': '#c0c0c0',
							//'overlay-color': 'green',
							//'overlay-padding': '50px',
							//'overlay-opacity': '0.2',
							'border-width': 7,
							'border-color': 'blue',
					}).selector('edge') 
					.css({ 						
						'line-color':'#00435C',
						//'line-style':'solid',
						//'curve-style': 'bezier',
						'curve-style': 'unbundled-bezier',
						'control-point-distances': 120,
						'control-point-weights': 0.1,
						'width': 5,
						'target-arrow-color': '#00435C', 
						//'target-arrow-shape': 'diamond', 
						'target-arrow-shape': 'triangle',
						//'source-arrow-shape': 'circle',
						'opacity': 0.5	
					}) 
					.selector(':selected') 
					.css({ 
						'background-color': 'gray',
						'line-color': 'black', 
						'target-arrow-color': 'black', 
						'source-arrow-color': 'black', 
						'text-outline-color': 'black' 
					}), 

					// initial viewport state:
					zoom: 1,
					pan: { x: 0, y: 0 },

					// interaction options:
					minZoom: 1e-50,
					maxZoom: 1e50,
					zoomingEnabled: true,
					userZoomingEnabled: true,
					panningEnabled: true,
					userPanningEnabled: true,
					boxSelectionEnabled: true,
					selectionType: 'single',
					touchTapThreshold: 8,
					desktopTapThreshold: 4,
					autolock: false,
					autoungrabify: false,
					autounselectify: false,

					// rendering options:
					headless: false,
					styleEnabled: true,
					hideEdgesOnViewport: false,
					hideLabelsOnViewport: false,
					textureOnViewport: false,
					motionBlur: false,
					motionBlurOpacity: 0.2,
					wheelSensitivity: 0.25,
					pixelRatio: 'auto',

					ready: function(){ 
						deferred.resolve(this); 
					}
				});
				cy_so.animation({
				});
				/* Select all Node and appliy Image*/
//				cy_so.filter('node[type = "HostAttackGraph"]')
//				.css({ 
//					'background-image':	'url(/app/icons/icon_computer_map.svg)',
//					'background-fit':	'none'
//				});
//				cy_so.filter('node[type = "Product"]')
//				.css({ 
//					'background-image':	'url(/app/icons/SoftwareBundle.png)',
//					'background-fit':	'none',
//				});
				cy_so.filter('node[type = "Privilege"]')
				// if STATUS == ALARMED - red icon
				.css({ 
					'background-image':	 function(ele){ var stateType=ele.data('state');
					if(stateType ==='alarmed')
					{
						return 'url(/app/icons/icon_hammer_map_red.svg)';
					}else
					{
						return 'url(/app/icons/icon_hammer_map.svg)';
				
					}
					},
				//	'background-image':	'url(/app/icons/icon_hammer_map.svg)',
					
					'background-fit':	'cover'
						/*
						'background-width':	'200%',
						'background-height':	'200%',
						 */
				});
				cy_so.filter('node[type = "VulnerabilityExploit"]')
				.css({ 
					'background-image':	'url(/app/icons/icon_bug_map.svg)',
					'background-fit':	'cover'
				});
				cy_so.filter('node[type = "InformationSourceUsage"]')
				.css({ 
					'background-image':	'url(/app/icons/information_source.png)',
					'background-fit':	'cover'
				});

				/*
					 cy_so.$('#j').neighborhood(function(){
					 return this.isEdge();
					 });
				 */
				/* Click and print data of what was clicked */
				cy_so.on('free', 'node', function( e ){
					var n = e.cyTarget;
					var p = n.position();
					n.data('orgPos', {
						x: p.x,
						y: p.y
					});
				});

//				cy_so.on('tap', function(){
//				$('#search').blur();
//				});

				cy_so.on('select', 'node', function(e){
					var node = this;
					console.debug(node);
					showNodeInfo( node );
				});

				cy_so.on('unselect', 'node', function(e){
					var node = this;
					clear();
					hideNodeInfo( node );
				});

				$('#reset').on('click', function(){
					cy_so.animate({
						fit: {
							eles: cy_so.elements(),
							padding: layoutPadding
						},
						duration: layoutDuration
					});
				});
				
				cy_so.on('tap', 'node', function(e){
					var node = e.cyTarget; 
					var id = e.cyTarget.data('id');
					console.log("this is it " + 'node[id="'+id+'"] node');
					// cy.elements('node[id="'+id+'"] /*note this selector:*/ node').css({'background-image-opacity': '0.1'}); // this works for child elems
					cy_so.elements().removeClass('nodeActive');
					cy_so.elements('node[id="'+id+'"]').addClass('nodeActive');
				});
//				cy_so.on('tap', function(evt){
//				var  cyTargetData = evt.cyTarget.data();
//				if(cyTargetData["address"])
//				{
//				if($state.current.name==='main.securityoverview')
//				{
//				var hostAddress = cyTargetData["address"];
//				SecurityOverviewServices.queryAttackGraphStatistics("changethis",hostAddress).then(function(attackGraphStatistics){
//				var attackGraphStatisticsPlain = attackGraphStatistics.plain();
//				console.log("attack stat 1 "+JSON.stringify(attackGraphStatisticsPlain));
//				SecurityOverviewAnalysisViewServices.formAttackGraphAnalysisCharts(attackGraphStatisticsPlain,controllerScope);
//				});
//				}
//				}
//				});

			});
			return deferred.promise; 
		}; 
		return attackGraphDisplay;
	}]);

	app.register.factory('DummySecurityOverviewServices', 
			//app.service('NetworkInfoWebsocketService', 
			/* needed services ['$state', '$q', '$rootScope',*/ 
			function ($state, $q, $rootScope) { /*NOTE: $scope is not avail for service */
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
							//console.log(event);
							// Call function registered by the controller to update page.
							service.callback(event.data);
							/*
							 * We are not using event notification!!!
									 EventAggregator.publish('TopologyChangeEvent', [event]);
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

						// if there is a problem on socket creation we get exception 
						// (i.e. when socket address is incorrect)
						this.ws = notificationSocket;
					} catch(e) {
						alert("Error when creating WebSocket" + e );
					}
				},
				sendMessage: function(jsonObject) {
					// this causes: 'WebSocket': Still in CONNECTING state, in some case.
					service.ws.send(JSON.stringify(jsonObject));
					/*
							// TODO: better: http://clintberry.com/2013/angular-js-websocket-service/
							var defer = $q.defer();
							var callbackId = getCallbackId();
							callbacks[callbackId] = {
							time: new Date(),
							cb:defer
							};
							request.callback_id = callbackId;
							console.log('Sending request', request);
							ws.send(JSON.stringify(request));
							return defer.promise;
					 */
				},
				ws: null
		}; //-- service
		return service;

	}); //-- app.register
});
