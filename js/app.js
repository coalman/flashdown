var app = angular.module('app', [
	'ui.router', 
	'ngSanitize', 
	'ui.bootstrap'
	]);

app.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state('home', {
			url: '/',
			templateUrl: 'templates/home.html'
		});
	$urlRouterProvider.otherwise('/');
});