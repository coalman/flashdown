'use strict';

app.service('EditorData', function(DeckData) {
	this.rawText = '';

	this.parseText = function() {
		DeckData.parse(this.rawText);
	};
});