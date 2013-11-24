'use strict';

app.directive('ace', function() {
	return {
		restrict: 'A',
		require: '?ngModel',
		link: function(scope, element, attrs, ngModel) {
			var aceObj = window.ace.edit(element[0]);
			var session = aceObj.getSession();
			session.setMode("ace/mode/markdown");

			if (ngModel) {
				ngModel.$formatters.push(function(value) {
					if (value == null) {
						return '';
					}
					if (angular.isObject(value) || angular.isArray(value)) {
						throw new Error('ui-ace cannot use an object or an array as a model');
					}
					return value;
				});
				ngModel.$render = function() {
					return session.setValue(ngModel.$viewValue);
				};
			}

			session.on('change', function(e) {
				var newValue;
				newValue = session.getValue();
				if (newValue !== scope.$eval(attrs.value) && !scope.$$phase) {
					if (ngModel) {
						return scope.$apply(function() {
							scope.dirty = true;
							return ngModel.$setViewValue(newValue);
						});
					}
				}
			});
		}
	};
});