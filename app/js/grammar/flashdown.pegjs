{
	// initialization block
	var spanStack = [];

	function tryPushSpanStack(span) {
		console.log('try push: ' + span);
		if (spanStack.indexOf(span) !== -1) {
			console.log('push[no]: ' + span);
			return false;
		}

		console.log('push[yes]: ' + span);
		spanStack.push(span);
		return true;
	}
	function popStack(span) {
		if (spanStack.length > 0 &&
			spanStack[spanStack.length - 1] === span) {
			console.log('pop[yes]: ' + span);
			spanStack.pop();
		} else {
			console.log('pop[no]: ' + span);
		}
	}
	function condenseSpans(spans) {
		if (spans.length <= 0) {
			return spans;
		}
		var condensed = [];
		var textSpan = '';

		for (var i = 0; i < spans.length; i++) {
			if (typeof spans[i] === 'string') {
				textSpan += spans[i];
			} else {
				condensed.push(textSpan);
				textSpan = '';
				condensed.push(spans[i]);
			}
		}
		if (textSpan !== '') {
			condensed.push(textSpan);
		}
		return condensed;
	}
}

start
	= header:headerElem? content:contentElements
		{
			return {
				header: header,
				content: content
			};
		}

headerElem
	= []

contentElements
	= elem:(questionItem / answerItem / commentItem)*
		{ return elem; }

itemStart
	= questionItemStart
	/ answerItemStart
	/ commentItemStart
questionItemStart
	= whitespace "*" s
answerItemStart
	= whitespace "-" s
commentItemStart
	= whitespace "+" s

questionItem
	= questionItemStart space p:paragraphElem*
		{
			return {
				type: 'question',
				paragraphs: p
			};
		}
answerItem
	= answerItemStart space p:paragraphElem*
		{
			return {
				type: 'answer',
				paragraphs: p
			};
		}
commentItem
	= commentItemStart (!(n itemStart) s:. { return s; })*
		{
			return {
				type: 'comment'
			};
		}

paragraphElem
	= !(n itemStart) whitespace spans:paragraphSpan+
		{
			return {
				spans: condenseSpans(spans)
			};
		}

paragraphSpan
	= italicSpan
	/ boldSpan
	/ linkSpan
	/ imgSpan
	/ !paragraphBreak !(n itemStart) 
		s:(lineBreakSpan
		/ s:(hardWrapChar / .) { return s; })
		{ return s; }

italicSpan
	= asteriskSpan
	/ underscoreSpan
asteriskSpan
	= &{ return tryPushSpanStack('em'); }
		"*" !("*" / w) spans:asteriskSpanSpan+ "*"
		&{
			var lastSpan = spans[spans.length - 1];
			if (typeof lastSpan !== 'string') {
				return true;
			}
			return !(/\s/.test(lastSpan[lastSpan.length - 1]));
		}
		{
			popStack('em');
			return {
				type: 'em',
				spans: condenseSpans(spans)
			};
		}
	/ &{ popStack('em'); } FailMatch
asteriskSpanSpan
	= linkSpan
	/ lineBreakSpan
	/ escapedLiteral
	/ hardWrapChar
	/ boldSpan
	/ ![*] s:. { return s; }
underscoreSpan
	= &{ return tryPushSpanStack('em'); }
		"_" !("_" / w) spans:underscoreSpanSpan+ "_"
		{
			popStack('em');
			return {
				type: 'em',
				spans: condenseSpans(spans)
			};
		}
	/ &{ popStack('em'); } FailMatch
underscoreSpanSpan
	= linkSpan
	/ lineBreakSpan
	/ escapedLiteral
	/ hardWrapChar
	/ boldSpan
	/ ![_] s:. { return s; }

boldSpan
	= doubleAsteriskSpan
doubleAsteriskSpan
	= &{ return tryPushSpanStack('strong'); } 
		"**" !("**" / w) spans:doubleAsteriskSpanSpan+ "**"
		&{
			var lastSpan = spans[spans.length - 1];
			if (typeof lastSpan !== 'string') {
				return true;
			}
			return !(/\s/.test(lastSpan[lastSpan.length - 1]));
		}
		{
			popStack('strong');
			return {
				type: 'strong',
				spans: condenseSpans(spans)
			};
		}
	/ &{ popStack('strong'); } FailMatch
