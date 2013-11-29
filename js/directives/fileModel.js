'use strict';

app.directive('fileModel', function($parse) {
	return {
		restrict: 'A',
		link: function($scope, element, attrs) {
			var modelGet = $parse(attrs.fileModel);
			var modelSet = modelGet.assign;
			var onChange = $parse(attrs.onChange);

			element.bind('change', function(ev) {
				$scope.$apply(function() {
					modelSet($scope, element[0].files[0]);
					onChange($scope);
				});
			});
		}
	};
});