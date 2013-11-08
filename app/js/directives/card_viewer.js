'use strict';

app.directive('cardViewer', function() {
		return {
			restrict: 'E',
			scope: {
				presenter: '='
			},
			templateUrl: 'templates/card_viewer.html',
			link: function(scope, element, attrs) {
				
			}
		};
	});