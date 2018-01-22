Operator "comparison operator =, !=, >, >=, <, or <="
  = eq:"="
  / neq1:[\<\>!]"=" { return neq1 + '=' }
  / neq2:[\<\>]

Filter "field name"
  = $ [a-z0-9_.]i+
  
Value "string or number"
  = Number
  / StringValue

Number
  = int:([0-9]+) "." dec:([0-9]+) {
  	return parseFloat([int.join(''), dec.join('') || '0'].join('.'))
  }
  / int:([0-9]+) { return parseInt(int.join('')) }

StringValue
  = '"' chars:DoubleStringCharacter* '"' { return chars.join(''); }
  / "'" chars:SingleStringCharacter* "'" { return chars.join(''); }

DoubleStringCharacter
  = !('"' / "\\") char:. { return char; }
  / "\\" sequence:EscapeSequence { return sequence; }

SingleStringCharacter
  = !("'" / "\\") char:. { return char; }
  / "\\" sequence:EscapeSequence { return sequence; }

EscapeSequence
  = "'"
  / '"'
  / "\\"
  
_ "whitespace"
 = $ [ \t]*
 
LogicalOr
  = left:Equals "||" right:Equals { return { left, right, oper: 'or' } }
  / LogicalAnd
  
LogicalAnd
  = left:Equals "&&" right:Equals { return { left, right, oper: 'and' } }
  / Primary
  
Primary
  = Equals 
  / "(" or:LogicalOr ")" { console.log(or); return or }

Equals
  = _ key:Filter _ oper:Operator _ value:Value _ {
  	return { key, oper, value }
  }
