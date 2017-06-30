require.config({
	nodeIdCompat: true,
  baseUrl : '.',
  paths : {
    'angular' : 'assets/libs/angular/angular',
    'angularAMD' : 'assets/libs/angularAMD/angularAMD',
    'ngload' : 'assets/libs/angularAMD/ngload',
    'ui-bootstrap' : 'assets/libs/angular-bootstrap/ui-bootstrap-tpls.min',
    'domReady' : 'assets/libs/requirejs-domready/domReady',
    'underscore' : 'assets/libs/underscore/underscore',
    'angular-ui-router' : 'assets/libs/angular-ui-router/release/angular-ui-router',
    'angular-css-injector' : 'assets/libs/angular-css-injector/angular-css-injector',
    'angular-cookies' : 'assets/libs/angular-cookies/angular-cookies.min',
    'angular-translate' : 'assets/libs/angular-translate/angular-translate.min',
    'angular-wizard' : 'assets/libs/angular-wizard/dist/angular-wizard.min',
    'angular-simple-logger' : 'assets/libs/angular-simple-logger/dist/angular-simple-logger',
    'angular-google-maps' : 'assets/libs/angular-google-maps/dist/angular-google-maps.min',
    'angular-translate-loader-static-files' : 'assets/libs/angular-translate-loader-static-files/angular-translate-loader-static-files.min',
    'jquery' : 'assets/libs/jquery/dist/jquery.min',
    'jquery-ui' : 'assets/libs/jquery-ui/jquery-ui.min',
    'ocLazyLoad' : 'assets/libs/ocLazyLoad/dist/ocLazyLoad',
		/// REST 
    'Restangular' : 'assets/libs/restangular/dist/restangular.min',
    'angular-resource': 'assets/libs/angular-resource/angular-resource',
				/// D3
		'd3' : 'assets/libs/d3/d3',
		'nvd3': 'assets/libs/nvd3/nv.d3.min',
		'chart': 'assets/libs/chart.js/dist/Chart',
		'angular-chart':'assets/libs/angular-chart.js/dist/angular-chart',
		'cytoscape' : 'assets/vendor/cytoscape/dist/cytoscape',
		'cytoscape-cose-bilkent' : 'assets/libs/cytoscape-cose-bilkent/cytoscape-cose-bilkent',
		'angularjs-nvd3-directives': 'assets/libs/angularjs-nvd3-directives/dist/angularjs-nvd3-directives.min',    
		/// Bootstrap
		//'bootstrap-dialog': 'assets/libs/bootstrap-dialog/dist/js//bootstrap-dialog',
		/// Material design
    'angular-messages' : 'assets/libs/angular-messages/angular-messages.min',
    'angular-sanitize' : 'assets/libs/angular-sanitize/angular-sanitize.min',
    'angular-animate' : 'assets/libs/angular-animate/angular-animate.min',
    'angular-aria' : 'assets/libs/angular-aria/angular-aria.min',
    'angular-material' : 'assets/libs/angular-material/angular-material.min',
	'angular-material-icons' : 'assets/libs/angular-material-icons/angular-material-icons.min',
	'angular-utils-pagination' : 'assets/libs/angular-utils-pagination/dirPagination'
  },
  shim : {
    'angularAMD' : ['angular'],
    'ocLazyLoad' : ['angular'],
    'angular-resource' : ['angular'],
    'Restangular' : ['angular', 'underscore'],
    'ui-bootstrap' : {
			deps: ['angular']
		},
    'angular-css-injector' : ['angular'],
    'angular-ui-router' : ['angular'],
    'angular-cookies' : ['angular'],
    'angular-translate': ['angular'],
    'angular-wizard': {
			deps: ['angular'],
      exports : 'mgo-angular-wizard'
		},
		'angular-simple-logger': {
			deps: ['angular'],
      exports : 'nemLogging'
		},
    'angular-google-maps': {
			deps: ['angular', 'angular-simple-logger'],
      exports : 'uiGmapgoogle-maps'
		},
    'angular-translate-loader-static-files' : ['angular-translate'],
    'ngload' : ['angularAMD'],
    'jquery' : {
      exports : '$'
    },
    'jquery-ui' : ['jquery'],
    'angular' : {
        deps: ['jquery','jquery-ui'],
        exports: 'angular'
    },
    'underscore' : {
      exports : '_'
    },
		'angular-messages' : {
      exports: "ngMessages",
      deps: [ "angular" ]
		},
		'angular-sanitize' : {
      exports: "ngSanitize",
      deps: [ "angular" ]
		},
		'angular-animate' : {
      exports: "ngAnimate",
      deps: [ "angular" ]
		},
		'angular-chart': { deps: ['angular','chart']},
		'chart': {
			exports: 'Chart'
		},
    'angular-aria': {
      exports: "ngAria",
      deps: [ "angular" ]
		},
    'angular-material' : {
			deps: ['angular', 'angular-animate', 'angular-aria'],
      exports: 'ngMaterial'
		},
		'angular-material-icons': {
      exports: "ngMdIcons",
      deps: [ "angular" ]
		},
		//'bootstrap-dialog': ['jquery','ui-bootstrap'],
		'cytoscape': {
			exports: "cytoscape",
			deps: [ "jquery" ]
		},
		'cytoscape-cose-bilkent': ['cytoscape'],
		'graphlib' : ['lodash','underscore'],
		'dagre' : ['lodash','graphlib'],
		'cytoscape-dagre': ['cytoscape','dagre','graphlib'],
		'nvd3': ['d3'],
		'angularjs-nvd3-directives':['angular','nvd3','d3'],
		'angular-utils-pagination': ['angular']
	},
	// comment out when use bootstrap.js
	deps : ['app/app.module']
	//deps : ['../bootstrap']

});
