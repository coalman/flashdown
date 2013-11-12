'use strict';

app.controller('CardController', function($scope, deck) {
	$scope.index = 0;
	$scope.front = true;
	$scope.deck = deck;
	$scope.presenter = {
		content: $scope.deck.cards[0].front,
		next: function() {
			$scope.index += 1;
			if ($scope.index >= $scope.deck.cards.length) {
				$scope.index = 0;
			}
			this.content = $scope.deck.cards[$scope.index].front;
			$scope.front = true;
		},
		back: function() {
			$scope.index -= 1;
			if ($scope.index < 0) {
				$scope.index = $scope.deck.cards.length - 1;
			}
			this.content = $scope.deck.cards[$scope.index].front;
			$scope.front = true;
		},
		flip: function() {
			$scope.front = !($scope.front);
			this.content = ($scope.front ? $scope.deck.cards[$scope.index].front :
				$scope.deck.cards[$scope.index].back);
		}
	};
});