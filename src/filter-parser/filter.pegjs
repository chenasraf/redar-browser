Chain
  = all:Equals+ {
    let filters = {}
    all.forEach(i => filters[i[0]] = { oper: i[1], value: i[2] })
    return filters
  }

Equals
  = _ key:Filter _ operator:Operator _ value:Value _ {
  	return [key, operator, value]
  }

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
  / "b"  { return "\b";   }
  / "f"  { return "\f";   }
  / "n"  { return "\n";   }
  / "r"  { return "\r";   }
  / "t"  { return "\t";   }
  / "v"  { return "\x0B"; }
  
_ "whitespace"
 = $ [ \t]*
