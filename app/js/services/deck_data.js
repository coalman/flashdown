'use strict';

app.service('DeckData', function($rootScope, DeckParser) {
	this.emptyDeck = function() {
		return {
			name: "Name",
			description: "Description",
			cards: [
				{
					front: "front",
					back: "back"
				}
			]
		};
	};
	this.parse = function(rawStr) {
		this.deckTemplate = DeckParser.parse(rawStr);
		$rootScope.$broadcast('deckParsed');
	};
	this.shuffleDeck = function() {
		// Knuth shuffle
		var array = this.deck.cards;
		var m = array.length, t, i;

		// While there remain elements to shuffle…
		while (m) {
			// Pick a remaining element…
			i = Math.floor(Math.random() * m--);

			// And swap it with the current element.
			t = array[m];
			array[m] = array[i];
			array[i] = t;
		}
	};

	this.deckTemplate = this.emptyDeck();
	this.deck = this.emptyDeck();
});