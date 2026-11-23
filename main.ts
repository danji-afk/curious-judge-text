import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Final candidate: observatory porter entry.
const TEXT =
  "The night porter at the observatory keeps a page for every star he cannot name. Forty years of pages. Tonight he wrote a second line, and then folded it away.";

const MAX_CHARS = 280;
const ENTRY_FILE = "entry.txt";

function outDir(): string {
  return process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
}

function main(): void {
  // Validate exactly what lands on disk: the body plus its single trailing newline.
  const payload = `${TEXT}\n`;
  const totalChars = [...payload].length;

  if (TEXT.trim().length === 0) {
    throw new Error("entry text must not be empty or only white space");
  }
  if (TEXT.includes("\n")) {
    throw new Error("entry text must be a single line; one newline is appended on write");
  }
  if (totalChars > MAX_CHARS) {
    throw new Error(`entry text must be at most ${MAX_CHARS} characters including the newline, got ${totalChars}`);
  }

  const dir = outDir();
  mkdirSync(dir, { recursive: true });
  const file = join(dir, ENTRY_FILE);
  writeFileSync(file, payload, "utf8");

  // Guard against the gate seeing something other than what we validated.
  const written = readFileSync(file, "utf8");
  if (written !== payload) {
    throw new Error(`${ENTRY_FILE} on disk does not match the validated text`);
  }
  console.log(`wrote ${ENTRY_FILE} (${totalChars} chars including newline)`);
}

main();
