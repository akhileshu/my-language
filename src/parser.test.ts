// Parsing
// parser.test.ts

import { describe, expect, it } from "bun:test";
import { join } from "node:path";
import { lex } from "./lexer";
import { parse } from "./parser";

const SCRIPT_ML = join(import.meta.dir, "../examples/script/script.ml");

describe("Parser", () => {
  // ============================================================
  // 1. Empty program
  // ============================================================

  describe("1. Program", () => {
    it("parses an empty program", () => {
      expect(parse(lex(""))).toEqual({
        type: "Program",
        body: [],
      });
    });
  });

  // ============================================================
  // 2. Variable declarations
  // ============================================================

  describe("2. Variable declarations", () => {
    it("parses a number declaration", () => {
      expect(parse(lex("let age = 23"))).toEqual({
        type: "Program",
        body: [
          {
            type: "VariableDeclaration",
            name: "age",
            initializer: {
              type: "NumberLiteral",
              value: 23,
            },
          },
        ],
      });
    });

    it("parses a string declaration", () => {
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

    it("parses a boolean declaration", () => {
      expect(parse(lex("let active = true"))).toEqual({
        type: "Program",
        body: [
          {
            type: "VariableDeclaration",
            name: "active",
            initializer: {
              type: "BooleanLiteral",
              value: true,
            },
          },
        ],
      });
    });

    it("parses a null declaration", () => {
      expect(parse(lex("let nothing = null"))).toEqual({
        type: "Program",
        body: [
          {
            type: "VariableDeclaration",
            name: "nothing",
            initializer: {
              type: "NullLiteral",
            },
          },
        ],
      });
    });

    it("parses multiple declarations", () => {
      expect(
        parse(
          lex(`
            let name = "world"
            let age = 23
            let active = true
          `),
        ),
      ).toEqual({
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
          {
            type: "VariableDeclaration",
            name: "age",
            initializer: {
              type: "NumberLiteral",
              value: 23,
            },
          },
          {
            type: "VariableDeclaration",
            name: "active",
            initializer: {
              type: "BooleanLiteral",
              value: true,
            },
          },
        ],
      });
    });
  });

  // ============================================================
  // 3. Expressions inside valid statements
  // ============================================================

  describe("3. Expressions", () => {
    it("parses a binary expression in a variable declaration", () => {
      expect(parse(lex("let x = a + b"))).toEqual({
        type: "Program",
        body: [
          {
            type: "VariableDeclaration",
            name: "x",
            initializer: {
              type: "BinaryExpression",
              operator: "+",
              left: {
                type: "Identifier",
                name: "a",
              },
              right: {
                type: "Identifier",
                name: "b",
              },
            },
          },
        ],
      });
    });

    it("respects arithmetic precedence", () => {
      expect(parse(lex("let x = a + b * 10"))).toEqual({
        type: "Program",
        body: [
          {
            type: "VariableDeclaration",
            name: "x",
            initializer: {
              type: "BinaryExpression",
              operator: "+",
              left: {
                type: "Identifier",
                name: "a",
              },
              right: {
                type: "BinaryExpression",
                operator: "*",
                left: {
                  type: "Identifier",
                  name: "b",
                },
                right: {
                  type: "NumberLiteral",
                  value: 10,
                },
              },
            },
          },
        ],
      });
    });

    it("parses parentheses", () => {
      expect(parse(lex("let x = (a + b) * 10"))).toEqual({
        type: "Program",
        body: [
          {
            type: "VariableDeclaration",
            name: "x",
            initializer: {
              type: "BinaryExpression",
              operator: "*",
              left: {
                type: "BinaryExpression",
                operator: "+",
                left: {
                  type: "Identifier",
                  name: "a",
                },
                right: {
                  type: "Identifier",
                  name: "b",
                },
              },
              right: {
                type: "NumberLiteral",
                value: 10,
              },
            },
          },
        ],
      });
    });

    it("parses less-than comparison", () => {
      expect(parse(lex("let result = a < b"))).toEqual({
        type: "Program",
        body: [
          {
            type: "VariableDeclaration",
            name: "result",
            initializer: {
              type: "BinaryExpression",
              operator: "<",
              left: {
                type: "Identifier",
                name: "a",
              },
              right: {
                type: "Identifier",
                name: "b",
              },
            },
          },
        ],
      });
    });

    it("parses less-than-or-equal comparison", () => {
      expect(parse(lex("let result = a <= b"))).toEqual({
        type: "Program",
        body: [
          {
            type: "VariableDeclaration",
            name: "result",
            initializer: {
              type: "BinaryExpression",
              operator: "<=",
              left: {
                type: "Identifier",
                name: "a",
              },
              right: {
                type: "Identifier",
                name: "b",
              },
            },
          },
        ],
      });
    });

    it("parses comparison", () => {
      expect(parse(lex("let result = a > b"))).toEqual({
        type: "Program",
        body: [
          {
            type: "VariableDeclaration",
            name: "result",
            initializer: {
              type: "BinaryExpression",
              operator: ">",
              left: {
                type: "Identifier",
                name: "a",
              },
              right: {
                type: "Identifier",
                name: "b",
              },
            },
          },
        ],
      });
    });

    it("parses equality", () => {
      expect(parse(lex("let result = a == b"))).toEqual({
        type: "Program",
        body: [
          {
            type: "VariableDeclaration",
            name: "result",
            initializer: {
              type: "BinaryExpression",
              operator: "==",
              left: {
                type: "Identifier",
                name: "a",
              },
              right: {
                type: "Identifier",
                name: "b",
              },
            },
          },
        ],
      });
    });

    it("parses inequality", () => {
      expect(parse(lex("let result = a != b"))).toEqual({
        type: "Program",
        body: [
          {
            type: "VariableDeclaration",
            name: "result",
            initializer: {
              type: "BinaryExpression",
              operator: "!=",
              left: {
                type: "Identifier",
                name: "a",
              },
              right: {
                type: "Identifier",
                name: "b",
              },
            },
          },
        ],
      });
    });

    it("parses modulo", () => {
      expect(parse(lex("let result = a % b"))).toEqual({
        type: "Program",
        body: [
          {
            type: "VariableDeclaration",
            name: "result",
            initializer: {
              type: "BinaryExpression",
              operator: "%",
              left: {
                type: "Identifier",
                name: "a",
              },
              right: {
                type: "Identifier",
                name: "b",
              },
            },
          },
        ],
      });
    });

    it("parses logical and", () => {
      expect(parse(lex("let result = true && false"))).toEqual({
        type: "Program",
        body: [
          {
            type: "VariableDeclaration",
            name: "result",
            initializer: {
              type: "BinaryExpression",
              operator: "&&",
              left: {
                type: "BooleanLiteral",
                value: true,
              },
              right: {
                type: "BooleanLiteral",
                value: false,
              },
            },
          },
        ],
      });
    });

    it("parses logical or", () => {
      expect(parse(lex("let result = true || false"))).toEqual({
        type: "Program",
        body: [
          {
            type: "VariableDeclaration",
            name: "result",
            initializer: {
              type: "BinaryExpression",
              operator: "||",
              left: {
                type: "BooleanLiteral",
                value: true,
              },
              right: {
                type: "BooleanLiteral",
                value: false,
              },
            },
          },
        ],
      });
    });

    it("parses unary expressions", () => {
      expect(parse(lex("let result = !true"))).toEqual({
        type: "Program",
        body: [
          {
            type: "VariableDeclaration",
            name: "result",
            initializer: {
              type: "UnaryExpression",
              operator: "!",
              operand: {
                type: "BooleanLiteral",
                value: true,
              },
            },
          },
        ],
      });
    });
  });

  // ============================================================
  // 4. Function calls
  // ============================================================

  describe("4. Function calls", () => {
    it("parses a function call statement", () => {
      expect(parse(lex("print(name)"))).toEqual({
        type: "Program",
        body: [
          {
            type: "ExpressionStatement",
            expression: {
              type: "CallExpression",
              callee: {
                type: "Identifier",
                name: "print",
              },
              arguments: [
                {
                  type: "Identifier",
                  name: "name",
                },
              ],
            },
          },
        ],
      });
    });

    it("parses multiple arguments", () => {
      expect(parse(lex("add(10, 20)"))).toEqual({
        type: "Program",
        body: [
          {
            type: "ExpressionStatement",
            expression: {
              type: "CallExpression",
              callee: {
                type: "Identifier",
                name: "add",
              },
              arguments: [
                {
                  type: "NumberLiteral",
                  value: 10,
                },
                {
                  type: "NumberLiteral",
                  value: 20,
                },
              ],
            },
          },
        ],
      });
    });

    it("parses a call inside a declaration", () => {
      expect(parse(lex("let result = add(10, 20)"))).toEqual({
        type: "Program",
        body: [
          {
            type: "VariableDeclaration",
            name: "result",
            initializer: {
              type: "CallExpression",
              callee: {
                type: "Identifier",
                name: "add",
              },
              arguments: [
                {
                  type: "NumberLiteral",
                  value: 10,
                },
                {
                  type: "NumberLiteral",
                  value: 20,
                },
              ],
            },
          },
        ],
      });
    });

    it("parses nested calls", () => {
      expect(parse(lex("print(add(10, 20))"))).toEqual({
        type: "Program",
        body: [
          {
            type: "ExpressionStatement",
            expression: {
              type: "CallExpression",
              callee: {
                type: "Identifier",
                name: "print",
              },
              arguments: [
                {
                  type: "CallExpression",
                  callee: {
                    type: "Identifier",
                    name: "add",
                  },
                  arguments: [
                    {
                      type: "NumberLiteral",
                      value: 10,
                    },
                    {
                      type: "NumberLiteral",
                      value: 20,
                    },
                  ],
                },
              ],
            },
          },
        ],
      });
    });
  });

  // ============================================================
  // 5. Assignment
  // ============================================================

  describe("5. Assignment", () => {
    it("parses reassignment", () => {
      expect(parse(lex("x = 10"))).toEqual({
        type: "Program",
        body: [
          {
            type: "AssignmentExpression",
            target: {
              type: "Identifier",
              name: "x",
            },
            value: {
              type: "NumberLiteral",
              value: 10,
            },
          },
        ],
      });
    });

    it("parses assignment with an expression", () => {
      expect(parse(lex("x = x + 5"))).toEqual({
        type: "Program",
        body: [
          {
            type: "AssignmentExpression",
            target: {
              type: "Identifier",
              name: "x",
            },
            value: {
              type: "BinaryExpression",
              operator: "+",
              left: {
                type: "Identifier",
                name: "x",
              },
              right: {
                type: "NumberLiteral",
                value: 5,
              },
            },
          },
        ],
      });
    });

    it("parses chained mutations sequentially", () => {
      expect(
        parse(
          lex(`
            let x = 10
            x = x + 5
            x = x * 2
          `),
        ),
      ).toEqual({
        type: "Program",
        body: [
          {
            type: "VariableDeclaration",
            name: "x",
            initializer: {
              type: "NumberLiteral",
              value: 10,
            },
          },
          {
            type: "AssignmentExpression",
            target: {
              type: "Identifier",
              name: "x",
            },
            value: {
              type: "BinaryExpression",
              operator: "+",
              left: {
                type: "Identifier",
                name: "x",
              },
              right: {
                type: "NumberLiteral",
                value: 5,
              },
            },
          },
          {
            type: "AssignmentExpression",
            target: {
              type: "Identifier",
              name: "x",
            },
            value: {
              type: "BinaryExpression",
              operator: "*",
              left: {
                type: "Identifier",
                name: "x",
              },
              right: {
                type: "NumberLiteral",
                value: 2,
              },
            },
          },
        ],
      });
    });
  });

  // ============================================================
  // 6. If / Else
  // ============================================================

  describe("6. If / else", () => {
    it("parses an if statement", () => {
      expect(
        parse(
          lex(`
            if (x > 20) {
              print("x is large")
            }
          `),
        ),
      ).toEqual({
        type: "Program",
        body: [
          {
            type: "IfStatement",
            condition: {
              type: "BinaryExpression",
              operator: ">",
              left: {
                type: "Identifier",
                name: "x",
              },
              right: {
                type: "NumberLiteral",
                value: 20,
              },
            },
            thenBranch: {
              type: "BlockStatement",
              body: [
                {
                  type: "ExpressionStatement",
                  expression: {
                    type: "CallExpression",
                    callee: {
                      type: "Identifier",
                      name: "print",
                    },
                    arguments: [
                      {
                        type: "StringLiteral",
                        value: "x is large",
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      });
    });

    it("parses if / else", () => {
      expect(
        parse(
          lex(`
            if (x > 20) {
              print("x is large")
            } else {
              print("x is small")
            }
          `),
        ),
      ).toEqual({
        type: "Program",
        body: [
          {
            type: "IfStatement",
            condition: {
              type: "BinaryExpression",
              operator: ">",
              left: {
                type: "Identifier",
                name: "x",
              },
              right: {
                type: "NumberLiteral",
                value: 20,
              },
            },
            thenBranch: {
              type: "BlockStatement",
              body: [
                {
                  type: "ExpressionStatement",
                  expression: {
                    type: "CallExpression",
                    callee: {
                      type: "Identifier",
                      name: "print",
                    },
                    arguments: [
                      {
                        type: "StringLiteral",
                        value: "x is large",
                      },
                    ],
                  },
                },
              ],
            },
            elseBranch: {
              type: "BlockStatement",
              body: [
                {
                  type: "ExpressionStatement",
                  expression: {
                    type: "CallExpression",
                    callee: {
                      type: "Identifier",
                      name: "print",
                    },
                    arguments: [
                      {
                        type: "StringLiteral",
                        value: "x is small",
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      });
    });
  });

  // ============================================================
  // 7. While
  // ============================================================

  describe("7. While", () => {
    it("parses a while loop", () => {
      expect(
        parse(
          lex(`
            while (i < 5) {
              print(i)
            }
          `),
        ),
      ).toEqual({
        type: "Program",
        body: [
          {
            type: "WhileStatement",
            condition: {
              type: "BinaryExpression",
              operator: "<",
              left: {
                type: "Identifier",
                name: "i",
              },
              right: {
                type: "NumberLiteral",
                value: 5,
              },
            },
            body: {
              type: "BlockStatement",
              body: [
                {
                  type: "ExpressionStatement",
                  expression: {
                    type: "CallExpression",
                    callee: {
                      type: "Identifier",
                      name: "print",
                    },
                    arguments: [
                      {
                        type: "Identifier",
                        name: "i",
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      });
    });

    it("parses a loop containing assignment", () => {
      expect(
        parse(
          lex(`
            while (i < 5) {
              print(i)
              i = i + 1
            }
          `),
        ),
      ).toEqual({
        type: "Program",
        body: [
          {
            type: "WhileStatement",
            condition: {
              type: "BinaryExpression",
              operator: "<",
              left: {
                type: "Identifier",
                name: "i",
              },
              right: {
                type: "NumberLiteral",
                value: 5,
              },
            },
            body: {
              type: "BlockStatement",
              body: [
                {
                  type: "ExpressionStatement",
                  expression: {
                    type: "CallExpression",
                    callee: {
                      type: "Identifier",
                      name: "print",
                    },
                    arguments: [
                      {
                        type: "Identifier",
                        name: "i",
                      },
                    ],
                  },
                },
                {
                  type: "AssignmentExpression",
                  target: {
                    type: "Identifier",
                    name: "i",
                  },
                  value: {
                    type: "BinaryExpression",
                    operator: "+",
                    left: {
                      type: "Identifier",
                      name: "i",
                    },
                    right: {
                      type: "NumberLiteral",
                      value: 1,
                    },
                  },
                },
              ],
            },
          },
        ],
      });
    });
  });

  // ============================================================
  // 8. Functions
  // ============================================================

  describe("8. Functions", () => {
    it("parses a function declaration", () => {
      expect(
        parse(
          lex(`
            fn add(a, b) {
              return a + b
            }
          `),
        ),
      ).toEqual({
        type: "Program",
        body: [
          {
            type: "FunctionDeclaration",
            name: "add",
            parameters: [
              {
                type: "Identifier",
                name: "a",
              },
              {
                type: "Identifier",
                name: "b",
              },
            ],
            body: {
              type: "BlockStatement",
              body: [
                {
                  type: "ReturnStatement",
                  argument: {
                    type: "BinaryExpression",
                    operator: "+",
                    left: {
                      type: "Identifier",
                      name: "a",
                    },
                    right: {
                      type: "Identifier",
                      name: "b",
                    },
                  },
                },
              ],
            },
          },
        ],
      });
    });

    it("parses a function declaration and call", () => {
      expect(
        parse(
          lex(`
            fn add(a, b) {
              return a + b
            }

            let result = add(10, 20)
          `),
        ),
      ).toEqual({
        type: "Program",
        body: [
          {
            type: "FunctionDeclaration",
            name: "add",
            parameters: [
              {
                type: "Identifier",
                name: "a",
              },
              {
                type: "Identifier",
                name: "b",
              },
            ],
            body: {
              type: "BlockStatement",
              body: [
                {
                  type: "ReturnStatement",
                  argument: {
                    type: "BinaryExpression",
                    operator: "+",
                    left: {
                      type: "Identifier",
                      name: "a",
                    },
                    right: {
                      type: "Identifier",
                      name: "b",
                    },
                  },
                },
              ],
            },
          },
          {
            type: "VariableDeclaration",
            name: "result",
            initializer: {
              type: "CallExpression",
              callee: {
                type: "Identifier",
                name: "add",
              },
              arguments: [
                {
                  type: "NumberLiteral",
                  value: 10,
                },
                {
                  type: "NumberLiteral",
                  value: 20,
                },
              ],
            },
          },
        ],
      });
    });
  });

  // ============================================================
  // 9. Return
  // ============================================================

  describe("9. Return", () => {
    it("parses a return statement", () => {
      expect(
        parse(
          lex(`
            fn getValue() {
              return 10
            }
          `),
        ),
      ).toEqual({
        type: "Program",
        body: [
          {
            type: "FunctionDeclaration",
            name: "getValue",
            parameters: [],
            body: {
              type: "BlockStatement",
              body: [
                {
                  type: "ReturnStatement",
                  argument: {
                    type: "NumberLiteral",
                    value: 10,
                  },
                },
              ],
            },
          },
        ],
      });
    });
  });

  // ============================================================
  // 10. Recursion
  // ============================================================

  describe("10. Recursion", () => {
    it("parses a recursive function", () => {
      expect(
        parse(
          lex(`
            fn factorial(n) {
              if (n <= 1) {
                return 1
              }

              return n * factorial(n - 1)
            }
          `),
        ),
      ).toEqual({
        type: "Program",
        body: [
          {
            type: "FunctionDeclaration",
            name: "factorial",
            parameters: [
              {
                type: "Identifier",
                name: "n",
              },
            ],
            body: {
              type: "BlockStatement",
              body: [
                {
                  type: "IfStatement",
                  condition: {
                    type: "BinaryExpression",
                    operator: "<=",
                    left: {
                      type: "Identifier",
                      name: "n",
                    },
                    right: {
                      type: "NumberLiteral",
                      value: 1,
                    },
                  },
                  thenBranch: {
                    type: "BlockStatement",
                    body: [
                      {
                        type: "ReturnStatement",
                        argument: {
                          type: "NumberLiteral",
                          value: 1,
                        },
                      },
                    ],
                  },
                },
                {
                  type: "ReturnStatement",
                  argument: {
                    type: "BinaryExpression",
                    operator: "*",
                    left: {
                      type: "Identifier",
                      name: "n",
                    },
                    right: {
                      type: "CallExpression",
                      callee: {
                        type: "Identifier",
                        name: "factorial",
                      },
                      arguments: [
                        {
                          type: "BinaryExpression",
                          operator: "-",
                          left: {
                            type: "Identifier",
                            name: "n",
                          },
                          right: {
                            type: "NumberLiteral",
                            value: 1,
                          },
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
        ],
      });
    });
  });

  // ============================================================
  // 11. Combined language features
  // ============================================================

  describe("11. Combined examples", () => {
    it("parses the greet example", () => {
      expect(
        parse(
          lex(`
            fn greet(name, times) {
              let i = 0

              while (i < times) {
                print("Hello " + name)
                i = i + 1
              }
            }

            greet("world", 3)
          `),
        ),
      ).toEqual({
        type: "Program",
        body: [
          {
            type: "FunctionDeclaration",
            name: "greet",
            parameters: [
              {
                type: "Identifier",
                name: "name",
              },
              {
                type: "Identifier",
                name: "times",
              },
            ],
            body: {
              type: "BlockStatement",
              body: [
                {
                  type: "VariableDeclaration",
                  name: "i",
                  initializer: {
                    type: "NumberLiteral",
                    value: 0,
                  },
                },
                {
                  type: "WhileStatement",
                  condition: {
                    type: "BinaryExpression",
                    operator: "<",
                    left: {
                      type: "Identifier",
                      name: "i",
                    },
                    right: {
                      type: "Identifier",
                      name: "times",
                    },
                  },
                  body: {
                    type: "BlockStatement",
                    body: [
                      {
                        type: "ExpressionStatement",
                        expression: {
                          type: "CallExpression",
                          callee: {
                            type: "Identifier",
                            name: "print",
                          },
                          arguments: [
                            {
                              type: "BinaryExpression",
                              operator: "+",
                              left: {
                                type: "StringLiteral",
                                value: "Hello ",
                              },
                              right: {
                                type: "Identifier",
                                name: "name",
                              },
                            },
                          ],
                        },
                      },
                      {
                        type: "AssignmentExpression",
                        target: {
                          type: "Identifier",
                          name: "i",
                        },
                        value: {
                          type: "BinaryExpression",
                          operator: "+",
                          left: {
                            type: "Identifier",
                            name: "i",
                          },
                          right: {
                            type: "NumberLiteral",
                            value: 1,
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            type: "ExpressionStatement",
            expression: {
              type: "CallExpression",
              callee: {
                type: "Identifier",
                name: "greet",
              },
              arguments: [
                {
                  type: "StringLiteral",
                  value: "world",
                },
                {
                  type: "NumberLiteral",
                  value: 3,
                },
              ],
            },
          },
        ],
      });
    });
  });

  // ============================================================
  // 12. Invalid syntax
  // ============================================================

  describe("12. Invalid syntax", () => {
    it("rejects a bare number as a program", () => {
      expect(() => parse(lex("123"))).toThrow();
    });

    it("rejects a bare identifier as a program", () => {
      expect(() => parse(lex("name"))).toThrow();
    });

    it("rejects a bare binary expression as a program", () => {
      expect(() => parse(lex("a + b"))).toThrow();
    });

    it("rejects an incomplete declaration", () => {
      expect(() => parse(lex("let x"))).toThrow();
    });

    it("rejects a declaration without an initializer", () => {
      expect(() => parse(lex("let x ="))).toThrow();
    });

    it("rejects an incomplete binary expression", () => {
      expect(() => parse(lex("let x = a +"))).toThrow();
    });

    it("rejects an unterminated function call", () => {
      expect(() => parse(lex("print("))).toThrow();
    });

    it("rejects an if statement without a block", () => {
      expect(() => parse(lex("if (x > 10)"))).toThrow();
    });

    it("rejects a function declaration without a body", () => {
      expect(() => parse(lex("fn add(a, b)"))).toThrow();
    });
  });

  // ============================================================
  // 13. Full script.ml
  // ============================================================

  describe("13. Full script.ml", () => {
    it("parses examples/script/script.ml", async () => {
      const source = await Bun.file(SCRIPT_ML).text();
      const ast = parse(lex(source));

      expect(ast).toEqual({
        type: "Program",
        body: expect.any(Array),
      });
      expect(ast.body).toHaveLength(34);
      expect(ast.body[0]).toEqual({
        type: "VariableDeclaration",
        name: "name",
        initializer: {
          type: "StringLiteral",
          value: "world",
        },
      });
      expect(ast.body[ast.body.length - 1]).toEqual({
        type: "ExpressionStatement",
        expression: {
          type: "CallExpression",
          callee: {
            type: "Identifier",
            name: "greet",
          },
          arguments: [
            {
              type: "StringLiteral",
              value: "world",
            },
            {
              type: "NumberLiteral",
              value: 3,
            },
          ],
        },
      });
    });
  });
});