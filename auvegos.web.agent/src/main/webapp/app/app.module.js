var module = [ 
  'angularAMD',
  //'../app/core/core.module',
  'angular-translate',
  'angular-translate-loader-static-files',
  'angular-ui-router',
  'ocLazyLoad',
  'angular-css-injector',
  'angular-messages',
  'angular-sanitize',
	'angular-animate', 
  'angular-material',
  'angular-material-icons',
  'angular-wizard',
  'angular-utils-pagination',
  'ui-bootstrap',
  'jquery',
  /*'angular-resource',*/
  'Restangular',
	'd3',	
	'nvd3',
	'angularjs-nvd3-directives',
	'cytoscape',
	'angular-chart',	
	//'chart',	
	// Add module.js file (path without .js) of each webpage part, which
    // contains the COMPONENTs in each part. We still have to add the name
    // of our (Angular) MODULE in the next section (var e).
  //'app/node/nodes.module',
  //'common/login/login.module',
  //'common/navigation/navigation.module',
  //'common/topbar/topbar.module',
  'app/common/config/env.module',
  'app/common/layout/layout.module'
	//-- core --
	//'app/core/header/header.MODULE'
	//-- components --


]; //needed module

// The name of all module used by our angular app 
var e = [ 
  'ui.router',
  'oc.lazyLoad',
  'pascalprecht.translate',
  'angular.css.injector',
  'ngMessages',
  'ngSanitize',
  'ngAnimate',
  'ngMaterial',
	'ngMdIcons',
	'ui.bootstrap',
	/*'ngResource',*/
  'restangular',
  'chart.js',
  'mgo-angular-wizard',
	  //'app.nodes',
  //'app.topology',
	//-- common --
  //'app.common.login',
  //'app.common.nav',
  //'app.common.topbar',
  'app.common.layout',
	//-- core --
	//'app.core.header',
	//-- components --
  'angularUtils.directives.dirPagination'
]; // ONLY MODULE names
//--------------------\\

define(module, function(ng) {
  'use strict';

	var app = angular.module('app', e);
	
	//var cy = cytoscape({});
	
	// The overal config he is done here.
	app.config(function ($stateProvider, $urlRouterProvider,  $ocLazyLoadProvider, 
				$translateProvider,  $controllerProvider, $compileProvider, $provide, 
				cssInjectorProvider, $mdThemingProvider) {
		
		/** Holding all modules. Register new module with 
		 * 'app.register.[controller|directive|factory|service]
		 */
		app.register = {
			controller : $controllerProvider.register,
			directive : $compileProvider.directive,
			factory : $provide.factory,
			service : $provide.service

		};

		// Route Settings
		$urlRouterProvider.otherwise("/ceo"); // set the default route
		//--
		$provide.decorator('$state',
        ["$delegate", "$stateParams", '$timeout', function ($delegate, $stateParams, $timeout) {
            $delegate.forceReload = function () {
                var reload = function () {
                    $delegate.transitionTo($delegate.current, angular.copy($stateParams), {
                        reload: true,
                        inherit: true,
                        notify: true
                    })
                };
                reload();
                $timeout(reload, 100);
            };
            return $delegate;
        }]);

		/// CSS
		cssInjectorProvider.setSinglePageMode(true); // remove all added CSS files when the page change

		/// ocLazyLoader config
		// set the ocLazyLoader to output error and use requirejs as loader
		$ocLazyLoadProvider.config({
			debug: true,
			asyncLoader: require
		});

		/// translation config
		$translateProvider.preferredLanguage('en_US');

		/// d3
		console.log("d3.version = " + d3.version);
		//console.log("cytoscape.version = " + cytoscape.version);

		/// angular-material config
		var customBlueMap = 		$mdThemingProvider.extendPalette('light-blue', {
			'contrastDefaultColor': 'light',
			'contrastDarkColors': ['50'],
			'50': 'ffffff'
		});
		$mdThemingProvider.definePalette('customBlue', customBlueMap);
		$mdThemingProvider.theme('default')
			.primaryPalette('customBlue', {
				'default': '500',
				'hue-1': '50'
			})
		.accentPalette('pink');
		$mdThemingProvider.theme('input', 'default')
			.primaryPalette('grey')
			//- angular-material
	});

	// RootController with listeners
	app.controller('rootCtrl', function($rootScope) {
    $rootScope.root = 'system info';
    $rootScope.logs = [{
      time: new Date(),
      text: 'welcome!'
    }];
    $rootScope.log = function(text) {
      $rootScope.logs.push({
        time: new Date(),
        text: text
      });
    }
				// Load parent state when not found
				/*
				$rootScope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams) {
					$log.log("$stateNotFound event: ", event);
            $log.log("$stateNotFound unfoundState: ", unfoundState);
            $log.log("$stateNotFound fromState: ", fromState);
            $log.log("$stateNotFound fromParams: ", fromParams);

            var toState = unfoundState.to,
                toStateParent = toState;

            if (toState.indexOf(".")) {
                // Check if parent state is a valid state
                var firstToState = toState.split(".")[0];
                if ($state.get(firstToState)) {
                    $log.log("Parent state '" + firstToState + "' found for '" + toState + "'" );
                    toStateParent = firstToState;
                    
                    // Load first the parent state
                    $state.go(toStateParent).then(function (resolved) {
                        // Only go to final state if it exists.
                        if ($state.get(toState)) {
                            return $state.go(toState);
                        } else {
                            // Go back to calling state
                            $log.log("Going back to ", fromState);
                            return $state.go(fromState.name);
                        }
                    });
                    event.preventDefault();
                } else {
                    $log.error(toState + " state not found.");
                }
            };
        });
				*/



  }); ///- rootCtrl
	
	// comment out when use bootstrap.js
	ng.bootstrap(app);
	console.log('bootstrap done (-: ');
			return app;
});

