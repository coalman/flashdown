start
	= cards:card* 
	{
		return { 
			"name": "todo", 
			"description": "todo", 
			"cards": cards
		};
	}

card
	= q:question answers:answer*
	{ return { "front": q, "back": answers.join('\n\n') }; }

question
	= whitespace* '+' q:text { return q; }

answer
	= whitespace* '-' a:text { return a; }

text
	= f:firstline t:(line*) { return f + t.join(''); }

firstline
	= c:[^\r\n]* newline? { return c.join(''); }

line
	= space* l:[^+-] c:[^\r\n]* newline? { return l + c.join(''); }

whitespace
	= space
	/ newline

newline
	= [\n\r]

space
	= [ \t]