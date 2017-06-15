define([
        /* RequireJS modules definition files (w/o .js) */
        'app/app.module',
        'app/components/security-overview/securityoverviewservices'
        ], function (app) {
	'use strict';

	app.register.controller('SecurityOverviewCtrl', 
			/* needed services */ ['$rootScope','$state', '$scope', 'SecurityOverviewServices', 'AttackGraphDisplay', 'EventAggregator',
			                       function ($rootScope,$state, $scope, SecurityOverviewServices, AttackGraphDisplay, EventAggregator) {

				// ======================================================================
				// Controller Variables 
				// ======================================================================
				$scope.backgroundColor = 'red';
								
				
				$scope.$on('eventFired', function(event, data){
					console.debug(data.hostname + 'I am called');
				  //    console.debug($scope.malwares);
					  $scope.$apply(function(){
						  $scope.malwares = [];
						  var malware = {}; 
		 				  malware.name = data.name;
						  malware.hostname = data.hostname;
		    	  		  $scope.malwares.push(malware);
		    	  		  $scope.backgroundColor = 'yellow';
					  });

				});
				
				$scope.$on('remove', function(event, data){
					  $scope.$apply(function(){
						  $scope.malwares = $scope.malwares_backup;
						  $scope.backgroundColor = '';
					  });
				});
				
				$scope.dummyNetworkData = 
				{"vulnerabilites":[[{"cveVulnProducts":[[]],"cveName":"CVE-1999-0524","cveDescription":"ICMP information such as (1) netmask and (2) timestamp is allowed from arbitrary hosts.","cveReleaseDate":"Fri Aug 01 06:00:00 CEST 1997","cveLastRevised":"Wed Nov 04 18:31:11 CET 2015"},{"cveVulnProducts":[[]],"cveName":"CVE-2005-0937","cveDescription":"Some futex functions in futex.c for Linux kernel 2.6.x perform get_user calls while holding the mmap_sem semaphore, which could allow local users to cause a deadlock condition in do_page_fault by triggering get_user faults while another thread is executing mmap or other functions.","cveReleaseDate":"Tue Feb 22 06:00:00 CET 2005","cveLastRevised":"Sat Aug 21 06:27:17 CEST 2010"},{"cveVulnProducts":[[]],"cveName":"CVE-2008-7256","cveDescription":"mm/shmem.c in the Linux kernel before 2.6.28-rc8, when strict overcommit is enabled and CONFIG_SECURITY is disabled, does not properly handle the export of shmemfs objects by knfsd, which allows attackers to cause a denial of service (NULL pointer dereference and knfsd crash) or possibly have unspecified other impact via unknown vectors.  NOTE: this vulnerability exists because of an incomplete fix for CVE-2010-1643.","cveReleaseDate":"Thu Jun 03 16:30:01 CEST 2010","cveLastRevised":"Mon Mar 19 05:00:00 CET 2012"},{"cveVulnProducts":[[]],"cveName":"CVE-2003-0462","cveDescription":"A race condition in the way env_start and env_end pointers are initialized in the execve system call and used in fs/proc/base.c on Linux 2.4 allows local users to cause a denial of service (crash).","cveReleaseDate":"Wed Aug 27 06:00:00 CEST 2003","cveLastRevised":"Wed Sep 10 21:19:04 CEST 2008"},{"cveVulnProducts":[[]],"cveName":"CVE-2005-1368","cveDescription":"The key_user_lookup function in security/keys/key.c in Linux kernel 2.6.10 to 2.6.11.8 may allow attackers to cause a denial of service (oops) via SMP.","cveReleaseDate":"Mon May 02 06:00:00 CEST 2005","cveLastRevised":"Fri Sep 05 22:48:57 CEST 2008"}]],"softwares":[[{"swEdition":"*","other":"*","cpeVendor":"isc","cpeProduct":"bind","cpePart":"a","update":"*","edition":"*","cpeDescription":"isc","language":"*","version":"dnsmasq-2.76test8"},{"swEdition":"*","other":"*","cpeVendor":"openbsd","cpeProduct":"openssh","cpePart":"a","update":"*","edition":"*","cpeDescription":"openbsd","language":"*","version":"7.2"},{"swEdition":"*","other":"*","cpeVendor":"openbsd","cpeProduct":"openssh","cpePart":"a","update":"*","edition":"*","cpeDescription":"openbsd","language":"*","version":"6.0p1"},{"swEdition":"*","other":"*","cpeVendor":"mysql","cpeProduct":"mysql","cpePart":"a","update":"*","edition":"*","cpeDescription":"mysql","language":"*","version":"5.5.46-0\\+deb7u1"},{"swEdition":"*","other":"*","cpeVendor":"apache","cpeProduct":"coyote_http_connector","cpePart":"a","update":"*","edition":"*","cpeDescription":"apache","language":"*","version":"1.1"}]],"hosts":[[{"hostName":"Gateway","hostDescription":"/a"},{"hostName":"Host-2","hostDescription":"/a"}]],"statistics":{"statisticNumVulnsInstances":1323,"statisticNumProdInstances":7,"staisticNumProdUnique":7,"statisticNumVulnsUnique":1323,"statisticNumHosts":2}};

				// ======================================================================
				// Some Utility Functions
				// ======================================================================
				// Info about angular infdig prblem as described here:
				// http://stackoverflow.com/a/32585468
				//

				//Draw sunburst for security posture

//				SecurityOverviewServices.queryPosture().then(function(posture){
//				$scope.testPosture = posture.plain();
//				console.log("post "+JSON.stringify($scope.testPosture));
	//		$scope.testPosture = {"children":[{"children":[{"children":[{"children":[{"size":100,"name":"101.98.112.1"}],"name":"WORM"},{"children":[{"size":100,"name":"111.111.111.121"}],"name":"PORTSCANNING"}],"name":"Malflows"}],"name":"MySQL Server"},{"children":[{"children":[{"size":100,"name":"UDS-DangerousObject-Multi-1-26"},{"size":100,"name":"ot-a-virus-WebToolbar-Win32-MyWebSearch-1-85"}],"name":"Malware"}],"name":"Apache HTTP Server"},{"children":[{"children":[{"children":[{"size":100,"name":"120.110.211.5"},{"size":100,"name":"111.111.111.112"}],"name":"PORTSCANNING"}],"name":"Malflows"}],"name":"Cisco 2821 Router Firewall"},{"children":[{"children":[{"children":[{"size":100,"name":"111.111.111.120"},{"size":100,"name":"120.110.211.2"}],"name":"WORM"},{"children":[{"size":100,"name":"111.111.111.120"}],"name":"PORTSCANNING"}],"name":"Malflows"}],"name":"AP1200-2"},{"children":[{"children":[{"children":[{"size":100,"name":"10.0.2.16"}],"name":"WORM"}],"name":"Malflows"}],"name":"AP1200-1"},{"children":[{"children":[{"children":[{"size":100,"name":"10.0.2.9"}],"name":"WORM"}],"name":"Malflows"}],"name":"3620-Cisco Router Firewall"},{"children":[{"children":[{"children":[{"size":100,"name":"101.98.112.3"}],"name":"PORTSCANNING"},{"children":[{"size":100,"name":"10.0.2.9"}],"name":"SPYWARE"}],"name":"Malflows"},{"children":[{"size":100,"name":"CVE-2008-0726"},{"size":100,"name":"CVE-2009-2994"}],"name":"Alerts"}],"name":"Attacker PC-001"},{"children":[{"children":[{"children":[{"size":100,"name":"101.98.112.4"},{"size":100,"name":"10.0.2.1"}],"name":"WORM"},{"children":[{"size":100,"name":"120.110.211.20"}],"name":"PORTSCANNING"},{"children":[{"size":100,"name":"101.98.112.2"}],"name":"SPYWARE"}],"name":"Malflows"},{"children":[{"size":100,"name":"Trojan-Win32-Waldek-1-25"},{"size":100,"name":"ot-a-virus-WebToolbar-Win32-MyWebSearch-1-85"}],"name":"Malware"}],"name":"DAFIS-ST2540-ControllerA"}],"name":"AuVeGoS Example Network"};
			$scope.testPosture = {"children":[{"children":[{"children":[{"size":100,"name":"101.98.112.1"}],"name":"WORM"},{"children":[{"size":100,"name":"111.111.111.121"}],"name":"PORTSCANNING"}],"name":"MySQL Server"},{"children":[{"size":100,"name":"UDS-DangerousObject-Multi-1-26"},{"size":100,"name":"ot-a-virus-WebToolbar-Win32-MyWebSearch-1-85"}],"name":"Apache HTTP Server"},{"children":[{"children":[{"size":100,"name":"120.110.211.5"},{"size":100,"name":"111.111.111.112"}],"name":"PORTSCANNING"}],"name":"Cisco 2821 Router Firewall"},{"children":[{"children":[{"size":100,"name":"111.111.111.120"},{"size":100,"name":"120.110.211.2"}],"name":"WORM"},{"children":[{"size":100,"name":"111.111.111.120"}],"name":"PORTSCANNING"}],"name":"AP1200-2"},{"children":[{"children":[{"size":100,"name":"10.0.2.16"}],"name":"WORM"}],"name":"AP1200-1"},{"children":[{"children":[{"size":100,"name":"10.0.2.9"}],"name":"WORM"}],"name":"3620-Cisco Router Firewall"},{"children":[{"children":[{"size":100,"name":"101.98.112.3"}],"name":"PORTSCANNING"},{"children":[{"size":100,"name":"10.0.2.9"}],"name":"SPYWARE"},{"size":100,"name":"CVE-2008-0726"},{"size":100,"name":"CVE-2009-2994"}],"name":"Attacker PC-001"},{"children":[{"children":[{"size":100,"name":"101.98.112.4"},{"size":100,"name":"10.0.2.1"}],"name":"WORM"},{"children":[{"size":100,"name":"120.110.211.20"}],"name":"PORTSCANNING"},{"children":[{"size":100,"name":"101.98.112.2"}],"name":"SPYWARE"},{"size":100,"name":"Trojan-Win32-Waldek-1-25"},{"size":100,"name":"ot-a-virus-WebToolbar-Win32-MyWebSearch-1-85"}],"name":"DAFIS-ST2540-ControllerA"}],"name":"AuVeGoS Example Network"};			
								
			var i;
			var j;
		    $scope.malwares = [];
		    $scope.malwares_backup = [];
		    for (i = 0; i < $scope.testPosture.children.length; i++) {
				//host.name = $scope.testPosture.children[i].name;
				//host.malwares = {};
				for (j = 0; j < $scope.testPosture.children[i].children.length; j++) {
				  var malware = {}; 
 				  malware.name = $scope.testPosture.children[i].children[j].name;
				  malware.hostname = $scope.testPosture.children[i].name;
    	  		  $scope.malwares.push(malware);
					}
				}
		    $scope.malwares_backup = $scope.malwares;
			  var allData=null; 
	 	      
			  allData = $scope.testPosture.children;
		//	  console.log(allData);
	 		  SecurityOverviewServices.formInfectedHostsTable(allData, $scope);
		        
//		        EventAggregator.subscribe("SelectHostInSecurityOverviewViewEvent", function(msg) {
//					var jointMSG;
//					if (typeof msg !== 'undefined') {
//						jointMSG = msg.join();
//					} else {
//						jointMSG = undefined;
//					}
//					$scope.hostname = jointMSG;
//					var i;
//					var selectedData = "";
//					
//					for (i = 0; i < $scope.testPosture.children.length; i++) {
//						if (jointMSG.indexOf($scope.testPosture.children[i].name) >= 0) {
//							selectedData = $scope.testPosture.children[i];
//						}
//					}
					
//					SecurityOverviewServices.formInfectedHostsTable(selectedData, $scope);
//					$scope.$apply();
	//	        });
// DORUK - end of table					
					
//					var sunburstDiv = d3.select("#overviewsunburst");
//					var width = $('#overviewsunburst').width(),
//					height = $('#overviewsunburst').height(),
//					radius = Math.min(width, height) / 2;
//					var x = d3.scale.linear()
//					.range([0, 2 * Math.PI]);
//					var y = d3.scale.linear()
//					.range([0, radius]);
//					var color = d3.scale.category20c();
//					var svg = sunburstDiv.append("svg")
//					.attr("width", width)
//					.attr("height", height)
//					.attr("viewBox", "0 0 " + width + " " + height)
//					.attr("preserveAspectRatio", "xMidYMid meet")
//					.append("g")
//					.attr("align","center")
//					.attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ")");
//					var partition = d3.layout.partition()
//					.value(function(d) { return d.size; });
//					var arc = d3.svg.arc()
//					.startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
//					.endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
//					.innerRadius(function(d) { return Math.max(0, y(d.y)); })
//					.outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });
//					var g = svg.selectAll("g")
//					.data(partition.nodes($scope.testPosture))
//					.enter().append("g");
//					var path = g.append("path")
//					.attr("d", arc)
//					.style("fill", function(d) { return color((d.children ? d : d.parent).name); })
//					.on("click", click);
//					var text = g.append("text")
//					.attr("transform", function(d) { return "rotate(" + computeTextRotation(d) + ")"; })
//					.attr("x", function(d) { return y(d.y); })
//					.attr("dx", "6") // margin
//					.attr("dy", ".35em") // vertical-align
//					.style("font-size","10px")
//					.text(function(d) { return d.name; });
//					
//					function resize() {
//						d3.select("#overviewsunburst svg").attr("width", 100);
//					}
//
//					function click(d) {
//						// fade out all text elements
//						text.transition().attr("opacity", 0);
//						path.transition()
//						.duration(750)
//						.attrTween("d", arcTween(d))
//						.each("end", function(e, i) {
//							// check if the animated element's data e lies within the visible angle span given in d
//							if (e.x >= d.x && e.x < (d.x + d.dx)) {
//								// get a selection of the associated text element
//								var arcText = d3.select(this.parentNode).select("text");
//								// fade in the text element and recalculate positions
//								arcText.transition().duration(750)
//								.attr("opacity", 1)
//								.attr("transform", function() { return "rotate(" + computeTextRotation(e) + ")" })
//								.attr("x", function(d) { return y(d.y); });
//							}
//						});
//					}
//
//					function arcTween(d) {
//						var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
//						yd = d3.interpolate(y.domain(), [d.y, 1]),
//						yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
//						return function(d, i) {
//							return i
//							? function(t) { return arc(d); }
//							: function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
//						};
//					}
//
//					function computeTextRotation(d) {
//						return (d3.scale.linear()
//								.range([0, 2 * Math.PI])(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180;
//					}
					
					
					
					//uncomment this if you want to connect to server via rest
					/*
					SecurityOverviewServices.queryAttackGraphs().then(function(attackgraphs){
						if(attackgraphs.length > 0)
						{
							console.log("att "+JSON.stringify(attackgraphs.plain()));
							$scope.attackGraphs = attackgraphs.plain();
							$scope.selectedAttackGraph = $scope.attackGraphs[0];
							AttackGraphDisplay($scope.selectedAttackGraph.data,$scope);
						}
					});*/
					
					//Test data
					    $scope.attackGraphs = [{"data":[{"data":{"address":"10.0.2.9","id":"n1","label":"DAFIS-ST2540-ControllerA","type":"HostAttackGraph"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"parent":"n1","id":"n2","label":"microsoft:windows_7:sp1","type":"Product"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"parent":"n2","id":"n3","label":"FILE_MODIFICATION","type":"Privilege"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"parent":"n2","id":"n4","label":"USER_ACCESS","type":"Privilege"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"}],"name":"Attack Scenario 2"},{"data":[{"data":{"address":"10.0.2.2","id":"n1","label":"AP1200-2","type":"HostAttackGraph"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"parent":"n1","id":"n2","label":"siemens:simatic_wincc:7.0","type":"Product"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"parent":"n2","id":"n3","label":"RANDOM_CODE_EXECUTION","type":"Privilege"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"parent":"n1","id":"n4","label":"microsoft:word:2010:sp1","type":"Product"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"parent":"n4","id":"n5","label":"USER_ACCESS","type":"Privilege"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"parent":"n4","id":"n6","label":"CRASH","type":"Privilege"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"parent":"n2","id":"n7","label":"CVE-2014-8551","type":"VulnerabilityExploit","cves":["CVE-2014-8551"]},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"parent":"n4","id":"n8","label":"6 CVEs","type":"VulnerabilityExploit","cves":["CVE-2013-3847","CVE-2013-3848","CVE-2013-3849","CVE-2013-3850","CVE-2014-0260","CVE-2014-1757"]},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"parent":"n4","id":"n9","label":"RANDOM_CODE_EXECUTION","type":"Privilege"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"parent":"n4","id":"n10","label":"CVE-2014-4117","type":"VulnerabilityExploit","cves":["CVE-2014-4117"]},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"address":"10.0.2.5","id":"n11","label":"Apache HTTP Server","type":"HostAttackGraph"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"parent":"n11","id":"n12","label":"microsoft:windows_7:sp1","type":"Product"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"parent":"n12","id":"n13","label":"USER_ACCESS","type":"Privilege"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"parent":"n12","id":"n14","label":"FILE_ACCESS","type":"Privilege"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"id":"n15","source":"n13","target":"n7"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"edges"},{"data":{"id":"n16","source":"n7","target":"n3"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"edges"},{"data":{"id":"n17","source":"n13","target":"n8"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"edges"},{"data":{"id":"n18","source":"n8","target":"n5"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"edges"},{"data":{"id":"n19","source":"n8","target":"n6"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"edges"},{"data":{"id":"n20","source":"n8","target":"n9"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"edges"},{"data":{"id":"n21","source":"n13","target":"n10"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"edges"},{"data":{"id":"n22","source":"n10","target":"n5"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"edges"},{"data":{"id":"n23","source":"n10","target":"n9"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"edges"}],"name":"Attack Scenario 3"},{"data":[{"data":{"address":"10.0.2.9","id":"n1","label":"DAFIS-ST2540-ControllerA","type":"HostAttackGraph"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"parent":"n1","id":"n2","label":"microsoft:word:2010:sp1","type":"Product"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"parent":"n2","id":"n3","label":"USER_ACCESS","type":"Privilege"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"parent":"n2","id":"n4","label":"CRASH","type":"Privilege"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"parent":"n2","id":"n5","label":"RANDOM_CODE_EXECUTION","type":"Privilege"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"parent":"n1","id":"n6","label":"adobe:acrobat:8.1.1","type":"Product"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"parent":"n6","id":"n7","label":"USER_ACCESS","type":"Privilege"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"parent":"n6","id":"n8","label":"CRASH","type":"Privilege"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"parent":"n2","id":"n9","label":"6 CVEs","type":"VulnerabilityExploit","cves":["CVE-2013-3847","CVE-2013-3848","CVE-2013-3849","CVE-2013-3850","CVE-2014-0260","CVE-2014-1757"]},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"parent":"n2","id":"n10","label":"CVE-2014-4117","type":"VulnerabilityExploit","cves":["CVE-2014-4117"]},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"parent":"n6","id":"n11","label":"72 CVEs","type":"VulnerabilityExploit","cves":["CVE-2007-5659","CVE-2008-2992","CVE-2009-0193","CVE-2009-0198","CVE-2009-0509","CVE-2009-0510","CVE-2009-0511","CVE-2009-0512","CVE-2009-0658","CVE-2009-0888","CVE-2009-0889","CVE-2009-0928","CVE-2009-1855","CVE-2009-1861","CVE-2009-2986","CVE-2009-2994","CVE-2009-2997","CVE-2009-3431","CVE-2009-3459","CVE-2009-3953","CVE-2009-3958","CVE-2010-0194","CVE-2010-0197","CVE-2010-0198","CVE-2010-0199","CVE-2010-0201","CVE-2010-0202","CVE-2010-0203","CVE-2010-0204","CVE-2010-1278","CVE-2010-1295","CVE-2010-2202","CVE-2010-2207","CVE-2010-2209","CVE-2010-2210","CVE-2010-2211","CVE-2010-2212","CVE-2010-2883","CVE-2010-2890","CVE-2010-3619","CVE-2010-3621","CVE-2010-3622","CVE-2010-3623","CVE-2010-3628","CVE-2010-3632","CVE-2010-3658","CVE-2010-4091","CVE-2011-0563","CVE-2011-0566","CVE-2011-0567","CVE-2011-0589","CVE-2011-0603","CVE-2011-0605","CVE-2011-0606","CVE-2011-2094","CVE-2011-2095","CVE-2011-2096","CVE-2011-2097","CVE-2011-2098","CVE-2011-2099","CVE-2011-2103","CVE-2011-2104","CVE-2011-2105","CVE-2011-2106","CVE-2011-2432","CVE-2011-2433","CVE-2011-2434","CVE-2011-2435","CVE-2011-2436","CVE-2011-2437","CVE-2011-2438","CVE-2011-2441"]},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"parent":"n6","id":"n12","label":"RANDOM_CODE_EXECUTION","type":"Privilege"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"parent":"n6","id":"n13","label":"18 CVEs","type":"VulnerabilityExploit","cves":["CVE-2007-5663","CVE-2007-5666","CVE-2008-0726","CVE-2009-1856","CVE-2009-2980","CVE-2009-2989","CVE-2009-2990","CVE-2009-2995","CVE-2009-3954","CVE-2009-3959","CVE-2010-0191","CVE-2010-0195","CVE-2010-2205","CVE-2010-2206","CVE-2010-2208","CVE-2010-3625","CVE-2011-0598","CVE-2011-2101"]},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"address":"10.0.2.5","id":"n14","label":"Apache HTTP Server","type":"HostAttackGraph"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"parent":"n14","id":"n15","label":"adobe:acrobat:8.1.1","type":"Product"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"parent":"n15","id":"n16","label":"72 CVEs","type":"VulnerabilityExploit","cves":["CVE-2007-5659","CVE-2008-2992","CVE-2009-0193","CVE-2009-0198","CVE-2009-0509","CVE-2009-0510","CVE-2009-0511","CVE-2009-0512","CVE-2009-0658","CVE-2009-0888","CVE-2009-0889","CVE-2009-0928","CVE-2009-1855","CVE-2009-1861","CVE-2009-2986","CVE-2009-2994","CVE-2009-2997","CVE-2009-3431","CVE-2009-3459","CVE-2009-3953","CVE-2009-3958","CVE-2010-0194","CVE-2010-0197","CVE-2010-0198","CVE-2010-0199","CVE-2010-0201","CVE-2010-0202","CVE-2010-0203","CVE-2010-0204","CVE-2010-1278","CVE-2010-1295","CVE-2010-2202","CVE-2010-2207","CVE-2010-2209","CVE-2010-2210","CVE-2010-2211","CVE-2010-2212","CVE-2010-2883","CVE-2010-2890","CVE-2010-3619","CVE-2010-3621","CVE-2010-3622","CVE-2010-3623","CVE-2010-3628","CVE-2010-3632","CVE-2010-3658","CVE-2010-4091","CVE-2011-0563","CVE-2011-0566","CVE-2011-0567","CVE-2011-0589","CVE-2011-0603","CVE-2011-0605","CVE-2011-0606","CVE-2011-2094","CVE-2011-2095","CVE-2011-2096","CVE-2011-2097","CVE-2011-2098","CVE-2011-2099","CVE-2011-2103","CVE-2011-2104","CVE-2011-2105","CVE-2011-2106","CVE-2011-2432","CVE-2011-2433","CVE-2011-2434","CVE-2011-2435","CVE-2011-2436","CVE-2011-2437","CVE-2011-2438","CVE-2011-2441"]},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"parent":"n15","id":"n17","label":"USER_ACCESS","type":"Privilege"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"parent":"n15","id":"n18","label":"CRASH","type":"Privilege"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"parent":"n15","id":"n19","label":"RANDOM_CODE_EXECUTION","type":"Privilege"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"address":"101.98.112.2","id":"n20","label":"Attacker PC-001","type":"HostAttackGraph"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"parent":"n20","id":"n21","label":"microsoft:windows_7:sp1","type":"Product"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"parent":"n21","id":"n22","label":"USER_ACCESS","type":"Privilege"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"id":"n23","source":"n22","target":"n9"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"edges"},{"data":{"id":"n24","source":"n9","target":"n3"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"edges"},{"data":{"id":"n25","source":"n9","target":"n4"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"edges"},{"data":{"id":"n26","source":"n9","target":"n5"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"edges"},{"data":{"id":"n27","source":"n22","target":"n10"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"edges"},{"data":{"id":"n28","source":"n10","target":"n3"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"edges"},{"data":{"id":"n29","source":"n10","target":"n5"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"edges"},{"data":{"id":"n30","source":"n22","target":"n11"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"edges"},{"data":{"id":"n31","source":"n11","target":"n7"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"edges"},{"data":{"id":"n32","source":"n11","target":"n8"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"edges"},{"data":{"id":"n33","source":"n11","target":"n12"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"edges"},{"data":{"id":"n34","source":"n22","target":"n13"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"edges"},{"data":{"id":"n35","source":"n13","target":"n12"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"edges"},{"data":{"id":"n36","source":"n22","target":"n16"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"edges"},{"data":{"id":"n37","source":"n16","target":"n17"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"edges"},{"data":{"id":"n38","source":"n16","target":"n18"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"edges"},{"data":{"id":"n39","source":"n16","target":"n19"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"edges"}],"name":"Attack Scenario 0"},{"data":[{"data":{"address":"10.0.2.9","id":"n1","label":"DAFIS-ST2540-ControllerA","type":"HostAttackGraph"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"parent":"n1","id":"n2","label":"microsoft:word:2010:sp1","type":"Product"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"parent":"n2","id":"n3","label":"USER_ACCESS","type":"Privilege"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"parent":"n2","id":"n4","label":"CRASH","type":"Privilege"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"parent":"n2","id":"n5","label":"RANDOM_CODE_EXECUTION","type":"Privilege"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"parent":"n1","id":"n6","label":"adobe:acrobat:8.1.1","type":"Product"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"parent":"n6","id":"n7","label":"USER_ACCESS","type":"Privilege"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"parent":"n6","id":"n8","label":"CRASH","type":"Privilege"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"parent":"n1","id":"n9","label":"microsoft:windows_7:sp1","type":"Product"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"parent":"n9","id":"n10","label":"USER_ACCESS","type":"Privilege"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"parent":"n2","id":"n11","label":"6 CVEs","type":"VulnerabilityExploit","cves":["CVE-2013-3847","CVE-2013-3848","CVE-2013-3849","CVE-2013-3850","CVE-2014-0260","CVE-2014-1757"]},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"parent":"n2","id":"n12","label":"CVE-2014-4117","type":"VulnerabilityExploit","cves":["CVE-2014-4117"]},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"parent":"n6","id":"n13","label":"72 CVEs","type":"VulnerabilityExploit","cves":["CVE-2007-5659","CVE-2008-2992","CVE-2009-0193","CVE-2009-0198","CVE-2009-0509","CVE-2009-0510","CVE-2009-0511","CVE-2009-0512","CVE-2009-0658","CVE-2009-0888","CVE-2009-0889","CVE-2009-0928","CVE-2009-1855","CVE-2009-1861","CVE-2009-2986","CVE-2009-2994","CVE-2009-2997","CVE-2009-3431","CVE-2009-3459","CVE-2009-3953","CVE-2009-3958","CVE-2010-0194","CVE-2010-0197","CVE-2010-0198","CVE-2010-0199","CVE-2010-0201","CVE-2010-0202","CVE-2010-0203","CVE-2010-0204","CVE-2010-1278","CVE-2010-1295","CVE-2010-2202","CVE-2010-2207","CVE-2010-2209","CVE-2010-2210","CVE-2010-2211","CVE-2010-2212","CVE-2010-2883","CVE-2010-2890","CVE-2010-3619","CVE-2010-3621","CVE-2010-3622","CVE-2010-3623","CVE-2010-3628","CVE-2010-3632","CVE-2010-3658","CVE-2010-4091","CVE-2011-0563","CVE-2011-0566","CVE-2011-0567","CVE-2011-0589","CVE-2011-0603","CVE-2011-0605","CVE-2011-0606","CVE-2011-2094","CVE-2011-2095","CVE-2011-2096","CVE-2011-2097","CVE-2011-2098","CVE-2011-2099","CVE-2011-2103","CVE-2011-2104","CVE-2011-2105","CVE-2011-2106","CVE-2011-2432","CVE-2011-2433","CVE-2011-2434","CVE-2011-2435","CVE-2011-2436","CVE-2011-2437","CVE-2011-2438","CVE-2011-2441"]},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"parent":"n6","id":"n14","label":"RANDOM_CODE_EXECUTION","type":"Privilege"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"parent":"n9","id":"n15","label":"FILE_ACCESS","type":"Privilege"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"id":"n16","source":"n10","target":"n11"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"edges"},{"data":{"id":"n17","source":"n11","target":"n3"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"edges"},{"data":{"id":"n18","source":"n11","target":"n4"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"edges"},{"data":{"id":"n19","source":"n11","target":"n5"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"edges"},{"data":{"id":"n20","source":"n10","target":"n12"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"edges"},{"data":{"id":"n21","source":"n12","target":"n3"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"edges"},{"data":{"id":"n22","source":"n12","target":"n5"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"edges"},{"data":{"id":"n23","source":"n10","target":"n13"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"edges"},{"data":{"id":"n24","source":"n13","target":"n7"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"edges"},{"data":{"id":"n25","source":"n13","target":"n8"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"edges"},{"data":{"id":"n26","source":"n13","target":"n14"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"edges"}],"name":"Attack Scenario 1"},{"data":[{"data":{"address":"10.0.2.5","id":"n1","label":"Apache HTTP Server","type":"HostAttackGraph"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"parent":"n1","id":"n2","label":"microsoft:windows_7:sp1","type":"Product"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"parent":"n2","id":"n3","label":"FILE_MODIFICATION","type":"Privilege"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"},{"data":{"parent":"n2","id":"n4","label":"USER_ACCESS","type":"Privilege"},"selectable":true,"grabbable":true,"locked":false,"selected":false,"group":"nodes"}],"name":"Attack Scenario 4"}];
						$scope.attackGraphs.sort(function(a, b){return a.name.localeCompare(b.name);})
						$scope.selectedAttackGraph = $scope.attackGraphs[0];
					// TODO: Add for loop to add alarmed states 
						console.debug($scope.attackGraphs);
						var k; var l; var rand;
						
					for(k = 0; k < $scope.attackGraphs.length; k++){
							for(l=0; l < $scope.attackGraphs[k].data.length; l++){
						if($scope.attackGraphs[k].data[l].group == 'nodes'){
							if($scope.attackGraphs[k].data[l].data.type == 'Privilege'){
								$scope.attackGraphs[k].data[l].data.state = {};
								$scope.attackGraphs[k].data[l].data.cause = {};
								$scope.attackGraphs[k].data[l].data.cause.name = {};
								$scope.attackGraphs[k].data[l].data.cause.hostname = {};
								if(l % 2 == 0){
									$scope.attackGraphs[k].data[l].data.state = 'alarmed';
									rand = Math.floor(Math.random() * $scope.malwares.length) + 0;  
									$scope.attackGraphs[k].data[l].data.cause.name = $scope.malwares[rand].name;
									$scope.attackGraphs[k].data[l].data.cause.hostname =$scope.malwares[rand].hostname;
									}
								else{
									$scope.attackGraphs[k].data[l].data.state = 'non-alarmed';
									}
								}
							}	
						  }
						}
					if($rootScope.networkDrawPromise)
					{
						$rootScope.networkDrawPromise.then(function(){	return AttackGraphDisplay($scope.selectedAttackGraph.data,$scope);});
					}
					$scope.selectedAttackGraphChanged = function() {
						AttackGraphDisplay($scope.selectedAttackGraph.data,$scope);
						$('#info').hide();
					};
					EventAggregator.publish('UpdateTopoplogy');
				//});
				
	}]); // -- END
});
