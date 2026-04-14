import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/sdk";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import { Singleton } from "tstl";
import typia from "typia";

import { ShoppingConfiguration } from "./ShoppingConfiguration";

interface IEnvironments {
  SHOPPING_MODE: "local" | "dev" | "real";
  SHOPPING_API_PORT: `${number}`;

  SHOPPING_SYSTEM_PASSWORD: string;
  SHOPPING_JWT_SECRET_KEY: string;
  SHOPPING_JWT_REFRESH_KEY: string;

  SHOPPING_ADDRESS_SECRET_KEY: string;
  SHOPPING_CITIZEN_SECRET_KEY: string;
  SHOPPING_DELIVERY_SHIPPER_SECRET_KEY: string;
  SHOPPING_DEPOSIT_CHARGE_PUBLISH_SECRET_KEY: string;
  SHOPPING_EXTERNAL_USER_SECRET_KEY: string;
  SHOPPING_ORDER_PUBLISH_SECRET_KEY: string;

  SHOPPING_ADDRESS_SECRET_IV: string;
  SHOPPING_CITIZEN_SECRET_IV: string;
  SHOPPING_DELIVERY_SHIPPER_SECRET_IV: string;
  SHOPPING_DEPOSIT_CHARGE_PUBLISH_SECRET_IV: string;
  SHOPPING_EXTERNAL_USER_SECRET_IV: string;
  SHOPPING_ORDER_PUBLISH_SECRET_IV: string;

  OPENAI_API_KEY?: string | undefined;
}
const environments = new Singleton(() => {
  const env = dotenv.config();
  dotenvExpand.expand(env);
  return typia.assert<IEnvironments>(process.env);
});
const prismaSingleton = new Singleton(
  () =>
    new PrismaClient({
      adapter: new PrismaBetterSqlite3({
        url: `${ShoppingConfiguration.ROOT}/prisma/db.sqlite`,
      }),
    }),
);

/**
 * Global variables of the shopping server.
 *
 * @author Samchon
 */
export class ShoppingGlobal {
  public static testing: boolean = false;

  public static get prisma(): PrismaClient {
    return prismaSingleton.get();
  }

  public static get env(): IEnvironments {
    return environments.get();
  }

  /**
   * Current mode.
   *
   *   - local: The server is on your local machine.
   *   - dev: The server is for the developer.
   *   - real: The server is for the real service.
   */
  public static get mode(): "local" | "dev" | "real" {
    return (modeWrapper.value ??= environments.get().SHOPPING_MODE);
  }

  /**
   * Set current mode.
   *
   * @param mode The new mode
   */
  public static setMode(mode: typeof ShoppingGlobal.mode): void {
    typia.assert<typeof mode>(mode);
    modeWrapper.value = mode;
  }
}

interface IMode {
  value?: "local" | "dev" | "real";
}
const modeWrapper: IMode = {};
