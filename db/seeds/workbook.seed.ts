import { upsertWorkbookFromDefinition } from "@/lib/workbook";
import { workbookSeedDefinition } from "./workbook";

async function main() {
  const { program, modules } = await upsertWorkbookFromDefinition(
    workbookSeedDefinition,
  );
  console.log(
    `Workbook seed complete: ${program.name} (${modules.length} modules)`
  );
}

main().catch((error) => {
  console.error("Fatal error while seeding workbook:", error);
  process.exit(1);
});
