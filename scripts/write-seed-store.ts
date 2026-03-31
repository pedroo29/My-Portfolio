import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { seedContentStore } from "../src/lib/seed-data";

async function main() {
  const runtimeDir = path.join(process.cwd(), "data", "runtime");
  const storePath = path.join(runtimeDir, "store.json");
  await mkdir(runtimeDir, { recursive: true });
  await writeFile(storePath, JSON.stringify(seedContentStore, null, 2), "utf-8");
  console.log("Wrote", storePath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
