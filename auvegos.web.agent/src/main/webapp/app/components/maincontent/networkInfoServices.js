define(['app/app.module'], function (app) {
    'use strict';


		// ======================================================================
		// Get NetworkInfo Data from backend 
		// ======================================================================
		app.register.factory('NetworkInfoWebsocketService', 
		//app.service('NetworkInfoWebsocketService', 
				/* needed services ['$state', '$q', '$rootScope',*/ 
				function ($state, $q, $rootScope) { /*NOTE: $scope is not avail for service */
					var service = {
						/* variable */
						callbacks : [],
						currentCallbackId : 0,
						networkInfoList: {},

						/** functions */
						// This creates a new callback ID for a request
						// http://clintberry.com/2013/angular-js-websocket-service/
						getCallbackId : function() {
							currentCallbackId += 1;
							if(currentCallbackId > 10000) {
								currentCallbackId = 0;
							}
							return currentCallbackId;
						},
						addCallback: function(callback) {
							service.callbacks.push(callback);
						},
						openWebsocket: function(socketLocation) {
							try {
								var notificationSocket = new WebSocket(socketLocation);

								notificationSocket.onmessage = function (event) {
									// we process our received event here
									console.log('Received Websocket message');
									//console.log(event);
									// Call function registered by the controller to update page.
									
									/* not working if obj not initialized
									this.data = event.data;
									this.networkInfoList.push(event.data);
									*/
									for (var i = 0; i < service.callbacks.length; i++) {
										  service.callbacks[i](event.data);
									}

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
						data: null ,
						networkInfoKeyList: [] ,
						ws: null
					}; //-- service
					

					/** Callback to put network info in dictionary with timestamp as index
					 * when new JSON string of data received*/
					service.addCallback(function (newData) {
						var data = JSON.parse(newData);
						service.networkInfoList[data.statistics.timestamp] = data;
						console.log("New data added" + data.statistics.timestamp);
						
						updateNetworkInfoKeyList();
					});

					
						/** Some test data */
					service.networkInfoList["Wed Jul 06 15:39:18 CEST 2016"] = JSON.parse(JSON.stringify(
					//service.addCallback(JSON.stringify(
								{"vulnerabilites":[[{"cveVulnProducts":[[]],"cveName":"CVE-1999-0524","cveDescription":"ICMP information such as (1) netmask and (2) timestamp is allowed from arbitrary hosts.","cveReleaseDate":"Fri Aug 01 06:00:00 CEST 1997","cveNumAffectedHosts":49,"cveLastRevised":"Wed Nov 04 18:31:11 CET 2015"},{"cveVulnProducts":[[]],"cveName":"CVE-2006-5757","cveDescription":"Race condition in the __find_get_block_slow function in the ISO9660 filesystem in Linux 2.6.18 and possibly other versions allows local users to cause a denial of service (infinite loop) by mounting a crafted ISO9660 filesystem containing malformed data structures.","cveReleaseDate":"Mon Nov 06 21:07:00 CET 2006","cveNumAffectedHosts":49,"cveLastRevised":"Mon May 09 18:52:31 CEST 2016"},{"cveVulnProducts":[[]],"cveName":"CVE-2005-3274","cveDescription":"Race condition in ip_vs_conn_flush in Linux 2.6 before 2.6.13 and 2.4 before 2.4.32-pre2, when running on SMP systems, allows local users to cause a denial of service (null dereference) by causing a connection timer to expire while the connection table is being flushed before the appropriate lock is acquired.","cveReleaseDate":"Fri Oct 21 03:02:00 CEST 2005","cveNumAffectedHosts":53,"cveLastRevised":"Tue Mar 08 03:26:11 CET 2011"},{"cveVulnProducts":[[]],"cveName":"CVE-2005-1368","cveDescription":"The key_user_lookup function in security/keys/key.c in Linux kernel 2.6.10 to 2.6.11.8 may allow attackers to cause a denial of service (oops) via SMP.","cveReleaseDate":"Mon May 02 06:00:00 CEST 2005","cveNumAffectedHosts":14,"cveLastRevised":"Fri Sep 05 22:48:57 CEST 2008"},{"cveVulnProducts":[[]],"cveName":"CVE-2003-0462","cveDescription":"A race condition in the way env_start and env_end pointers are initialized in the execve system call and used in fs/proc/base.c on Linux 2.4 allows local users to cause a denial of service (crash).","cveReleaseDate":"Wed Aug 27 06:00:00 CEST 2003","cveNumAffectedHosts":10,"cveLastRevised":"Wed Sep 10 21:19:04 CEST 2008"}]],"softwares":[[{"swEdition":"*","other":"*","cpeVendor":"isc","cpeProduct":"bind","cpePart":"a","update":"*","edition":"*","cpeDescription":"isc","language":"*","version":"dnsmasq-2.76test12","cpeNumVulns":379},{"swEdition":"*","other":"*","cpeVendor":"openbsd","cpeProduct":"openssh","cpePart":"a","update":"*","edition":"*","cpeDescription":"openbsd","language":"*","version":"6.0p1","cpeNumVulns":120},{"swEdition":"*","other":"*","cpeVendor":"apache","cpeProduct":"coyote_http_connector","cpePart":"a","update":"*","edition":"*","cpeDescription":"apache","language":"*","version":"1.1","cpeNumVulns":131},{"swEdition":"*","other":"*","cpeVendor":"openbsd","cpeProduct":"openssh","cpePart":"a","update":"*","edition":"*","cpeDescription":"openbsd","language":"*","version":"7.2","cpeNumVulns":82},{"swEdition":"*","other":"*","cpeVendor":"igor_sysoev","cpeProduct":"nginx","cpePart":"a","update":"*","edition":"*","cpeDescription":"igor_sysoev","language":"*","version":"*","cpeNumVulns":19}]],"hosts":[[{"hostName":"Gateway","hostNumVulns":671,"hostRiskIndex":9.4},{"hostName":"Host-2","hostNumVulns":656,"hostRiskIndex":7.2},{"hostName":"Host-3","hostNumVulns":656,"hostRiskIndex":5.2},{"hostName":"Host-4","hostNumVulns":646,"hostRiskIndex":3.2},{"hostName":"Host-5","hostNumVulns":676,"hostRiskIndex":1.2}]],"statistics":{"statisticNumProdUnique":7,"statisticNumVulnsInstances":1666,"statisticNumProdInstances":7,"statisticOverallRisk":2.5,"statisticNumVulnsUnique":666,"statisticNumHosts":5,"timestamp":"Wed Jul 06 15:39:18 CEST 2016"}}
								));
					service.networkInfoList["Thu May 26 16:32:44 CEST 2016"] = JSON.parse(JSON.stringify(
					//service.addCallback(JSON.stringify(
								{"vulnerabilites":[[{"cveVulnProducts":[[]],"cveName":"CVE-1999-0524","cveDescription":"ICMP information such as (1) netmask and (2) timestamp is allowed from arbitrary hosts.","cveReleaseDate":"Fri Aug 01 06:00:00 CEST 1997","cveNumAffectedHosts":94,"cveLastRevised":"Wed Nov 04 18:31:11 CET 2015"},{"cveVulnProducts":[[]],"cveName":"CVE-2005-3274","cveDescription":"Race condition in ip_vs_conn_flush in Linux 2.6 before 2.6.13 and 2.4 before 2.4.32-pre2, when running on SMP systems, allows local users to cause a denial of service (null dereference) by causing a connection timer to expire while the connection table is being flushed before the appropriate lock is acquired.","cveReleaseDate":"Fri Oct 21 03:02:00 CEST 2005","cveNumAffectedHosts":94,"cveLastRevised":"Tue Mar 08 03:26:11 CET 2011"},{"cveVulnProducts":[[]],"cveName":"CVE-2006-5757","cveDescription":"Race condition in the __find_get_block_slow function in the ISO9660 filesystem in Linux 2.6.18 and possibly other versions allows local users to cause a denial of service (infinite loop) by mounting a crafted ISO9660 filesystem containing malformed data structures.","cveReleaseDate":"Mon Nov 06 21:07:00 CET 2006","cveNumAffectedHosts":43,"cveLastRevised":"Tue Mar 08 03:43:47 CET 2011"},{"cveVulnProducts":[[]],"cveName":"CVE-2006-0741","cveDescription":"Linux kernel before 2.6.15.5, when running on Intel processors, allows local users to cause a denial of service (\"endless recursive fault\") via unknown attack vectors related to a \"bad elf entry address.\"","cveReleaseDate":"Tue Mar 07 03:02:00 CET 2006","cveNumAffectedHosts":40,"cveLastRevised":"Tue Mar 08 03:30:43 CET 2011"},{"cveVulnProducts":[[]],"cveName":"CVE-2006-1066","cveDescription":"Linux kernel 2.6.16-rc2 and earlier, when running on x86_64 systems with preemption enabled, allows local users to cause a denial of service (oops) via multiple ptrace tasks that perform single steps, which can cause corruption of the DEBUG_STACK stack during the do_debug function call.","cveReleaseDate":"Mon Mar 27 02:02:00 CEST 2006","cveNumAffectedHosts":40,"cveLastRevised":"Tue Mar 08 03:31:54 CET 2011"}]],"softwares":[[{"swEdition":"*","other":"*","cpeVendor":"openbsd","cpeProduct":"openssh","cpePart":"a","update":"*","edition":"*","cpeDescription":"openbsd","language":"*","version":"7.2","cpeNumVulns":300},{"swEdition":"*","other":"*","cpeVendor":"isc","cpeProduct":"bind","cpePart":"a","update":"*","edition":"*","cpeDescription":"isc","language":"*","version":"dnsmasq-2.76test8","cpeNumVulns":20},{"swEdition":"*","other":"*","cpeVendor":"openbsd","cpeProduct":"openssh","cpePart":"a","update":"*","edition":"*","cpeDescription":"openbsd","language":"*","version":"6.0p1","cpeNumVulns":30},{"swEdition":"*","other":"*","cpeVendor":"apache","cpeProduct":"coyote_http_connector","cpePart":"a","update":"*","edition":"*","cpeDescription":"apache","language":"*","version":"1.1","cpeNumVulns":19},{"swEdition":"*","other":"*","cpeVendor":"igor_sysoev","cpeProduct":"nginx","cpePart":"a","update":"*","edition":"*","cpeDescription":"igor_sysoev","language":"*","version":"*","cpeNumVulns":39}]],"hosts":[[{"hostName":"Gateway","hostNumVulns":690,"hostRiskIndex":5.8},{"hostName":"Host-2","hostNumVulns":691,"hostRiskIndex":3.2},{"hostName":"Host-3","hostNumVulns":686,"hostRiskIndex":3.2},{"hostName":"Host-5","hostNumVulns":659,"hostRiskIndex":3.2},{"hostName":"Host-7","hostNumVulns":569,"hostRiskIndex":3.2}]],"statistics":{"statisticNumProdUnique":7,"statisticNumVulnsInstances":1564,"statisticNumProdInstances":7,"statisticOverallRisk":3.8,"statisticNumVulnsUnique":564,"statisticNumHosts":2,"timestamp":"Thu May 26 16:32:44 CEST 2016"}}
								));
					service.networkInfoList["Mon Jun 27 15:24:31 CEST 2016"] = JSON.parse(JSON.stringify(
					//service.addCallback(JSON.stringify(
								{"vulnerabilites":[[{"cveVulnProducts":[[]],"cveName":"CVE-2004-0836","cveDescription":"Buffer overflow in the mysql_real_connect function in MySQL 4.x before 4.0.21, and 3.x before 3.23.49, allows remote DNS servers to cause a denial of service and possibly execute arbitrary code via a DNS response with a large address length (h_length).","cveReleaseDate":"Wed Nov 03 06:00:00 CET 2004","cveNumAffectedHosts":49,"cveLastRevised":"Fri Sep 05 22:39:33 CEST 2008"},{"cveVulnProducts":[[]],"cveName":"CVE-2004-0627","cveDescription":"The check_scramble_323 function in MySQL 4.1.x before 4.1.3, and 5.0, allows remote attackers to bypass authentication via a zero-length scrambled string.","cveReleaseDate":"Mon Dec 06 06:00:00 CET 2004","cveNumAffectedHosts":55,"cveLastRevised":"Tue Mar 08 03:16:05 CET 2011"},{"cveVulnProducts":[[]],"cveName":"CVE-2012-2750","cveDescription":"Unspecified vulnerability in MySQL 5.5.x before 5.5.23 has unknown impact and attack vectors related to a \"Security Fix\", aka Bug #59533. NOTE: this might be a duplicate of CVE-2012-1689, but as of 20120816, Oracle has not commented on this possibility.","cveReleaseDate":"Fri Aug 17 02:55:03 CEST 2012","cveNumAffectedHosts":47,"cveLastRevised":"Thu Oct 24 05:39:12 CEST 2013"},{"cveVulnProducts":[[]],"cveName":"CVE-2004-0628","cveDescription":"Stack-based buffer overflow in MySQL 4.1.x before 4.1.3, and 5.0, allows remote attackers to cause a denial of service (crash) and possibly execute arbitrary code via a long scramble string.","cveReleaseDate":"Mon Dec 06 06:00:00 CET 2004","cveNumAffectedHosts":16,"cveLastRevised":"Tue Mar 08 03:16:05 CET 2011"},{"cveVulnProducts":[[]],"cveName":"CVE-2015-8812","cveDescription":"drivers/infiniband/hw/ cxgb3/iwch_cm.c in the Linux kernel before 4.5 does not properly identify error conditions, which allows remote attackers to execute arbitrary code or cause a denial of service (use-after-free) via crafted packets.","cveReleaseDate":"Wed Apr 27 19:59:02 CEST 2016","cveNumAffectedHosts":18,"cveLastRevised":"Wed May 04 02:29:55 CEST 2016"}]],"softwares":[[{"swEdition":"*","other":"*","cpeVendor":"linux","cpeProduct":"linux_kernel","cpePart":"o","update":"*","edition":"*","cpeDescription":"linux","language":"*","version":"*","cpeNumVulns":355},{"swEdition":"*","other":"*","cpeVendor":"mysql","cpeProduct":"mysql","cpePart":"a","update":"*","edition":"*","cpeDescription":"mysql","language":"*","version":"*","cpeNumVulns":92},{"swEdition":"*","other":"*","cpeVendor":"igor_sysoev","cpeProduct":"nginx","cpePart":"a","update":"*","edition":"*","cpeDescription":"igor_sysoev","language":"*","version":"*","cpeNumVulns":120},{"swEdition":"*","other":"*","cpeVendor":"openbsd","cpeProduct":"openssh","cpePart":"a","update":"*","edition":"*","cpeDescription":"openbsd","language":"*","version":"7.2","cpeNumVulns":68},{"swEdition":"*","other":"*","cpeVendor":"apache","cpeProduct":"coyote_http_connector","cpePart":"a","update":"*","edition":"*","cpeDescription":"apache","language":"*","version":"1.1","cpeNumVulns":21}]],"hosts":[[{"hostName":"LAMP-23","hostNumVulns":705,"hostRiskIndex":9.1},{"hostName":"HoneyPot","hostNumVulns":689,"hostRiskIndex":8.8},{"hostName":"Apache HTTP Server","hostNumVulns":681,"hostRiskIndex":8.3},{"hostName":"DAFIS-ST2540","hostNumVulns":688,"hostRiskIndex":7.7},{"hostName":"AP 1200","hostNumVulns":672,"hostRiskIndex":7.0}]],"statistics":{"statisticNumProdUnique":224,"statisticNumVulnsInstances":1677,"statisticNumProdInstances":2137,"statisticOverallRisk":7.4,"statisticNumVulnsUnique":182,"statisticNumHosts":135,"timestamp":"Mon Jun 27 15:24:31 CEST 2016"}}
								));

					/** Keep a sorted list of timestamps in network info list to be used 
					 * in Topbanner controller and ceo controller 
					 */
					var dateFromString = function (dateStr) {
						var arr = dateStr.split(/[\s]+/);
						return new Date(arr[1] + ' ' + arr[2] + ', ' + arr[5]);
					};

					var updateNetworkInfoKeyList = function () {
						service.networkInfoKeyList = Object.keys(service.networkInfoList).sort(
								function(a,b) {
									// Turn your strings into dates, and then subtract them
									// to get a value that is either negative, positive, or zero.
									return new dateFromString(b) - new dateFromString(a);
								});
					};

					updateNetworkInfoKeyList(); 

					var firstKey = service.networkInfoKeyList[0];
					service.data = service.networkInfoList[firstKey];
					return service;

				}); //-- app.register


		// ======================================================================
		// NetworkInfo Rest Service 
		// ======================================================================
		app.register.factory('NetworkInfoRestServicesConf', 
				// needed services ['Restangular', '$state', '$q', '$rootScope', 
				function(Restangular) {
					return Restangular.withConfig(function(RestangularConfigurer) {
						RestangularConfigurer.setBaseUrl('http://localhost:8989/rest/');
					});
				});	//-- app.register

		app.register.factory('NetworkInfoRestServices', function(NetworkInfoRestServicesConf) {
			var svc = {
				get: function() {
					return NetworkInfoRestServicesConf.one('DemoNetworkInfo').get();
				},
				data: null,
				TOPOLOGY_CONST: {
					HT_SERVICE_IP:"host-tracker-service:ip"
				}
			};

			svc.getCurrentData = function() {
				return svc.data;
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


}); //-- Define
