import ShoppingApi from "@samchon/shopping-api";
import { IShoppingCartCommodity, IShoppingOrder } from "@samchon/shopping-api";

import { ConnectionPool } from "../../../../../ConnectionPool";

export const generate_random_order = async (
  pool: ConnectionPool,
  commodities: IShoppingCartCommodity[],
  volume?: (commodity: IShoppingCartCommodity) => number,
): Promise<IShoppingOrder> => {
  const order: IShoppingOrder =
    await ShoppingApi.functional.shoppings.customers.orders.create(
      pool.customer,
      {
        goods: commodities.map((commodity) => ({
          commodity_id: commodity.id,
          volume: (volume ?? ((commodity) => commodity.volume))(commodity),
        })),
      },
    );
  return order;
};
