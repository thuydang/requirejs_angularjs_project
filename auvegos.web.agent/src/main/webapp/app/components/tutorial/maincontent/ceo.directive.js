define([
		/* RequireJS modules definition files (w/o .js) */
		'app/app.module',
		'app/components/maincontent/networkInfoServices'
], function (app) {
	'use strict';


	app.register.directive("sizeWatcher", ['$timeout', function ($timeout) {
		/*
		 * Watch width and height of the containing element and inject 
		 * them to scope variables.
		 * # html: 
		 * <div size-watcher size-watcher-height="refHeightPosition"
		 *	size-watcher-width="refWidthPosition"
		 *	style="width: auto;">
		 *
		 * # variables:
		 * <div id="floating-box-large" class="panel panel-default panel-default-item" style="background-color: rgb(250, 180, 0);position: absolute; top: {{refHeightPosition * 0.75}}px; left:{{refWidthPosition*0.60}}px; height:96px; width: auto;">
		 *
		 *
		 * */
		return {
			scope: {
				sizeWatcherHeight: '=',
				sizeWatcherWidth: '=',
			},
			link: function( scope, elem, attrs ){
				function checkSize(){
					scope.sizeWatcherHeight = elem.prop('offsetHeight');
					scope.sizeWatcherWidth = elem.prop('clientWidth');
					console.log(scope.sizeWatcherHeight + " " + scope.sizeWatcherWidth);
					$timeout( checkSize, 1000 );
				}
				checkSize();
			}
		};
	}]) ///-- register.directive

	app.register.directive("sizeGetter", ['$timeout', function ($timeout) {
		return {
			scope: {
				sizeGetterHeight: '=',
				sizeGetterWidth: '=',
			},
			link: function( scope, elem, attrs ){
				function checkSize(){
					scope.sizeGetterHeight = elem.prop('offsetHeight');
					scope.sizeGetterWidth = elem.prop('clientWidth');
					console.log(scope.sizeGetterHeight + " " + scope.sizeGetterWidth);
					//$timeout( checkSize, 1000 );
				}
				checkSize();
			}
		};
	}]) ///-- register.directive



}); /// --
