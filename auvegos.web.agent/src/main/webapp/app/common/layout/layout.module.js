define(['angularAMD', 'angular-ui-router', 'ocLazyLoad'], function(ng) {
	'use strict';
	var layout = angular.module('app.common.layout', ['ui.router.state']);

	layout.config(function($stateProvider, $urlRouterProvider, $controllerProvider, $compileProvider, $provide) {

		layout.register = {
			controller: $controllerProvider.register,
			directive: $compileProvider.directive,
			factory : $provide.factory,
			service : $provide.service
		};

		$stateProvider.state('main', {
			//url: '',
			abstract: true,
			views : {
				// ui-view="" can be referred as '@': here 
				// ('""@"", 'empty view'@'empty state')
				'mainContent@' : {
					controller: 'AppCtrl',
					templateUrl : 'app/common/layout/layout.tpl.html'
				},
				/*
					 'navigation@main' : {
					 template: NavHelperProvider.getViews(),
					 controller: 'NavCtrl'
					 },
					 'topbar@main' : {
					 template : TopBarHelperProvider.getViews()
					 },
					 'content@main' : {
					 template : ContentHelperProvider.getViews()
					 }
					 */
				/*
				'header@main' : {
				//navigation
					templateUrl : 'app/core/header/header.tpl.html'
					//controller: 'NavCtrl'
				},
				'sidenav@main' : {
					templateUrl : 'app/common/sidebar/sidenav.tpl.html'
				},
				'content@main' : {
					// path to the template
					templateUrl : 'app/components/maincontent/maincontent.tpl.html',
					// name of control module
					controller: 'MainContentCtrl'
				},
				'topbanner@main' : {
					templateUrl : 'app/core/banners/top-banner-ceo.html'
				},
				'bottombanner@main' : {
					templateUrl : 'app/core/banners/bottom-banner-ceo.html'
				}
				*/
				/*
				'footer@main' : {
					templateUrl : 'app/core/footer/footer.tpl.html'
				}
				*/
			},
			resolve: {
				// load all libs used by this domain ( also in child pages)
				loadMyDirectives:['$ocLazyLoad', function($ocLazyLoad){
						return 

							$ocLazyLoad.load(
								{
									//name:'app',
									files:[
									]
								}),
						$ocLazyLoad.load(
								{
									name:'toggle-switch',
									files:["assets/libs/angular-toggle-switch/angular-toggle-switch.min.js",
									"assets/libs/angular-toggle-switch/angular-toggle-switch.css"
									]
								}),
						$ocLazyLoad.load(
								{
									name:'ngAnimate',
									files:['assets/libs/angular-animate/angular-animate.js']
								}),
						$ocLazyLoad.load(
								{
									name:'ngCookies',
									files:['assets/libs/angular-cookies/angular-cookies.js']
								}),
						$ocLazyLoad.load(
								{
									name:'ngResource',
									files:['assets/libs/angular-resource/angular-resource.js']
								}),
						$ocLazyLoad.load(
								{
									name:'ngSanitize',
									files:['assets/libs/angular-sanitize/angular-sanitize.js']
								}),
						$ocLazyLoad.load(
								{
									name:'ngTouch',
									files:['assets/libs/angular-touch/angular-touch.js']
								});
					}], ///
				loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						// Put all realted file here: css, javascript source code for controllers, etc... (NOT MODULE).
						// /files: ['app/app.controller'].concat(TopBarHelperProvider.getControllers()).concat(NavHelperProvider.getControllers())
						files: ['app/app.controller',
							'app/core/banners/banners.css',
							'app/core/main.css',
							'app/core/navbar/nav-account.css',
							'app/core/navbar/nav-menu.css',

							//'app/components/maincontent/maincontent.css'
						]
					});
				}]
			}
		})
		//--------------- 
		// Tutorials
		//----------------
		//------------- angular wizard demo --------------------




       
		.state('main.angularwizard', {
			url: '/angularwizard', /* e.g http://localhost:8000/#/home */
			//parent:'main.tutorial',
			views : {
				// ui-view="" can be referred as '@': here 
				// ('""@"", 'empty view'@'empty state')
				/*
				'mainContent@' : {
					controller: 'AppCtrl',
					templateUrl : 'app/component/home/home.tpl.html'
				},
				*/
				'content@main' : {
					templateUrl : 'app/components/tutorial/angular-wizard/wizard.tpl.html',
					controller: 'WizardCtrl'
				},
				'footer@main' : {
					template: 'footer added'
				}
			},
			resolve: {
				loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						//files: ['app/app.controller'].concat(TopBarHelperProvider.getControllers()).concat(NavHelperProvider.getControllers())
						files: [
							'app/components/tutorial/angular-wizard/wizard.controller',
							'assets/libs/angular-wizard/dist/angular-wizard.min.css',

						]
					});
				}]
			}
            })
            // ISCO Simulation
            // Parent state TODO__________________________________________________________________________________________


            // Parent state for pages with a network map
            .state('main.serviceParent', {
                abstract: true,
                //url: '/serviceParent',
                views: {
                    'content@main': {
                        controller: 'ServiceCtrl',
                        //templateUrl: 'app/components/tutorial/index.html'
                        templateUrl: 'app/components/tutorial/iscosimulation/simulation.tpl.html'
                    },
                    'mapElements@main.serviceParent': {
                        controller: 'MapElementsCtrl',
                        templateUrl: 'app/components/tutorial/iscosimulation/mapElements.tpl.html'
                        //template: '<div>thisis the map</div><div ui-view="mapmap"></div>'
                    },
                    'serviceElements@main.serviceParent': {
                        templateUrl: 'app/components/tutorial/iscosimulation/serviceElements.tpl.html',
                        controller: 'ServiceElementsCtrl'
                    }

                },
                resolve: {
                    loadCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: [
                                //'app/core/banners/banners.css',
                                //'assets/libs/bootstrap-css/css/bootstrap.min.css',
                                'app/components/tutorial/iscosimulation/servicemodule.service',
                                'app/components/tutorial/iscosimulation/simulation.controller',
                                'app/components/tutorial/iscosimulation/serviceElements.controller',
                                'app/components/tutorial/iscosimulation/mapElements.controller',


                                //other files (ctrl, html)
                            ]
                        });
                    }]
                  
                }
            })
            // serviceElements details (view1)
            .state('main.serviceParent.serviceElements', {
                url: '/serviceElements',
                parent: 'main.serviceParent',
                views: {
                    
                    'serviceElements@main.serviceParent': {
                        templateUrl: 'app/components/tutorial/iscosimulation/serviceElements.tpl.html',
                        controller: 'ServiceElementsCtrl'
                    }
                },
                resolve: {
                    loadCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            files: [
                                'app/components/tutorial/iscosimulation/serviceElements.controller',
                                'app/components/tutorial/iscosimulation/mapElements.controller'
                            ]
                        });
                    }]
                }
            })
            // defined above
            .state('main.serviceParent.mapElements', {
                parent: 'main.serviceParent',
                url: '/mapElements',
                //params: { reload: true },
                views: {
                 
                    'mapElements@main.serviceParent': {
                        controller: 'MapElementsCtrl',
                        templateUrl: 'app/components/tutorial/iscosimulation/mapElements.tpl.html'
                       // template: '<div>thisis the map</div><div ui-view="mapmap"></div>'
                    }
                  

                },
                resolve: {
                    loadCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            
                            files: [
                                'app/components/tutorial/iscosimulation/mapElements.controller']
                        });
                    }],
                   

                }
            })
            // tBD...

       /*     // Child state for left section: service details
            .state('main.services', {
                //parent: 'main.networkParent',
                url: '/services',
                views: {
                    'content@main': {
                        controller: 'ServiceCtrl',
                        //templateUrl: 'app/components/tutorial/index.html'
                        templateUrl: 'app/components/tutorial/iscosimulation/simulation.tpl.html'
                    }
										//'map-view': {
                    //    controller: 'GmapCtrl',
                    //    //templateUrl: 'app/components/tutorial/index.html'
                    //    templateUrl: 'app/components/tutorial/gmap/gmap.tpl.html'
                    //}
                },
                resolve: {
                    loadCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            //files: ['app/app.controller'].concat(TopBarHelperProvider.getControllers()).concat(NavHelperProvider.getControllers())
                            files: [
			 	                'app/components/tutorial/iscosimulation/servicemodule.service',
                                'app/components/tutorial/iscosimulation/simulation.controller',
                                //'app/components/tutorial/gmap/gmap.controller',
                                //'assets/libs/angular-wizard/dist/angular-wizard.min.css',

                            ]
                        });
                    }]
                }
            })  */
            // Child state for right section: map
		//------------ end tutorial-------------
		.state('main.home', {
			url: '/home', /* e.g http://localhost:8000/#/home */
			views : {
				// ui-view="" can be referred as '@': here 
				// ('""@"", 'empty view'@'empty state')
				/*
				'mainContent@' : {
					controller: 'AppCtrl',
					templateUrl : 'app/component/home/home.tpl.html'
				},
				*/
				'content@main' : {
					templateUrl : 'app/components/home/home.tpl.html'
				},
				'footer@main' : {
					template: 'footer added'
				}

			},
			resolve: {
				loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						//files: ['app/app.controller'].concat(TopBarHelperProvider.getControllers()).concat(NavHelperProvider.getControllers())
						files: [
							'app/core/header/header.controller']
					});
				}]
			}
		})
		.state('main.ceo', {
			url: '/ceo', /* e.g http://localhost:8000/#/home */
			views : {
				// ui-view="" can be referred as '@': here 
				// ('""@"", 'empty view'@'empty state')
				/*
				'mainContent@' : {
					controller: 'AppCtrl',
					templateUrl : 'app/component/home/home.tpl.html'
				},
				*/
				'content@main' : {
					// path to the template
					templateUrl : 'app/components/maincontent/maincontent.tpl.html',
					// name of control module
					controller: 'MainContentCtrl'
				},
				'topbanner@main' : {
					templateUrl : 'app/core/banners/top-banner-ceo.html',
					controller: 'TopBannerCtrl'
				},
				'bottombanner@main' : {
					templateUrl : 'app/core/banners/bottom-banner-ceo.html'
				},
				'nav-account@main.ceo' : {
					templateUrl : 'app/core/navbar/nav-account.html',
					controller: 'NavAccountCtrl'
				}
			},
			resolve: {
				loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						//files: ['app/app.controller'].concat(TopBarHelperProvider.getControllers()).concat(NavHelperProvider.getControllers())
						files: [
							'app/components/maincontent/ceo.css',
							'app/components/maincontent/networkInfoServices',
							'app/components/maincontent/ceo.directive',
							'app/components/maincontent/ceo.dialog.controller',
							'app/components/maincontent/maincontent.controller',
							'app/core/banners/banners.controller',
							'app/core/navbar/nav-account.css',
							'app/core/navbar/nav-menu.css',
							'app/core/navbar/nav-account.controller',
						]
					});
				}]
			}
		})
		// Parent state for pages with a network map
		.state('main.networkParent', {
			abstract: true,
			//url: '/net',
			views : {
				'content@main' : {
					templateUrl : 'app/components/network-modeling/network.tpl.html',
					//template: '<div>thisis it</div><div ui-view="networkDetails"></div>',
					controller: 'NetworkCtrl'
				},
				'topbanner@main' : {
					templateUrl : 'app/core/banners/top-banner.html'
				},
				'bottombanner@main' : {
//					templateUrl : 'app/core/banners/bottom-banner.html'
					templateUrl : 'app/core/banners/bottom-banner-ceo.html'
				},
				'nav-menu@main.networkParent' : {
					templateUrl : 'app/core/navbar/nav-menu.html'
				},
				'nav-account@main.networkParent' : {
					templateUrl : 'app/core/navbar/nav-account.html',
					controller: 'NavAccountCtrl'
				}
			},
			resolve: {
				loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						files:[
							//'app/core/banners/banners.css',
							//'assets/libs/bootstrap-css/css/bootstrap.min.css',
							'app/common/jsUtils/designPatterns',
							'app/components/network-modeling/network.css',
							'app/components/traffic-analysis/trafficanalysisservices',
							'app/components/log-analysis/loganalysisservices',
							'app/components/security-overview/securityoverviewservices',
							'app/components/network-modeling/network.services',
							'app/components/network-modeling/network.controller',
							'app/core/navbar/nav-account.css',
							'app/core/navbar/nav-account.controller',
						]
					});
				}],
				checkTopoLoaded:  function(){
					return {'value': 'A'};
				}
			}
		})
		// Network details
		.state('main.networkParent.network', {
			url: '/network',
			parent:'main.networkParent',
			views : {
				// ui-view="" can be referred as '@': here 
				// ('""@"", 'empty view'@'empty state')
				// https://github.com/angular-ui/ui-router/wiki/Multiple-Named-Views
				// 'networkDetails@main.networkParent' : {
				'networkDetails@main.networkParent' : {
					templateUrl : 'app/components/network-modeling/network-details.tpl.html',
					controller: 'NetworkDetailsCtrl'
				}
			},
			resolve: {
				loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						files:[
							'app/components/network-modeling/network-details.controller'
						]
					});
				}]
			}
		})
		//
		.state('main.networkParent.loganalysis', {
			parent:'main.networkParent',
			url: '/loganalysis',
			params: {reload: true},
			views : {
				// ui-view="" can be referred as '@': here 
				// ('""@"", 'empty view'@'empty state')
				/*
				'mainContent@' : {
					controller: 'AppCtrl',
					templateUrl : 'app/component/home/home.tpl.html'
				},
				*/
				'networkDetails@main.networkParent' : {
					controller: 'LogAnalysisCtrl',
					templateUrl : 'app/components/log-analysis/log-analysis.tpl.html'
				}
				/*,
				'footer@main' : {
					template: 'footer added'
				}
				*/

			},
			resolve: {
				loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						//files: ['app/app.controller'].concat(TopBarHelperProvider.getControllers()).concat(NavHelperProvider.getControllers())
						files: [
						        'assets/libs/nvd3/nv.d3.css',
						        'app/core/classes/Table',
								'app/components/log-analysis/loganalysis.css',
								'app/components/log-analysis/loganalysis.controller']
					});
				}],
				ensureTopoLoaded: function(checkTopoLoaded) {
					return {'value': 'A'};
				}

			}
            })


        
		.state('main.networkParent.trafficanalysis', {
			parent:'main.networkParent',
			url: '/trafficanalysis',
			views : {
				// ui-view="" can be referred as '@': here 
				// ('""@"", 'empty view'@'empty state')
				/*
				'mainContent@' : {
					controller: 'AppCtrl',
					templateUrl : 'app/component/home/home.tpl.html'
				},
				*/
				'networkDetails@main.networkParent' : {
					controller: 'TrafficAnalysisCtrl',
					templateUrl : 'app/components/traffic-analysis/traffic-analysis.tpl.html'
				}
			},
			resolve: {
				loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						//name:'chart.js',
						files:[
							'assets/libs/angular-chart.js/dist/angular-chart.min',
							//'assets/libs/angular-chart.js/dist/angular-chart.css',
							'assets/libs/nvd3/nv.d3.css',
							'app/components/traffic-analysis/scripts/network_hosts_chart/bihisankey',
							'app/components/traffic-analysis/scripts/network_hosts_chart/networkHosts',
							'app/components/traffic-analysis/scripts/network_hosts_chart/sankey_bi_directional',
							'app/components/traffic-analysis/trafficanalysis.css',
							'app/components/traffic-analysis/scripts/network_hosts_chart/sankey_bi_directional.css',
							'app/components/traffic-analysis/trafficanalysis.controller'
						]
					}).then(function success(args) {
						  console.log('success');
							  return args;
					}, function error(err) {
						  console.log(err);
							return err;
					})
				}]
			}
		})
		.state('main.networkParent.securityoverview', {
			parent:'main.networkParent',
			url: '/securityoverview',
			views : {
				// ui-view="" can be referred as '@': here -->
				// ('""@"", 'empty view'@'empty state')
				/*
				'mainContent@' : {
					controller: 'AppCtrl',
					templateUrl : 'app/component/home/home.tpl.html'
				},
				*/
				'networkDetails@main.networkParent' : {
					controller: 'SecurityOverviewCtrl',
					templateUrl : 'app/components/security-overview/security-overview.tpl.html'
				}
				/*,
				'topbanner@main' : {
					templateUrl : 'app/core/banners/top-banner.html'
				},
				'bottombanner@main' : {
					templateUrl : 'app/core/banners/bottom-banner.html'
				}
				'footer@main' : {
					template: 'footer added'
				}
				*/

			},
			resolve: {
				loadCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						//files: ['app/app.controller'].concat(TopBarHelperProvider.getControllers()).concat(NavHelperProvider.getControllers())
						files: [
						    'assets/libs/nvd3/nv.d3.css',
							'app/components/security-overview/securityoverview.css',
							'app/components/security-overview/securityoverview.controller'
							]
					});
				}]
			}
		}); ///- State provider


	}); ///- Layout.config
	return layout;
});
