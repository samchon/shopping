import { ShoppingGlobal } from "../ShoppingGlobal";
import { ShoppingSetupWizard } from "../setup/ShoppingSetupWizard";

async function main(): Promise<void> {
  console.log("------------------------------------------");
  console.log("CREATE TABLES");
  console.log("------------------------------------------");
  ShoppingGlobal.testing = true;
  await ShoppingSetupWizard.schema();

  console.log("------------------------------------------");
  console.log("INITIAL DATA");
  console.log("------------------------------------------");
  await ShoppingSetupWizard.seed();
}
main().catch((exp) => {
  console.log(exp);
  process.exit(-1);
});
