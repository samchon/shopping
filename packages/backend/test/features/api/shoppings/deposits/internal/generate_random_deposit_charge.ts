import { randint } from "tstl";

import ShoppingApi from "@samchon/shopping-api";
import { IShoppingDepositCharge } from "@samchon/shopping-api";

import { ConnectionPool } from "../../../../../ConnectionPool";

export const generate_random_deposit_charge = async (
  pool: ConnectionPool,
  input?: Partial<IShoppingDepositCharge.ICreate>,
): Promise<IShoppingDepositCharge> => {
  const charge: IShoppingDepositCharge =
    await ShoppingApi.functional.shoppings.customers.deposits.charges.create(
      pool.customer,
      {
        value: randint(10, 100) * 10_000,
        ...input,
      },
    );
  return charge;
};
