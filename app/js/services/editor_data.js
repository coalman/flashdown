'use strict';

app.service('EditorData', function(DeckData) {
	this.rawText = '';
	this.editing = false;

	this.parseText = function() {
		DeckData.parse(this.rawText);
	};
});