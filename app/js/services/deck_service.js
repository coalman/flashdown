'use strict';

app.factory('DeckService', function() {
	return {
		deck: {
			name: "Name",
			description: "Description",
			cards: [
				{
					front: "front",
					back: "back"
				}
			]
		}
	};
});