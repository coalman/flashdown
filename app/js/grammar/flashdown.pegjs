start
	= bullet*

bullet
	= whitespace* '*' q:text { return { "type": "question", "data": q }; }
	/ whitespace* '-' a:text { return { "type": "answer", "data": a }; }
	/ whitespace* '+' c:text { return { "type": "comment", "data": c }; }

text
	= t:(line*) { return t.join(''); }

line
	= space* l:[^*+-] c:[^\r\n]* newline? { return l + c.join(''); }

whitespace
	= space
	/ newline

newline
	= [\n\r]

space
	= [ \t]