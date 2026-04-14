import ShoppingApi from "@samchon/shopping-api";
import { IShoppingCartCommodity, IShoppingSale } from "@samchon/shopping-api";

import { ConnectionPool } from "../../../../../ConnectionPool";
import { prepare_random_cart_commodity } from "./prepare_random_cart_commodity";

export const generate_random_cart_commodity = async (
  pool: ConnectionPool,
  sale: IShoppingSale,
  input: Partial<IShoppingCartCommodity.ICreate> = {},
): Promise<IShoppingCartCommodity> => {
  const item: IShoppingCartCommodity =
    await ShoppingApi.functional.shoppings.customers.carts.commodities.create(
      pool.customer,
      prepare_random_cart_commodity(sale, input),
    );
  return item;
};
