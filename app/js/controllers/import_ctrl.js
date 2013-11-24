'use strict';

app.controller('ImportCtrl', function($scope, $modal, EditorData, FileReader) {
	this.onHddClick = function() {
		var modalInstance = $modal.open({
			templateUrl: 'templates/import_dialog.html',
			controller: 'ImportDialogCtrl'
		});

		modalInstance.result.then(function(file) {
			FileReader.readAsText(file, $scope)
				.then(function(result) {
					EditorData.rawText = result;
					EditorData.parseText();
				});
		}, angular.noop);
	};
});

app.controller('ImportDialogCtrl', function($scope, $modalInstance) {
	$scope.file = null;

	$scope.open = function() {
		if ($scope.file !== null) {
			$modalInstance.close($scope.file);
		} else {
			$scope.cancel();
		}
	};

	$scope.onChange = function(file) {
		$scope.file = file;
	}

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
});