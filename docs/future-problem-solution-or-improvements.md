
Then later, **the problems you encounter determine the technology you need**.

For example:

```text
Need better parsing
        ↓
Study grammars / parsing algorithms

Need static types
        ↓
Study type systems

Need faster execution
        ↓
Study bytecode / VM

Need memory management
        ↓
Study GC / runtime memory

Need editor integration
        ↓
Study LSP

Need native execution
        ↓
Maybe study C / LLVM / WASM / assembly
```

So I would make **TypeScript the only implementation language at the beginning**. Don't learn C, Rust, LLVM, assembly, etc. beforehand just because they might eventually become relevant.

The interesting part is reaching the point where you can say:

> "My current representation is causing this problem. What technology/concept would actually solve it?"

That is exactly the engineering loop you're trying to practice.