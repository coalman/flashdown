'use strict';

app.controller('EditorCtrl', function($scope, DeckData, EditorData) {
	this.deckData = DeckData;
	this.data = EditorData;

	this.onToggle = function() {
		this.data.editing = !(this.data.editing);
	};

	this.onParse = function() {
		this.deckData.parse(this.data.rawText);
	};
});