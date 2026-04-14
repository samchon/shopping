import cp from "child_process";

import { ShoppingConfiguration } from "../ShoppingConfiguration";
import { ShoppingGlobal } from "../ShoppingGlobal";
import { ShoppingAdministratorSeeder } from "./seeders/ShoppingAdministratorSeeder";
import { ShoppingChannelSeeder } from "./seeders/ShoppingChannelSeeder";
import { ShoppingDepositSeeder } from "./seeders/ShoppingDepositSeeder";
import { ShoppingMileageSeeder } from "./seeders/ShoppingMileageSeeder";
import { ShoppingSaleSeeder } from "./seeders/ShoppingSaleSeeder";
import { ShoppingSectionSeeder } from "./seeders/ShoppingSectionSeeder";

export namespace ShoppingSetupWizard {
  export async function schema(): Promise<void> {
    if (ShoppingGlobal.testing === false)
      throw new Error(
        "Erron on SetupWizard.schema(): unable to reset database in non-test mode.",
      );
    const execute = (type: string) => (argv: string) =>
      cp.execSync(`npx prisma migrate ${type} --schema=prisma/schema ${argv}`, {
        cwd: ShoppingConfiguration.ROOT,
        stdio: ["pipe", process.stdout, process.stderr],
      });
    execute("reset")("--force");
    execute("dev")("--name init");
  }

  export async function seed(): Promise<void> {
    await ShoppingChannelSeeder.seed();
    await ShoppingSectionSeeder.seed();
    await ShoppingAdministratorSeeder.seed();
    await ShoppingDepositSeeder.seed();
    await ShoppingMileageSeeder.seed();
    await ShoppingSaleSeeder.seed();
  }
}
