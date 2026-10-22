import { join } from "node:path";

const root = join(import.meta.dir, "../..");
const inputPath = join(root, "examples/script/script.ml.lexer");
const outputPath = join(root, "examples/script/script.ml.one-flat-stream-lexer");

const input = await Bun.file(inputPath).text();

const flat = input
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean)
  .join(" ");

await Bun.write(outputPath, flat + "\n");
console.log(`Wrote ${outputPath}`);
