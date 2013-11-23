'use strict';

app.controller('ViewerCtrl', function($scope, DeckData, EditorData) {
	this.deckData = DeckData;
	this.editorData = EditorData;
	this.presenter = {
		index: 0,
		front: true,
		content: null,
		frontFirst: true,
		next: function(deck) {
			this.index += 1;
			if (this.index >= deck.cards.length) {
				this.index = 0;
			}
			this.front = this.frontFirst;
			this.setContent(deck);
		},
		back: function(deck) {
			this.index -= 1;
			if (this.index < 0) {
				this.index = deck.cards.length - 1;
			}
			this.front = this.frontFirst;
			this.setContent(deck);
		},
		flip: function(deck) {
			this.front = !(this.front);
			this.setContent(deck);
		},
		setContent : function(deck) {
			this.content = (this.front ?
				deck.cards[this.index].front :
				deck.cards[this.index].back);
		},
		reset: function(deck) {
			this.index = 0;
			this.front = this.frontFirst;
			this.setContent(deck);
		}
	};
	this.presenter.reset(this.deckData.deck);
	$scope.$on('deckParsed', function(_) {
		this.clear();
	}.bind(this));

	this.clear = function() {
		this.deckData.deck = angular.copy(this.deckData.deckTemplate);
		this.presenter.reset(this.deckData.deck);
	};
	this.changeSideMode = function() {
		this.presenter.frontFirst = !(this.presenter.frontFirst);
	};
	this.shuffle = function() {
		this.deckData.shuffleDeck();
		this.presenter.setContent(this.deckData.deck);
	};
});