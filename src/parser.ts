import type { Token } from "./lexer";

// Parsing
export function parse(tokens: Token[]): {
  type: "Program";
  body: [];
} {

  let body=[]
  for (let i = 0; i < tokens.length; i++) {
    const element = tokens[i];
    if(tokens[i]?.type=="LET"){
      // Array(5)[
      //   ({ type: "LET" },
      //   { type: "IDENTIFIER", value: "age" },
      //   { type: "EQUAL" },
      //   { type: "NUMBER", value: 23 },
      //   { type: "EOF" })
      // ];
    }
    
  }

  return {
    type: "Program",
    body,
  };
}