doubleAsteriskSpanSpan
	= linkSpan
	/ lineBreakSpan
	/ escapedLiteral
	/ hardWrapChar
	/ italicSpan
	/ ![*] s:. { return s; }

linkSpan
	= inlineLinkSpan
	/ refLinkSpan
	/ autoLinkSpan
inlineLinkSpan
	= &{ return tryPushSpanStack('a'); }
		"[" spans:linkSpanSpan+ "](" 
		url:(u:[^\)\r\n \t]* { return u.join(''); }) 
		title:(s+ t:titleQuoteSpan { return t; })? space ")"
		{
			popStack('a');
			return {
				type: 'a',
				url: url,
				title: title,
				spans: condenseSpans(spans)
			}
		}
	/ &{ popStack('a'); } FailMatch
refLinkSpan
	= &{ return tryPushSpanStack('a'); }
		"[" spans:linkSpanSpan+ "][" 
		ref:(u:[^\r\n\]]* { return u.join(''); }) "]"
		{
			popStack('a');
			return {
				type: 'a',
				ref: ref,
				spans: condenseSpans(spans)
			}
		}
	/ &{ popStack('a'); } FailMatch
autoLinkSpan
	= &{ return tryPushSpanStack('a'); }
		"<" url:(u:[^\r\n>]+ { return u.join(''); }) ">"
		{
			popStack('a');
			return {
				type: 'a',
				url: url,
				title: url,
				spans: url
			};
		}
	/ &{ popStack('a'); } FailMatch
linkSpanSpan
	= italicSpan
	/ boldSpan
	/ lineBreakSpan
	/ escapedLiteral
	/ hardWrapChar
	/ ![\]] s:. { return s; }
titleQuoteSpan
	= "\"" 
		t:(	"\\\"" { return '"'; }
			/ titleSpanNewLineChar
			/ [^"]
			)*
		"\"" { return t.join(''); }
titleSpan
	= titleQuoteSpan
	/ "'"
		t:(	"\\'" { return '\''; }
			/ titleSpanNewLineChar
			/ [^']
			)*
		"'" { return t.join(''); }
	/ "("
		t:(	"\\)" { return ')'; }
			/ titleSpanNewLineChar
			/ [^)]
			)*
		")" { return t.join(''); }
titleSpanNewLineChar
	= (paragraphBreak / " " s+ n / "\t" s* n) { return '\n'; }
	/ hardWrapChar

imgSpan
	= inlineImgSpan
	/ refImgSpan
inlineImgSpan
	= &{ return tryPushSpanStack('img'); }
		"![" spans:imgSpanSpan+ "](" 
		url:(u:[^\)\r\n \t]* { return u.join(''); })
		title:(s+ t:titleQuoteSpan { return t; })? space ")"
		{
			popStack('img');
			return {
				type: 'img',
				url: url,
				title: title,
				spans: spans.join('')
			}
		}
	/ &{ popStack('img'); } FailMatch
refImgSpan
	= &{ return tryPushSpanStack('img'); }
		"![" spans:imgSpanSpan+ "][" 
		ref:(u:[^\r\n\]]* { return u.join(''); }) "]"
		{
			popStack('img');
			return {
				type: 'img',
				ref: ref,
				spans: spans.join('')
			}
		}
	/ &{ popStack('img'); } FailMatch
imgSpanSpan
	= hardWrapChar
	/ ![\]] s:. { return s; }

paragraphBreak
	= space n space n

spacedLiteral
	= " * " { return ' * '; }
	/ " _ " { return ' _ '; }
escapedLiteral
	= "\\*" { return '*'; }
	/ "\\_" { return '_'; }
	/ "\\]" { return '['; }
	/ "\\\\" { return '\\'; }
hardWrapChar
	= n space { return ' '; }
lineBreakSpan
	= (" " s+ n / "\t" s* n) space
		{
			return {
				type: "br"
			};
		}

n
	= [\r\n]
whitespace
	= w*
w
	= s / n
space
	= s*
s
	= [ \t]

/* Won't match anything */
FailMatch
	= []