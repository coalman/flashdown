'use strict';

app.factory('DeckParser', function() {
	function parseSpans(spans, refs) {
		var rawHtml = '';

		spans.forEach(function(span, i, _) {
			if (typeof span === 'string') {
				rawHtml += span;
			} else {
				switch (span.type) {
					case 'br':
						rawHtml += '<br />';
						break;
					case 'em':
					case 'strong':
						rawHtml += '<' + span.type + '>' +
							parseSpans(span.spans, refs) +
							'</' + span.type + '>';
						break;
					case 'a':
						var url = '';
						var titleHtml = '';

						if (!('url' in span) &&
							'ref' in span) {
							var refKey = span.ref.toLowerCase();
							var ref = refs[refKey];

							span.url = ref.url;
							span.title = ref.title;
						}
						url = span.url;
						titleHtml = ' title="' + span.title + '"';

						rawHtml += '<a href="' + url + '"'
							+ titleHtml + '>' +
							parseSpans(span.spans, refs) +
							'</a>';
						break;
					case 'img':
						var src = '';
						var titleHtml = '';

						if (!('url' in span) &&
							'ref' in span) {
							var refKey = span.ref.toLowerCase();
							var ref = refs[refKey];

							span.url = ref.url;
							span.title = ref.title;
						}
						src = span.url;
						var altHtml = ' alt="' + span.spans + '"';
						titleHtml = ' title="' + span.title + '"';

						rawHtml += '<img src="' + src + '"'
							+ altHtml + titleHtml + ' />';
						break;
				}
			}
		});

		return rawHtml;
	}

	function parseParagraphs(paragraphs, refs) {
		var rawHtml = '';

		paragraphs.forEach(function(elem, i, _) {
			rawHtml += '<p>' + parseSpans(elem.spans, refs) + '</p>';
		});

		return rawHtml;
	}

	function parseDeck(rawStr) {
		var data = null;
		try {
			var data = fdownParser.parse(rawStr);
		} catch (e) {
			return e;
		}

		var cardBlocks = [];
		var currentCardBlock = null;
		var references = {};

		data.content.forEach(function(elem, i, _) {
			switch (elem.type) {
				case 'question':
					if (currentCardBlock !== null) {
						cardBlocks.push(currentCardBlock);
					}
					currentCardBlock = [elem];
					break;
				case 'answer':
					if (currentCardBlock === null) {
						currentCardBlock = [];
					}
					currentCardBlock.push(elem);
					break;
				case 'ref':
					elem.id = elem.id.toLowerCase();
					references[elem.id] = elem;
					break;
				case 'comment':
					break;
				default:
					break;
			}
		});
		if (currentCardBlock !== null &&
			currentCardBlock.length > 0) {
			cardBlocks.push(currentCardBlock);
			currentCardBlock = null;
		}

		var cards = [];
		cardBlocks.forEach(function(elem, i, _) {
			var card = {
				front: '',
				back: ''
			};

			if (elem.length <= 0) {
				cards.push(card);
				return;
			}
			var i = 0;
			if (elem[0].type === 'question') {
				i += 1;

				card.front = parseParagraphs(elem[0].paragraphs, references);
			}
			for (; i < elem.length; i++) {
				card.back += parseParagraphs(elem[i].paragraphs, references);
			}
			cards.push(card);
		});
		
		return {
			name: 'Name',
			description: 'Description',
			cards: cards
		};
	}

	return {
		parse: parseDeck 
	};
});