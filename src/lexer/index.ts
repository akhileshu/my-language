import { TOKEN_TEXT } from "./token-text";

// Lexical analysis
export type Token = {
  type: keyof typeof TOKEN_TEXT;
  value?: string | number;
};

export function lex(source: string): Token[] {
  let tokens: Token[] = [];
  let collectSourceSubstring = "";
  let i = 0;

  while (i < source.length) {
    collectSourceSubstring = "";
    switch (true) {
      case isWhitespace(source[i]):
        while (isWhitespace(source[i])) {
          i++;
        }
        break;

      case isCommentLine(source, i):
        // ======= ignore comment lines =======
        while (isCommentLine(source, i)) {
          // Loop runs as long as the character is NOT a newline and source has not ended
          while (source[i] !== undefined && source[i] !== "\n") {
            // Your code here (e.g., building a comment string)
            i++;
          }
        }
        break;

      case isLetterOrUnderscore(source[i]):
        // ======= letter / _ ? =======
        // scan an identifier/keyword
        while (isLetterOrUnderscore(source[i]) || isDigit(source[i])) {
          collectSourceSubstring += source[i++];
        }
        if (collectSourceSubstring) {
          if (TOKEN_TEXT[collectSourceSubstring.toUpperCase()]) {
            tokens.push({
              type: collectSourceSubstring.toUpperCase(),
            });
          } else {
            tokens.push({
              type: "IDENTIFIER",
              value: collectSourceSubstring,
            });
          }
        }
        break;

      case isDigit(source[i]):
        // ======= digit? =======
        // scan a number
        while (isDigit(source[i])) {
          collectSourceSubstring += source[i++];
        }
        if (collectSourceSubstring) {
          tokens.push({
            type: "NUMBER",
            value: Number(collectSourceSubstring),
          });
        }
        break;

      case isQuote(source[i]):
        // ======= quote? =======
        // scan a string
        const startQuote = source[i];
        i++; // skip start quote
        while (source[i] !== undefined && source[i] !== startQuote) {
          collectSourceSubstring += source[i++];
        }
        if (source[i] === undefined) {
          throw new SyntaxError(`string ending quote missing at position ${i}`);
        }
        // const endQuote = source[i];
        // if (startQuote !== endQuote) {
        //   throw new SyntaxError(`string mismatched quotes at position ${i}`);
        // }
        i++; // skip end quote
        tokens.push({
          type: "STRING",
          value: collectSourceSubstring,
        });
        break;

      case isCharacterOperator(source[i]):
        // ======= operator source[i] character? =======
        // determine which operator it forms
        if (isCharacterOperator(source[i]) && !isCommentLine(source, i)) {
          const twoChar = source[i] + (source[i + 1] ?? "");
          // Find the key where the object value matches targetValue
          const twoCharKey = Object.keys(TOKEN_TEXT).find(
            (k) => TOKEN_TEXT[k] === twoChar,
          );

          if (twoCharKey) {
            tokens.push({
              type: twoCharKey,
            });
            i += 2;
          } else {
            tokens.push({
              type: Object.keys(TOKEN_TEXT).find(
                (k) => TOKEN_TEXT[k] === source[i],
              ),
            });
            i++;
          }
        }
        break;

      case isPunctuation(source[i]):
        // todo - excluding space check , include if needed later
        if (isPunctuation(source[i])) {
          collectSourceSubstring += source[i++];
          const tokenType = Object.keys(TOKEN_TEXT).find(
            (k) => TOKEN_TEXT[k] === collectSourceSubstring,
          );

          tokens.push({
            type: tokenType,
          });
        }
        break;

      default:
        throw new SyntaxError(
          `Unexpected character '${source[i]}' at position ${i}`,
        );
    }
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

function isQuote(char: string | undefined): boolean {
  return char !== undefined && (char === '"' || char === "'");
}

const isLetterOrUnderscore = (char: string | undefined): boolean => {
  return char !== undefined && /[A-Za-z_]/.test(char);
};

const isDigit = (char: string | undefined): boolean => {
  return char !== undefined && /[0-9]/.test(char);
};

const isPunctuation = (char: string | undefined): boolean => {
  return char !== undefined && /[(){},]/.test(char);
};

const isWhitespace = (char: string | undefined): boolean => {
  return char !== undefined && /\s/.test(char);
};

// const skipWhitespace = (source: string, i: number): number => {
//   while (isWhitespace(source[i])) {
//     i++;
//   }
//   return i;
// };

// if (
//   source[i] !== undefined &&
//   !isWhitespace(source[i]) &&
//   !isCommentLine(source, i) &&
//   !isLetterOrUnderscore(source[i]) &&
//   !isDigit(source[i]) &&
//   !isQuote(source[i]) &&
//   !isCharacterOperator(source[i]) &&
//   !isPunctuation(source[i])
// ) {
//   throw new SyntaxError(
//     `Unexpected character '${source[i]}' at position ${i}`,
//   );
// }
