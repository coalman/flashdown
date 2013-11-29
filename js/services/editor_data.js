'use strict';

app.service('EditorData', function(DeckData) {
	this.rawText = '* front\n- back';

	this.parseText = function() {
		DeckData.parse(this.rawText);
	};
});