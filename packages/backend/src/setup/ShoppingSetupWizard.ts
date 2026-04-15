import cp from "child_process";

import { ShoppingGlobal } from "../ShoppingGlobal";
import { ShoppingAdministratorSeeder } from "./seeders/ShoppingAdministratorSeeder";
import { ShoppingChannelSeeder } from "./seeders/ShoppingChannelSeeder";
import { ShoppingCouponSeeder } from "./seeders/ShoppingCouponSeeder";
import { ShoppingCustomerSeeder } from "./seeders/ShoppingCustomerSeeder";
import { ShoppingDeliverySeeder } from "./seeders/ShoppingDeliverySeeder";
import { ShoppingDepositSeeder } from "./seeders/ShoppingDepositSeeder";
import { ShoppingMileageSeeder } from "./seeders/ShoppingMileageSeeder";
import { ShoppingOrderSeeder } from "./seeders/ShoppingOrderSeeder";
import { ShoppingReviewSeeder } from "./seeders/ShoppingReviewSeeder";
import { ShoppingSaleSeeder } from "./seeders/ShoppingSaleSeeder";
import { ShoppingSectionSeeder } from "./seeders/ShoppingSectionSeeder";

export namespace ShoppingSetupWizard {
  export async function schema(): Promise<void> {
    if (ShoppingGlobal.testing === false)
      throw new Error(
        "Erron on SetupWizard.schema(): unable to reset database in non-test mode.",
      );
    cp.execSync("npx prisma db push --force-reset --schema=prisma/schema", {
      stdio: "inherit",
    });
  }

  export async function seed(): Promise<void> {
    await ShoppingChannelSeeder.seed();
    await ShoppingSectionSeeder.seed();
    await ShoppingAdministratorSeeder.seed();
    await ShoppingDepositSeeder.seed();
    await ShoppingMileageSeeder.seed();
    await ShoppingCustomerSeeder.seed();
    await ShoppingSaleSeeder.seed();
    await ShoppingCouponSeeder.seed();
    await ShoppingOrderSeeder.seed();
    await ShoppingDeliverySeeder.seed();
    await ShoppingReviewSeeder.seed();
  }
}
