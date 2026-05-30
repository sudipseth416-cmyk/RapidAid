import { connectDB } from "../config/db.js";
import { seedDatabase } from "./seed-data.js";

async function seed() {
  await connectDB();
  const result = await seedDatabase({ reset: true });

  if (result.seeded) {
    console.log("Seed complete:");
    console.log("  Citizen:", result.accounts.citizen, "/ password123");
    console.log("  Ambulance:", result.accounts.ambulance);
    console.log("  Hospital:", result.accounts.hospital);
  }

  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
