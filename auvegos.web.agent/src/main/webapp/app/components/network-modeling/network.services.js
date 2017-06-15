define(['app/app.module','cytoscape', 'cytoscape-cose-bilkent'], function (app,cytoscape,regCose) {
	'use strict';
	
	// register extension
	regCose(cytoscape);

	app.register.factory('IPLayerDisplay', ['$rootScope', '$q', '$state', 'LogAnalysisServices','TrafficAnalysisServices', 'TrafficAnalysisViewServices', 'EventAggregator',
	                                         function($rootScope,$q,$state,LogAnalysisServices, TrafficAnalysisServices, TrafficAnalysisViewServices, EventAggregator){
		var cy;
		var networkGraphDisplay = function(network,controllerScope){ 
			var deferred = $q.defer();
			var plucked_log_ips = 
					_.chain(LogAnalysisServices.getCurrentData())
					.reject(
							function(log){
									return log.Malware.toLowerCase().indexOf('benign') > -1;
								}
							)
					.pluck('Ip')
					.value();
			$(function(){ 
				cy = cytoscape({
					container: $('#iplayercy')[0],
					layout: {
						name: 'cose-bilkent',
						fit: true, // Fit layout to the graph
						// Whether to enable incremental mode
						randomize: true,
						
						padding: 10,
						
						nodeRepulsion: 9500,
						
						// Nesting factor (multiplier) to compute ideal edge length for nested edges
						nestingFactor: 1.5,
						// Gravity force (constant)
						gravity: 0.5,
						// Ideal edge (non nested) length
						idealEdgeLength: 320,
						// For enabling tiling
						tile: true,
						// Represents the amount of the vertical space to put between the zero degree members during the tiling operation(can also be a function)
						tilingPaddingVertical: 80,
						// Represents the amount of the horizontal space to put between the zero degree members during the tiling operation(can also be a function)
						tilingPaddingHorizontal: 80,
						// Gravity range (constant) for compounds
						gravityRangeCompound: 3.9,
						// Gravity force (constant) for compounds
						gravityCompound: 3.5,
						// Gravity range (constant)
						gravityRange: 3.9,
						// Type of layout animation. The option set is {'during', 'end', false}
						animate: 'end',
						useMultitasking:true
					}, 
					elements: network,
					style: cytoscape.stylesheet() 
						.selector('core') // just core properties
						.css({
							'active-bg-color': 'red', 
							'active-bg-size': 100
						})
					.selector('node') 
					.css({ 
						'compound-sizing-wrt-labels': 'include',
						'content': 'data(label)', 
						'height': function(ele){ var eleType=ele.data('type');
						if(eleType==='HardwarePort')
						{
							return 100;
						}else if(eleType==='NetworkInterface')
						{
							return 100;
						}else {
							return 150;
						}
						},
						'width': function(ele){ var eleType=ele.data('type');
						if(eleType==='HardwarePort')
						{
							return 100;
						}else if(eleType==='NetworkInterface')
						{
							return 100;
						}else {
							return 150;
						}
						},
						'text-valign': 'bottom',
						'text-halign': 'center',
//						'font-weight':'bold',
//						'text-outline-width': 1, 
//						'text-outline-color': '#888',
//						'text-background-color': '#CEF6F5',
//						'text-background-opacity': '1',
						'border-width': '0',
						'border-color': 'red',
						//'border-style': 'solid',
						//'border-opacity': 1,
//						'shadow-color': '#000000',
//						'shadow-offset-x': '0',
//						'shadow-offset-y': '2',
//						'shadow-opacity': '1',
						'font-size': function(ele){ var eleType=ele.data('type');
						if(eleType==='IPNetworkLayer')
						{
							return 60;
						}else if(eleType==='Subnet')
						{
							return 50;
						}else if(eleType==='Device')
						{
							return 35;
						}else if(eleType==='Switch')
						{
							return 35;
						}
						else if(eleType==='Router')
						{
							return 35;
						}else {
							return 37;
						}
						},
						'color': 'black',
						'background-color': function(ele){ var eleType=ele.data('type');
						if(eleType==='IPNetworkLayer')
						{
							return '#66d5ff';
						}else if(eleType==='Subnet')
						{
							return '#e9e9e7';
						}else if(eleType==='Device')
						{
							return '#ffffbd';
						}else if(eleType==='Switch')
						{
							return '#ffffbd';
						}else if(eleType==='Router')
						{
							return '#ffffbd';
						}
						else {
							return '#ffffff';
						}
						},
						'shape': 'ellipse'
					}).selector('edge') 
					.css({
//						'edge-text-rotation': 'autorotate',
//						'min-zoomed-font-size': '9',
						'source-text-background-color': '#ffffff',
						'source-text-background-opacity': '0.5',
						'source-text-background-shape': 'rectangle',
						'font-size': '30',
						'line-color':'black',
						'line-style':'solid',
						'curve-style': 'unbundled-bezier',
						'target-arrow-color': 'blue', 
						'target-arrow-shape': 'diamond',
						'source-label': 'data(sourceLabel)',
						'target-label': 'data(targetLabel)',
						'source-text-offset': '20',
						'target-text-offset': '20'
					}) 
					.selector(':selected') 
					.css({ 
						'background-color': 'black', 
						'line-color': 'black', 
						'target-arrow-color': 'black', 
						'source-arrow-color': 'black', 
						'text-outline-color': 'black' 
					}) 
					/*
					.selector(':active')
						.css({
							'overlay-color': '#c0c0c0',
							//'overlay-padding': '100px',
							'overlay-opacity': '0.2'
						})
						*/
					// Custome Styles
					.selector('.nodeActive')
						.css({
							//'overlay-color': '#c0c0c0',
							//'overlay-color': 'green',
							//'overlay-padding': '50px',
							//'overlay-opacity': '0.2',
							'border-width': 7,
							'border-color': 'blue',
							'background-opacity': '0.5',
							'background-image-opacity': '0.1',
							'text-outline-color': 'black' 
						}),
					// initial viewport state:
					zoom: 0.3,
					pan: { x: -150, y: -50 },

					// interaction options:
					minZoom: 0.09,
					maxZoom: 3,
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
					wheelSensitivity: 0.1,
					pixelRatio: 'auto',

					ready: function(){ 
						deferred.resolve(this); 
					}
				}); //- (function(){})

				/**** Graph Styling ****/
				cy.animation({
				});
				cy.filter('node[type = "IPNetworkLayer"]')
				.css({ 
					'background-opacity': '0',
					'text-opacity': '0'
				});
				cy.filter('node[type = "Subnet"]')
				.css({
					'color': '#8b8b8a',
					'shape': 'ellipse',
					'text-margin-y': '15'
				});
				cy.filter('node[type = "Device"]')
				.css({
					'font-weight': 'bold',
					'background-image-opacity': '0.8',
					'shadow-opacity': '0',
					'background-opacity': '0',
					'background-image':	'url(/app/icons/icon_computer_map.svg)',
					'background-fit':	'contain'
				});
				cy.filter('node[type = "Switch"]')
				.css({
					'font-weight': 'bold',
					'background-image-opacity': '0.8',
					'shadow-opacity': '0',
					'background-opacity': '0',
					'background-image':	'url(/app/icons/icon_switch_map.svg)',
					'background-fit':	'contain'
				});
				cy.filter('node[type = "Router"]')
				.css({ 
					'font-weight': 'bold',
					'shadow-opacity': '0',
					'background-image-opacity': '0.8',
					'background-opacity': '0',
					'background-image':	'url(/app/icons/icon_router_map.svg)',
					'background-fit':	'contain'
				});
				//				cy.filter('node[type = "NetworkInterface"]')
//				.css({
//					'height':'15',
//					'width':'15',
//					'shadow-opacity': '0',
//					'background-opacity': '1',
//					'background-color' : 'black',
////					'background-image':	'url(/app/icons/network_interface.png)',
//					'background-fit':	'cover'					
//				});
//				cy.filter('node[type = "HardwarePort"]')
//				.css({
//					'height':'15',
//					'width':'15',
//					'shadow-opacity': '0',
//					'background-opacity': '1',
//					'background-color' : 'black',
////					'background-image':	'url(/app/icons/hardware_port.png)',
//					'background-fit':	'cover'
//				});

				/* Style selected elements */
					/* 
				// selector can only be used in cy object. Filter is needed here
				cy.selector(":active")
				.css({
						'text-outline-color': 'black' 
				});
				*/

				/*** Graph Event Handling ***/
				/** Handling active node style **/
				// highlight node when tap */
				cy.elements().unselectify();
				// Get event from specific element
				cy.on('tap', 'node', function(e){
					var node = e.cyTarget; 
					var id = e.cyTarget.data('id');
					console.log("this is it " + 'node[id="'+id+'"] node');
					// cy.elements('node[id="'+id+'"] /*note this selector:*/ node').css({'background-image-opacity': '0.1'}); // this works for child elems
					cy.elements().removeClass('nodeActive');
					cy.elements('node[id="'+id+'"]').addClass('nodeActive');
					//var neighborhood = node.neighborhood().add(node);
					//cy.elements().addClass('faded');
					//neighborhood.removeClass('faded');
				});
				/*
				// Get events from core (cy) graph
				cy.on('tap', function(e){
					//console.log("this is it" + e.cyTarget);
					// Check core event (background) or element event: i.e. eventObj.cyTarget === cy || eventObj.cyTarget === someEle).
					if( e.cyTarget === cy ){
						cy.elements().addClass('nodeActive');
					//	cy.elements().addClass('nodeActive');
					}
				});
				*/

			/* Handling click event */
			cy.on('tap', function(evt){
				var  cyTargetData = evt.cyTarget.data();
				   
					if(cyTargetData.networkinterfaces)
					{
						var hostAddresses = [];
						for(var i = 0; i < cyTargetData.networkinterfaces.length; i++) {
							var networkInterface = cyTargetData.networkinterfaces[i];
							hostAddresses[i] = JSON.parse('{"address":'+'"'+networkInterface.address+'"}');
						}
						if($state.current.name==='main.networkParent.loganalysis')
						{
								var hostAddressesFiltered = _.pluck(hostAddresses, 'address');

								EventAggregator.publish('SelectHostInLogsAnalysisViewEvent', [hostAddressesFiltered]);
						} else if($state.current.name==='main.networkParent.trafficanalysis')
						{
							var hostAddressesFiltered = _.pluck(hostAddresses, 'address');
							EventAggregator.publish('SelectHostInTrafficAnalysisViewEvent', [hostAddressesFiltered]);
						} else if ($state.current.name === 'main.networkParent.network') {

							var hostAddressesFiltered = _.pluck(hostAddresses, 'address');
							EventAggregator.publish('SelectHostInLogsAnalysisViewEvent', [hostAddressesFiltered]);
					   }
	
					} else if (cyTargetData.type === 'Subnet') {
						if($state.current.name==='main.networkParent.loganalysis') {
							var hostAddresses = [];
							var nodes = cy.collection('[parent = "'+cyTargetData.id+'"]').forEach(function( ele ){
								if (ele.data().networkinterfaces) {
									for(var i = 0; i < ele.data().networkinterfaces.length; i++) {
										var networkInterface = ele.data().networkinterfaces[i];
										hostAddresses.push(networkInterface.address);
									}
								}
							});
							EventAggregator.publish('SelectHostInLogsAnalysisViewEvent', [hostAddresses]);
						} else if($state.current.name==='main.networkParent.network') {
							var hostAddresses = [];
							var nodes = cy.collection('[parent = "'+cyTargetData.id+'"]').forEach(function( ele ){
								if (ele.data().networkinterfaces) {
									for(var i = 0; i < ele.data().networkinterfaces.length; i++) {
										var networkInterface = ele.data().networkinterfaces[i];
										hostAddresses.push(networkInterface.address);
									}
								}
							});
							EventAggregator.publish('SelectHostInNetworkAnalysisViewEvent', [hostAddresses]);
						}  else if($state.current.name==='main.networkParent.trafficanalysis') {
							var hostAddresses = [];
							var nodes = cy.collection('[parent = "'+cyTargetData.id+'"]').forEach(function( ele ){
								if (ele.data().networkinterfaces) {
									for(var i = 0; i < ele.data().networkinterfaces.length; i++) {
										var networkInterface = ele.data().networkinterfaces[i];
										hostAddresses.push(networkInterface.address);
									}
								}
							});
							EventAggregator.publish('SelectSubnetInTrafficAnalysisViewEvent', [hostAddresses]);
						}
					} else if (cyTargetData.type === 'Router' || cyTargetData.type === 'Switch') {
						if($state.current.name==='main.networkParent.loganalysis') {
							EventAggregator.publish('SelectHostInLogsAnalysisViewEvent', [null]);
						}
					} else if ($state.current.name==='main.networkParent.loganalysis') {
						EventAggregator.publish('SelectHostInLogsAnalysisViewEvent', undefined);
					} else if (cyTargetData.type ==='IPNetworkLayer') {
						var hostAddresses = [];
						hostAddresses.push("AllDevices");
						EventAggregator.publish('SelectAllNetworkEvent', [hostAddresses]);
					}
				}); //- on.tap
				

			/*
			var updateBounds = function () {
				var bounds = cy.elements().boundingBox();
				//$('#ipCyContainer').css('height', bounds.h + 300);
				cy.center();
				cy.resize();
				//fix the Edgehandles
				//$('#iplayercy').cytoscapeEdgehandles('resize');
			};

			updateBounds();
			*/

				//if they resize the window, resize the diagram
				var rtime;
				var timeout = false;
				var delta = 200;
				$(window).resize(function() {
				    rtime = new Date();
				    if (timeout === false) {
				        timeout = true;
				        setTimeout(resizeend, delta);
				    }
				});

				function resizeend() {
				    if (new Date() - rtime < delta) {
				        setTimeout(resizeend, delta);
				    } else {
				        timeout = false;
				        cy.resize();
						//cy.fit();
				    }               
				}
				
				// expand function resizes and fits after a delay to ensure the new canvas size is used.
				controllerScope.isExpanded = false;
				controllerScope.changeExpanded = function(){
					controllerScope.isExpanded = !controllerScope.isExpanded;
					function f() {cy.resize();/*cy.fit();*/};
					setTimeout(f, 750);
				};
				
				EventAggregator.subscribe("UpdateTopoplogy", function() {
					cy.elements('node[type = "Device"]').css({
						'background-image': function(ele){
							if($state.current.name==='main.networkParent.loganalysis')
							{
								var eleData = ele.data();
								if(eleData.networkinterfaces)
								{
									var hostAddresses = [];
									for(var i = 0; i < eleData.networkinterfaces.length; i++) {
										var networkInterface = eleData.networkinterfaces[i];
										hostAddresses[i] = JSON.parse('{"address":'+'"'+networkInterface.address+'"}');
									}
									var hostAddressesFiltered = _.pluck(hostAddresses, 'address');
									if (hostAddressesFiltered.some(function(ip){return _.contains(plucked_log_ips, ip);})) {
										return 'url(/app/icons/icon_computer_map_red.svg)';
									}
								}
							}
							return 'url(/app/icons/icon_computer_map.svg)';
						}
					});
				});
			});
			$rootScope.networkDrawPromise = deferred.promise; 
			return deferred.promise; 
		};
		return networkGraphDisplay;
	}]); //- app.register.factory;

app.register.factory('SecurityLayerDisplay', ['$filter',function($filter){
	
	var factory = {};
	
	factory.formProductTable = function(data, scope) {
				
		var controllerScope = scope;
		
		scope.sort = function(keyname){
			scope.sortKey = keyname;
			scope.reverse = !scope.reverse;
	    }
		
		scope.sortVulnerability = function(keyname){
			scope.sortKeyVulnerability = keyname;
			scope.reverseVulnerability = !scope.reverseVulnerability;
	    }
		
		controllerScope.updateVulnerabilityTable = function(element) {
			
			var filteredProducts = [];
			var i = 0;
			while(controllerScope.dataResults[i] != null) {
				
				if (controllerScope.dataResults[i].Products.length == 0) {
					break;
				}
				
				var j;
				for (j=0; j < controllerScope.dataResults[i].Products.length; j++) {
					if (controllerScope.dataResults[i].Products[j].Product == element.Product) {
						filteredProducts.push(controllerScope.dataResults[i].Products[j]);
						factory.formVulnerabilityTable(filteredProducts, controllerScope);
					}
				
				}
				i++;	
			}
			
		};

		controllerScope.range = function (a,b) {
			var ret = [];
			for (var i = a; i < b; i++) {
				ret.push(i);
			}
			return ret;
		};
		
		var productsData = "";
		var product = "";
		
		if (data != "") {
			productsData = data;
		}
		
		controllerScope.allTableItems = productsData;
		controllerScope.sort ('Products');

		controllerScope.range = function (a,b) {
			var ret = [];
			for (var i = a; i < b; i++) {
				ret.push(i);
			}
			return ret;
		};
	}
	
	factory.formVulnerabilityTable = function(data, scope) {
		
			var controllerScope = scope;

			controllerScope.range = function (a,b) {
				var ret = [];
				for (var i = a; i < b; i++) {
					ret.push(i);
				}
				return ret;
			};	
			
			var vulnerabilities = [];
			
			var i = 0;
			while (data[i] != null) {
				
				if (data[i].Vulnerabilities.length == 0) {
					i++;
					continue;
				}
				
				var j;
				for (j=0; j<data[i].Vulnerabilities.length; j++)
				{
					vulnerabilities.push(data[i].Vulnerabilities[j]);
				}	
				i++;
			}
			
			controllerScope.allVulnerabilityTableItems = vulnerabilities;
		}
	
	return factory;
	
}]);

app.register.factory('NetworkTopologyServicesConf', 
		// needed services ['Restangular', '$state', '$q', '$rootScope', 
		function(Restangular) {
	return Restangular.withConfig(function(RestangularConfigurer) {
		RestangularConfigurer.setBaseUrl('http://localhost:8989/rest/');
	});
});	//-- app.register

app.register.factory('NetworkTopologyServices', function(NetworkTopologyServicesConf) {
	var svc = {
			queryNetwork: function() {
				return NetworkTopologyServicesConf.one('network').post();
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

}); //-- app.register
});

