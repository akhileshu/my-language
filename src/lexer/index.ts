import { TOKEN_TEXT } from "./token-text";

// Lexical analysis
export type Token = {
  type: keyof typeof TOKEN_TEXT;
  value?: string | number;
};

export function lex(source: string): Token[] {
  let tokens: Token[] = [];
  let tokenSourceString = "";
  // return tokens
  // 4. Normalize multiple consecutive spaces/tabs/newlines into a single standard space
  // source.trim().replace(/\s+/g, " ");

  // outside string → whitespace is ignored
  // inside string  → whitespace is part of STRING value

  for (let i = 0; i < source.length; i++) {
    // ======= whitespace? =======
    // → skip
    while (source[i] !== undefined && /\s/.test(source[i])) {
      i++;
    }

    // ======= ignore comment line =======
    if (isCommentLine(source, i)) {
      // Loop runs as long as the character is NOT a newline and source has not ended
      while (source[i] !== undefined && source[i] !== "\n") {
        // Your code here (e.g., building a comment string)
        i++;
      }
    }
    // ======= letter / _ ? =======
    // scan an identifier/keyword
    tokenSourceString = "";
    while (source[i] !== undefined && /[A-Za-z_]/.test(source[i])) {
      tokenSourceString += source[i];
      i++;
    }
    if (tokenSourceString) {
      if (TOKEN_TEXT[tokenSourceString.toUpperCase()]) {
        tokens.push({
          type: tokenSourceString.toUpperCase(),
        });
      } else {
        tokens.push({
          type: "IDENTIFIER",
          value: tokenSourceString,
        });
      }
    }

    // ======= digit? =======
    // scan a number
    tokenSourceString = "";
    while (source[i] !== undefined && /[0-9]/.test(source[i])) {
      tokenSourceString += source[i];
      i++;
    }
    if (tokenSourceString) {
      tokens.push({
        type: "NUMBER",
        value: Number(tokenSourceString),
      });
    }

    // ======= quote? =======
    // scan a string

    // if found a string skip quote
    tokenSourceString = "";
    if (source[i] !== undefined && (source[i] === '"' || source[i] === "'")) {
      i++;
      while (
        source[i] !== undefined &&
        !(source[i] === '"' || source[i] === "'")
      ) {
        tokenSourceString += source[i];
        i++;
      }
    }
    if (tokenSourceString) {
      tokens.push({
        type: "STRING",
        value: tokenSourceString,
      });
    }

    // ======= operator source[i] character? =======
    // determine which operator it forms
    let currentChar, lookaheadChar;
    tokenSourceString = "";
    while (isCharacterOperator(source[i]) && !isCommentLine(source, i)) {
      // Find the key where the object value matches targetValue
      currentChar = source[i];
      lookaheadChar = source[i + 1];

      tokenSourceString = currentChar;
      if (isCharacterOperator(lookaheadChar)) {
        tokenSourceString = currentChar + lookaheadChar;
        i++;
      }

      const key = Object.keys(TOKEN_TEXT).find(
        (k) => TOKEN_TEXT[k] === tokenSourceString,
      );

      tokens.push({
        type: key,
      });

      // handle tokens that are squished together without spaces (like foo(, !active, or x+y).
      // avoid accidentally consuming characters that belong to the next token
      if (!isCharacterOperator(lookaheadChar)) {
        break;
      }
      i++;
    }
    //  ======= punctuation? =======
    // emit punctuation token
    // todo - excluding space check , include if needed later
    // dont manually move pointer foward after consuming , coz the loop does that
    if (source[i] !== undefined && /[(){},]/.test(source[i])) {
      const tokenType = Object.keys(TOKEN_TEXT).find(
        (k) => TOKEN_TEXT[k] === source[i],
      );

      tokens.push({
        type: tokenType,
      });
    }

    // anything else?
    // → if none of the above matched
    // lexer error
  }
  tokens.push({
    type: "EOF",
  });
  return tokens;
}

const isCharacterOperator = (char: string | undefined) => {
  return char !== undefined && /[+\-*/%=!<>|&]/.test(char);
};
const isCommentLine = (source: string, i: number) => {
  return source[i] === "/" && source[i + 1] === "/";
};
