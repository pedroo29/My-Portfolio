/**
 * Escribe un `store.json` mínimo (sin labs/skills/etc.). Útil para reset local; en producción suele bastar con copiar tu `data/`.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { buildBootstrapContentStore } from "../src/lib/content-defaults";

async function main() {
  const runtimeDir = path.join(process.cwd(), "data", "runtime");
  const storePath = path.join(runtimeDir, "store.json");
  await mkdir(runtimeDir, { recursive: true });
  const store = buildBootstrapContentStore();
  await writeFile(storePath, JSON.stringify(store, null, 2), "utf-8");
  console.log("Wrote empty bootstrap store to", storePath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
