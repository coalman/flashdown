'use strict';

app.controller('CardController', function($scope, DeckService, DeckParser) {
	$scope.deckService = DeckService;
	$scope.rawText = '';
	$scope.presenter = {
		index: 0,
		front: true,
		content: null,
		next: function(deck) {
			this.index += 1;
			if (this.index >= deck.cards.length) {
				this.index = 0;
			}
			this.content = deck.cards[this.index].front;
			this.front = true;
		},
		back: function(deck) {
			this.index -= 1;
			if (this.index < 0) {
				this.index = deck.cards.length - 1;
			}
			this.content = deck.cards[this.index].front;
			this.front = true;
		},
		flip: function(deck) {
			this.front = !(this.front);
			this.content = (this.front ?
				deck.cards[this.index].front :
				deck.cards[this.index].back);
		},
		reset: function(deck) {
			this.index = 0;
			this.front = true;
			this.content = deck.cards[this.index].front;
		}
	};
	$scope.presenter.reset($scope.deckService.deck);
	$scope.$watch('deckService.deck', function(newValue, oldValue) {
		$scope.presenter.reset($scope.deckService.deck);
	});

	$scope.editing = false;
	$scope.edit = function() {
		$scope.editing = !($scope.editing);
	};
	$scope.parse = function(rawText, deckService) {
		deckService.deck = DeckParser.parse(rawText);
	};
});