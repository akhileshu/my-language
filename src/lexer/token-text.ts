/**
IDENTIFIER, NUMBER, and STRING don't have fixed source text, so null represents "no fixed spelling". The lexer determines their actual value from the source.
 */
export const TOKEN_TEXT = {
  // Keywords
  LET: "let",
  IF: "if",
  ELSE: "else",
  WHILE: "while",
  FN: "fn",
  RETURN: "return",

  // Literals
  IDENTIFIER: null,
  NUMBER: null,
  STRING: null,
  TRUE: "true",
  FALSE: "false",
  NULL: "null",

  // Operators
  PLUS: "+",
  MINUS: "-",
  STAR: "*",
  SLASH: "/",
  PERCENT: "%",
  EQUAL: "=",
  EQUAL_EQUAL: "==",
  BANG: "!",
  BANG_EQUAL: "!=",
  LESS: "<",
  GREATER: ">",
  LESS_EQUAL: "<=",
  GREATER_EQUAL: ">=",
  AND: "&&",
  OR: "||",

  // Punctuation
  LEFT_PAREN: "(",
  RIGHT_PAREN: ")",
  LEFT_BRACE: "{",
  RIGHT_BRACE: "}",
  COMMA: ",",

  // Special
  EOF: null,
} as const;
