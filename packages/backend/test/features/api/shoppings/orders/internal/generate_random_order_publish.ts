import { TestValidator } from "@nestia/e2e";
import { v4 } from "uuid";

import ShoppingApi from "@samchon/shopping-api";
import {
  IShoppingAddress,
  IShoppingCustomer,
  IShoppingOrder,
  IShoppingOrderPrice,
  IShoppingOrderPublish,
} from "@samchon/shopping-api";

import { ConnectionPool } from "../../../../../ConnectionPool";
import { prepare_random_address } from "./prepare_random_address";

export const generate_random_order_publish = async (
  pool: ConnectionPool,
  customer: IShoppingCustomer,
  order: IShoppingOrder,
  paid: boolean,
  address?: IShoppingAddress.ICreate,
): Promise<IShoppingOrderPublish> => {
  const price: IShoppingOrderPrice =
    await ShoppingApi.functional.shoppings.customers.orders.price(
      pool.customer,
      order.id,
    );
  address ??= prepare_random_address(customer.citizen!, address);

  const input: IShoppingOrderPublish.ICreate =
    price.cash === 0
      ? {
          vendor: null,
          address,
        }
      : paid
        ? {
            // @todo - interact with payment system
            vendor: {
              code: "somewhere",
              uid: v4(),
            },
            address,
          }
        : {
            // @todo - interact with payment system
            vendor: {
              code: "somewhere",
              uid: `vbank::${v4()}`,
            },
            address,
          };

  const publish: IShoppingOrderPublish =
    await ShoppingApi.functional.shoppings.customers.orders.publish.create(
      pool.customer,
      order.id,
      input,
    );
  TestValidator.equals("paid_at", !!publish.paid_at, paid);
  return publish;
};
