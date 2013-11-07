var app = angular.module('app', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: '/features/home/home.html'
		});
});