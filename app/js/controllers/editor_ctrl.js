'use strict';

app.controller('EditorCtrl', function($scope, DeckData, EditorData) {
	this.deckData = DeckData;
	this.data = EditorData;

	this.onParse = function() {
		this.data.parseText();
	};
});