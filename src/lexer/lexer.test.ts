// lexer.test.ts

import { describe, expect, it } from "bun:test";
import { join } from "node:path";
import { lex } from ".";

const SCRIPT_ML = join(import.meta.dir, "../../examples/script/script.ml");
const SCRIPT_ML_LEXER_JSON = join(
  import.meta.dir,
  "../../examples/script/script.ml.lexer.json",
);

describe("Lexer", () => {
  // ============================================================
  // 1. Basic single tokens
  // ============================================================

  describe("1. Single tokens", () => {
    // bun test src/lexer/lexer.test.ts -t "lexes a keyword"
    it("lexes a keyword", () => {
      expect(lex("let")).toEqual([{ type: "LET" }, { type: "EOF" }]);
    });

    it("lexes an identifier", () => {
      expect(lex("name")).toEqual([
        { type: "IDENTIFIER", value: "name" },
        { type: "EOF" },
      ]);
    });

    it("lexes a number", () => {
      expect(lex("123")).toEqual([
        { type: "NUMBER", value: 123 },
        { type: "EOF" },
      ]);
    });

    it("lexes a string", () => {
      expect(lex('"hello"')).toEqual([
        { type: "STRING", value: "hello" },
        { type: "EOF" },
      ]);
    });
  });

  // ============================================================
  // 2. Keywords
  // ============================================================

  describe("2. Keywords", () => {
    it("lexes all v1 keywords", () => {
      expect(lex("let if else while fn return true false null")).toEqual([
        { type: "LET" },
        { type: "IF" },
        { type: "ELSE" },
        { type: "WHILE" },
        { type: "FN" },
        { type: "RETURN" },
        { type: "TRUE" },
        { type: "FALSE" },
        { type: "NULL" },
        { type: "EOF" },
      ]);
    });
  });

  // ============================================================
  // 3. Operators
  // ============================================================

  describe("3. Operators", () => {
    it("lexes single-character operators", () => {
      expect(lex("+ - * / % = ! < >")).toEqual([
        { type: "PLUS" },
        { type: "MINUS" },
        { type: "STAR" },
        { type: "SLASH" },
        { type: "PERCENT" },
        { type: "EQUAL" },
        { type: "BANG" },
        { type: "LESS" },
        { type: "GREATER" },
        { type: "EOF" },
      ]);
    });

    it("lexes multi-character operators", () => {
      expect(lex("== != <= >= && ||")).toEqual([
        { type: "EQUAL_EQUAL" },
        { type: "BANG_EQUAL" },
        { type: "LESS_EQUAL" },
        { type: "GREATER_EQUAL" },
        { type: "AND" },
        { type: "OR" },
        { type: "EOF" },
      ]);
    });
  });

  // ============================================================
  // 4. Punctuation
  // ============================================================

  describe("4. Punctuation", () => {
    it("lexes punctuation", () => {
      expect(lex("( ) { } ,")).toEqual([
        { type: "LEFT_PAREN" },
        { type: "RIGHT_PAREN" },
        { type: "LEFT_BRACE" },
        { type: "RIGHT_BRACE" },
        { type: "COMMA" },
        { type: "EOF" },
      ]);
    });
  });

  // ============================================================
  // 5. Whitespace
  // ============================================================

  describe("5. Whitespace", () => {
    it("ignores spaces, tabs and newlines", () => {
      expect(
        lex(`
          let
          name
          =
          "world"
        `),
      ).toEqual([
        { type: "LET" },
        { type: "IDENTIFIER", value: "name" },
        { type: "EQUAL" },
        { type: "STRING", value: "world" },
        { type: "EOF" },
      ]);
    });

    it("does not emit EOL tokens", () => {
      expect(
        lex(`
          let x = 10
          let y = 20
        `),
      ).toEqual([
        { type: "LET" },
        { type: "IDENTIFIER", value: "x" },
        { type: "EQUAL" },
        { type: "NUMBER", value: 10 },

        { type: "LET" },
        { type: "IDENTIFIER", value: "y" },
        { type: "EQUAL" },
        { type: "NUMBER", value: 20 },

        { type: "EOF" },
      ]);
    });
  });

  // ============================================================
  // 6. Comments
  // ============================================================

  describe("6. Comments", () => {
    it("ignores comments", () => {
      expect(
        lex(`
          // this is a comment
          let x = 10
          // another comment
          print(x)
        `),
      ).toEqual([
        { type: "LET" },
        { type: "IDENTIFIER", value: "x" },
        { type: "EQUAL" },
        { type: "NUMBER", value: 10 },

        { type: "IDENTIFIER", value: "print" },
        { type: "LEFT_PAREN" },
        { type: "IDENTIFIER", value: "x" },
        { type: "RIGHT_PAREN" },

        { type: "EOF" },
      ]);
    });
  });

  // ============================================================
  // 7. Basic statements
  // ============================================================

  describe("7. Basic statements", () => {
    it("lexes a variable declaration", () => {
      expect(lex('let name = "world"')).toEqual([
        { type: "LET" },
        { type: "IDENTIFIER", value: "name" },
        { type: "EQUAL" },
        { type: "STRING", value: "world" },
        { type: "EOF" },
      ]);
    });

    it("lexes boolean and null literals in declarations", () => {
      expect(lex("let active = true")).toEqual([
        { type: "LET" },
        { type: "IDENTIFIER", value: "active" },
        { type: "EQUAL" },
        { type: "TRUE" },
        { type: "EOF" },
      ]);

      expect(lex("let nothing = null")).toEqual([
        { type: "LET" },
        { type: "IDENTIFIER", value: "nothing" },
        { type: "EQUAL" },
        { type: "NULL" },
        { type: "EOF" },
      ]);
    });

    it("lexes reassignment", () => {
      expect(lex("x = x + 5")).toEqual([
        { type: "IDENTIFIER", value: "x" },
        { type: "EQUAL" },
        { type: "IDENTIFIER", value: "x" },
        { type: "PLUS" },
        { type: "NUMBER", value: 5 },
        { type: "EOF" },
      ]);
    });
  });

  // ============================================================
  // 8. Expressions
  // ============================================================

  describe("8. Expressions", () => {
    it("lexes arithmetic", () => {
      expect(lex("a + b * 10 - 5 / 2")).toEqual([
        { type: "IDENTIFIER", value: "a" },
        { type: "PLUS" },
        { type: "IDENTIFIER", value: "b" },
        { type: "STAR" },
        { type: "NUMBER", value: 10 },
        { type: "MINUS" },
        { type: "NUMBER", value: 5 },
        { type: "SLASH" },
        { type: "NUMBER", value: 2 },
        { type: "EOF" },
      ]);
    });

    it("lexes modulo and equality", () => {
      expect(lex("a % b")).toEqual([
        { type: "IDENTIFIER", value: "a" },
        { type: "PERCENT" },
        { type: "IDENTIFIER", value: "b" },
        { type: "EOF" },
      ]);

      expect(lex("a == b")).toEqual([
        { type: "IDENTIFIER", value: "a" },
        { type: "EQUAL_EQUAL" },
        { type: "IDENTIFIER", value: "b" },
        { type: "EOF" },
      ]);
    });

    it("lexes comparisons and boolean operators", () => {
      expect(lex("a >= 10 && b != 20 || !active")).toEqual([
        { type: "IDENTIFIER", value: "a" },
        { type: "GREATER_EQUAL" },
        { type: "NUMBER", value: 10 },
        { type: "AND" },
        { type: "IDENTIFIER", value: "b" },
        { type: "BANG_EQUAL" },
        { type: "NUMBER", value: 20 },
        { type: "OR" },
        { type: "BANG" },
        { type: "IDENTIFIER", value: "active" },
        { type: "EOF" },
      ]);
    });
  });

  // ============================================================
  // 9. Function calls
  // ============================================================

  describe("9. Function calls", () => {
    it("lexes a function call", () => {
      expect(lex("add(10, 20)")).toEqual([
        { type: "IDENTIFIER", value: "add" },
        { type: "LEFT_PAREN" },
        { type: "NUMBER", value: 10 },
        { type: "COMMA" },
        { type: "NUMBER", value: 20 },
        { type: "RIGHT_PAREN" },
        { type: "EOF" },
      ]);
    });

    it("lexes a function declaration", () => {
      expect(
        lex(`
          fn add(a, b) {
            return a + b
          }
        `),
      ).toEqual([
        { type: "FN" },
        { type: "IDENTIFIER", value: "add" },
        { type: "LEFT_PAREN" },
        { type: "IDENTIFIER", value: "a" },
        { type: "COMMA" },
        { type: "IDENTIFIER", value: "b" },
        { type: "RIGHT_PAREN" },
        { type: "LEFT_BRACE" },

        { type: "RETURN" },
        { type: "IDENTIFIER", value: "a" },
        { type: "PLUS" },
        { type: "IDENTIFIER", value: "b" },

        { type: "RIGHT_BRACE" },

        { type: "EOF" },
      ]);
    });
  });

  // ============================================================
  // 10. Control flow
  // ============================================================

  describe("10. Control flow", () => {
    it("lexes if / else", () => {
      expect(
        lex(`
          if (x > 20) {
            print("large")
          } else {
            print("small")
          }
        `),
      ).toEqual([
        { type: "IF" },
        { type: "LEFT_PAREN" },
        { type: "IDENTIFIER", value: "x" },
        { type: "GREATER" },
        { type: "NUMBER", value: 20 },
        { type: "RIGHT_PAREN" },
        { type: "LEFT_BRACE" },

        { type: "IDENTIFIER", value: "print" },
        { type: "LEFT_PAREN" },
        { type: "STRING", value: "large" },
        { type: "RIGHT_PAREN" },

        { type: "RIGHT_BRACE" },
        { type: "ELSE" },
        { type: "LEFT_BRACE" },

        { type: "IDENTIFIER", value: "print" },
        { type: "LEFT_PAREN" },
        { type: "STRING", value: "small" },
        { type: "RIGHT_PAREN" },

        { type: "RIGHT_BRACE" },

        { type: "EOF" },
      ]);
    });

    it("lexes while", () => {
      expect(
        lex(`
          while (i < 5) {
            print(i)
            i = i + 1
          }
        `),
      ).toEqual([
        { type: "WHILE" },
        { type: "LEFT_PAREN" },
        { type: "IDENTIFIER", value: "i" },
        { type: "LESS" },
        { type: "NUMBER", value: 5 },
        { type: "RIGHT_PAREN" },
        { type: "LEFT_BRACE" },

        { type: "IDENTIFIER", value: "print" },
        { type: "LEFT_PAREN" },
        { type: "IDENTIFIER", value: "i" },
        { type: "RIGHT_PAREN" },

        { type: "IDENTIFIER", value: "i" },
        { type: "EQUAL" },
        { type: "IDENTIFIER", value: "i" },
        { type: "PLUS" },
        { type: "NUMBER", value: 1 },

        { type: "RIGHT_BRACE" },

        { type: "EOF" },
      ]);
    });
  });

  // ============================================================
  // 11. Recursion
  // ============================================================

  describe("11. Recursion", () => {
    it("lexes recursive function", () => {
      expect(
        lex(`
          fn factorial(n) {
            if (n <= 1) {
              return 1
            }

            return n * factorial(n - 1)
          }

          print(factorial(5))
        `),
      ).toEqual([
        { type: "FN" },
        { type: "IDENTIFIER", value: "factorial" },
        { type: "LEFT_PAREN" },
        { type: "IDENTIFIER", value: "n" },
        { type: "RIGHT_PAREN" },
        { type: "LEFT_BRACE" },

        { type: "IF" },
        { type: "LEFT_PAREN" },
        { type: "IDENTIFIER", value: "n" },
        { type: "LESS_EQUAL" },
        { type: "NUMBER", value: 1 },
        { type: "RIGHT_PAREN" },
        { type: "LEFT_BRACE" },

        { type: "RETURN" },
        { type: "NUMBER", value: 1 },

        { type: "RIGHT_BRACE" },

        { type: "RETURN" },
        { type: "IDENTIFIER", value: "n" },
        { type: "STAR" },
        { type: "IDENTIFIER", value: "factorial" },
        { type: "LEFT_PAREN" },
        { type: "IDENTIFIER", value: "n" },
        { type: "MINUS" },
        { type: "NUMBER", value: 1 },
        { type: "RIGHT_PAREN" },

        { type: "RIGHT_BRACE" },

        { type: "IDENTIFIER", value: "print" },
        { type: "LEFT_PAREN" },
        { type: "IDENTIFIER", value: "factorial" },
        { type: "LEFT_PAREN" },
        { type: "NUMBER", value: 5 },
        { type: "RIGHT_PAREN" },
        { type: "RIGHT_PAREN" },

        { type: "EOF" },
      ]);
    });
  });

  // ============================================================
  // 12. Combined example (greet)
  // ============================================================

  describe("12. Combined example (greet)", () => {
    it("lexes string concatenation with a spaced string literal", () => {
      expect(lex('print("Hello " + name)')).toEqual([
        { type: "IDENTIFIER", value: "print" },
        { type: "LEFT_PAREN" },
        { type: "STRING", value: "Hello " },
        { type: "PLUS" },
        { type: "IDENTIFIER", value: "name" },
        { type: "RIGHT_PAREN" },
        { type: "EOF" },
      ]);
    });

    it("lexes a bare function call statement", () => {
      expect(lex('greet("world", 3)')).toEqual([
        { type: "IDENTIFIER", value: "greet" },
        { type: "LEFT_PAREN" },
        { type: "STRING", value: "world" },
        { type: "COMMA" },
        { type: "NUMBER", value: 3 },
        { type: "RIGHT_PAREN" },
        { type: "EOF" },
      ]);
    });
  });

  // ============================================================
  // 13. Full script.ml
  // ============================================================

  describe("13. Full script.ml", () => {
    it("lexes examples/script/script.ml", async () => {
      const source = await Bun.file(SCRIPT_ML).text();
      const expected = await Bun.file(SCRIPT_ML_LEXER_JSON).json();

      expect(lex(source)).toEqual(expected);
    });
  });
});
