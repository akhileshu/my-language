Architecture-wise, a parser is fundamentally a left-to-right reader that consumes a stream of tokens and builds a structured representation of the program, usually an AST (Abstract Syntax Tree).

Core Architecture Components

• Token Stream: The sequence of tokens produced by the lexer.
• Cursor / Current Token: A pointer tracking which token the parser is currently processing.
• Lookahead: The ability to inspect upcoming tokens without consuming them, so the parser can decide which grammar rule applies.
• AST: The structured representation produced by the parser. It represents the meaning/structure of the source syntax rather than the raw tokens.
• Grammar Rules: The rules that define which token sequences form valid declarations, statements, and expressions.

A classic example of why the parser needs lookahead is distinguishing between different constructs that begin with the same token:

• If the parser sees `IDENTIFIER`, it may be the beginning of an assignment:
    `x = 10`

• It may also be the beginning of a function call:
    `print(10)`

• The parser looks ahead at the next token(s) to determine which grammar rule applies.

For example:

    IDENTIFIER EQUAL NUMBER
              ↓
    AssignmentExpression

while:

    IDENTIFIER LEFT_PAREN NUMBER RIGHT_PAREN
              ↓
    CallExpression


- example signifies parser responsibility, program meaning / runtime correctness is not the parser's scope

```ts
it("parses a variable declaration", () => {
  expect(parse(lex('let name = "world"'))).toEqual({
    type: "Program",
    body: [
      {
        type: "VariableDeclaration",
        name: "name",
        initializer: {
          type: "StringLiteral",
          value: "world",
        },
      },
    ],
  });
});
```

```ts
it("rejects invalid syntax", () => {
  expect(() => parse(lex("let name ="))).toThrow();
});
```

The important distinction is:

```text
Lexer
source characters
      ↓
tokens
      ↓
"what are these pieces?"

Parser
tokens
      ↓
AST
      ↓
"how are these pieces structurally related?"
```

The lexer does not care whether:

```text
LET IDENTIFIER EQUAL
```

forms a complete declaration.

The parser does care, because its grammar requires something after `EQUAL`.

So a clean token stream does **not** mean valid source code:

```text
"let name ="
      ↓
LET IDENTIFIER EQUAL       ← valid lexer output
      ↓
Parser                      ← syntax error
```

Likewise, the parser should not care whether:

```text
let x = 10
```

will actually work at runtime.

For example:

```text
let x = 10
y = x + unknown
```

The parser can produce an AST because the syntax is valid. Whether `unknown` exists is a later concern for the **interpreter / runtime / semantic analysis**, depending on the language architecture.

Most educational material can make this distinction feel more complicated than it is with terms like "context-free grammar," "recursive descent," and "precedence parsing." At the architecture level, the core idea is much simpler:

**The lexer turns characters into tokens. The parser turns tokens into structure.**

---

Yes. Looking at `script.ml`, the language is clearly **statement-oriented**, similar to C/JS. So I would **not** test standalone `123`, `name`, or `a + b` as valid top-level programs.

The parser tests should build complexity from **valid statements**, while invalid syntax should explicitly test parser errors.



### One design decision to keep

For your current MyLang:

```text
123                 ❌ invalid program
name                ❌ invalid program
a + b               ❌ invalid program

let x = 123         ✅
print(123)          ✅
x = x + 1           ✅
if (x > 10) {...}   ✅
while (...) {...}   ✅
fn add(...) {...}   ✅
```

This is the cleaner C/JS-like model for the `script.ml` you have designed: **expressions exist as parts of statements; they aren't automatically valid top-level statements unless you explicitly add expression statements to the language.**

One caveat: the exact AST field names above (`initializer`, `thenBranch`, `argument`, etc.) are assumptions because you haven't provided your `ast.ts` in this turn. The **test cases and validity boundaries** are based on `script.ml`; adjust only the object field names to your actual AST contract.

---


# Statement-Oriented Languages

Programs are sequences of commands (statements) that change the program's state. They separate statements (actions like loops, if branches) from expressions (computations that return values).
• Examples: C, C++, Java, Python, Go, PHP.

# Expression-Oriented (Non Statement-Oriented) Languages

Almost every construct (including loops, if conditionals, and code blocks) evaluates to a value and can be assigned to a variable.
• Examples: Rust, Lisp, Haskell, Ruby, Scala, OCaml.
