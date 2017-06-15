define(['app/app.module'], function (app) {
	'use strict';

	/*	
	app.register.factory('MongoDbNgResourceServices', 
			//app.service('NetworkInfoWebsocketService', 
					// needed services ['$state', '$q', '$rootScope',/ 
			['$resource',
			    function($resource) {
				var query =  $resource('http://localhost:8989/rest/query', {}, {
					        query: {
			          method: 'GET',
			          params: {}
			        }
			      });
			      return query;
			    }
	]); //-- app.register
	 */

	app.register.factory('GithubRestangularConf', 
			//app.service('NetworkInfoWebsocketService', 
			// needed services ['Restangular', '$state', '$q', '$rootScope', 
			function(Restangular) {
		return Restangular.withConfig(function(RestangularConfig) {
			//RestangularConfig.setBaseUrl('http://localhost:8082/officer/rest');
			RestangularConfig.setBaseUrl('https://api.github.com');
		});
	});	//-- app.register

	app.register.factory('LogAnalysisServicesConf', 
			//app.service('NetworkInfoWebsocketService', 
			// needed services ['Restangular', '$state', '$q', '$rootScope', 
			function(Restangular) {
		return Restangular.withConfig(function(RestangularConfigurer) {
			RestangularConfigurer.setBaseUrl('http://localhost:8989/rest/');
		});
	});	//-- app.register


	app.register.factory('LogAnalysisServices', function(LogAnalysisServicesConf) {
		
		var svc = {
				
				init: function(scope) {
					scope.sort = function(keyname){
						scope.sortKey = keyname;
						scope.reverse = !scope.reverse;
				    }
				},
				
				queryLogs: function(hostAddresses) {
					return LogAnalysisServicesConf.one('logs').post("hostAddresses",JSON.stringify(hostAddresses));
				}
		};
		
		// dummy data
		svc.data = [
					{"Ip":"10.0.2.7","Application":"SavService.exe","Malware":"RDN/Downloader.gen.a!367937465349"},
					{"Ip":"10.0.2.8","Application":"SavService.exe","Malware":"RDN/Downloader.gen.a!637937163592"},
					{"Ip":"10.0.2.7","Application":"TSVNCache.exe","Malware":"Benign"},
					{"Ip":"10.0.2.8","Application":"TSVNCache.exe","Malware":"RDN/Generic.grp!hy"},
					{"Ip":"10.0.2.8","Application":"Explorer.EXE","Malware":"Benign"},
					{"Ip":"10.0.2.8","Application":"svchost.exe","Malware":"Generic FakeAlert!E35608C04D98"},
					{"Ip":"10.0.2.6","Application":"Explorer.EXE","Malware":"HTML/Iframe.gen.w.3"},
					{"Ip":"10.0.2.5","Application":"Explorer.EXE","Malware":"Generic FakeAlert!E35608C04D28"},
					{"Ip":"10.0.2.5","Application":"TSVNCache.exe","Malware":"Benign"},
					{"Ip":"10.0.2.5","Application":"SavService.exe","Malware":"RDN/Generic.grp!hy.CA"},
					{"Ip":"10.0.2.5","Application":"svchost.exe","Malware":"Benign"},
					{"Ip":"10.0.2.5","Application":"Dropbox.exe","Malware":"W32/Viru$.mmm!!.gen!2CFCEBA94166"},
					{"Ip":"10.0.2.4","Application":"BelkinSetup.EXE","Malware":"Benign"},
					{"Ip":"10.0.2.4","Application":"ApacheMonitor.exe","Malware":"Benign"},
					{"Ip":"10.0.2.4","Application":"Explorer.EXE","Malware":"Benign"},
					{"Ip":"10.0.2.4","Application":"TSVNCache.exe","Malware":"Benign"},
					{"Ip":"10.0.2.3","Application":"svchost.exe","Malware":"Benign"},
					{"Ip":"10.0.2.3","Application":"TSVNCache.exe","Malware":"Benign"},
					{"Ip":"10.0.2.2","Application":"TSVNCache.exe","Malware":"Benign"},
					{"Ip":"10.0.2.2","Application":"Explorer.EXE","Malware":"Benign"},
					{"Ip":"10.0.2.10","Application":"SearchIndexer.exe","Malware":"HTML/Iframe.gen.w.3"},
					{"Ip":"10.0.2.10","Application":"TSVNCache.exe","Malware":"HTML/Iframe.gen.w.1"},
					{"Ip":"10.0.2.10","Application":"Explorer.EXE","Malware":"Benign"},
					{"Ip":"10.0.2.10","Application":"DllHost.exe","Malware":"Exploit/Certifigate.A"},
					{"Ip":"10.0.2.10","Application":"ApacheMonitor.exe","Malware":"HTML/Iframe.gen.w"},
					{"Ip":"10.0.2.10","Application":"Dropbox.exe","Malware":"GenericR-DAX!C7B264EB714B"},
					{"Ip":"10.0.2.10","Application":"SavService.exe","Malware":"Benign"},
					{"Ip":"101.98.112.6","Application":"Explorer.EXE","Malware":"Benign"},
					{"Ip":"101.98.112.6","Application":"TSVNCache.exe","Malware":"Benign"},
					{"Ip":"101.98.112.6","Application":"ApacheMonitor.exe","Malware":"Benign"},
					{"Ip":"101.98.112.6","Application":"ApacheMonitor.exe","Malware":"Benign"},
					{"Ip":"101.98.112.6","Application":"Dropbox.exe","Malware":"Benign"},
					{"Ip":"101.98.112.5","Application":"TSVNCache.exe","Malware":"Benign"},
					{"Ip":"101.98.112.5","Application":"ApacheMonitor.exe","Malware":"Benign"},
					{"Ip":"10.0.2.12","Application":"TSVNCache.exe","Malware":"Benign"},
					{"Ip":"10.0.2.12","Application":"Dropbox.exe","Malware":"Benign"},
					{"Ip":"10.0.2.12","Application":"SavService.exe","Malware":"Benign"},
					{"Ip":"10.0.2.12","Application":"Explorer.EXE","Malware":"Benign"},
					{"Ip":"10.0.2.12","Application":"swi_service.exe","Malware":"Benign"},
					{"Ip":"10.0.2.12","Application":"ApacheMonitor.exe","Malware":"Benign"},
					{"Ip":"10.0.2.13","Application":"TSVNCache.exe","Malware":"Benign"},
					{"Ip":"10.0.2.9","Application":"SavService.exe","Malware":"RDN/Generic.grp!hy.CA"},
					{"Ip":"10.0.2.9","Application":"TSVNCache.exe","Malware":"RDN/Downloader.gen.a!367937464549"},
					{"Ip":"10.0.2.9","Application":"Explorer.EXE","Malware":"W64/Virut.n.gen!2CFCEBA94166"},
					{"Ip":"101.98.112.5","Application":"ApacheMonitor.exe","Malware":"Benign"},
					{"Ip":"101.98.112.5","Application":"swi_service.exe","Malware":"Benign"},
					{"Ip":"101.98.112.1","Application":"Explorer.EXE","Malware":"W32/Nabucur!6260B8D5609A"},
					{"Ip":"101.98.112.1","Application":"ApacheMonitor.exe","Malware":"Trojan.Win32.Malware"},
					{"Ip":"101.98.112.4","Application":"ApacheMonitor.exe","Malware":"Trojan.Win32.Malware"},
					{"Ip":"101.98.112.1","Application":"LMS.exe","Malware":"Trojan.1.Win64.Malware"},
					{"Ip":"101.98.112.1","Application":"TSVNCache.exe","Malware":"W32/Virut.n.gen!2CFCEBA9416§_1"},
					{"Ip":"101.98.112.4","Application":"TSVNCache.exe","Malware":"W32/Virut.n.gen!2CFCEBA9416§_1"},
					{"Ip":"101.98.112.2","Application":"svchost.exe","Malware":"RDN/Downloader.gen.a!367937465349"},
					{"Ip":"101.98.112.2","Application":"TSVNCache.exe","Malware":"RDN/Generic.grp!hy"},
					{"Ip":"101.98.112.2","Application":"DllHost.exe","Malware":"W32/Virut.n.gen!2CFCEBA9416"},
					{"Ip":"101.98.112.3","Application":"TSVNCache.exe","Malware":"Generic FakeAlert!E35608C04D28"},
					{"Ip":"101.98.112.2","Application":"ApacheMonitor.exe","Malware":"HTML/Iframe.gen.w"},
					{"Ip":"10.0.2.13","Application":"ApacheMonitor.exe","Malware":"Benign"},
					{"Ip":"10.0.2.13","Application":"svchost.exe","Malware":"Benign"},
					{"Ip":"10.0.2.13","Application":"Explorer.EXE","Malware":"Benign"},
					{"Ip":"111.111.111.115","Application":"SavService.exe","Malware":"Benign"},
					{"Ip":"111.111.111.115","Application":"TSVNCache.exe","Malware":"Benign"},
					{"Ip":"111.111.111.115","Application":"Explorer.EXE","Malware":"Benign"},
					{"Ip":"111.111.111.116","Application":"TSVNCache.exe","Malware":"RDN/Downloader.gen.a!367937465FFA"},
					];

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


	app.register.factory('DummyLogServices', 
			//app.service('NetworkInfoWebsocketService', 
			/* needed services ['$state', '$q', '$rootScope',*/ 
			function ($state, $q, $rootScope) { /*NOTE: controllerScope is not avail for service */
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
