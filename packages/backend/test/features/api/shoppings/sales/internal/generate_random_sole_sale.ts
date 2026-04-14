import ShoppingApi from "@samchon/shopping-api";
import {
  IShoppingPrice,
  IShoppingSale,
  IShoppingSaleUnit,
  IShoppingSaleUnitStock,
} from "@samchon/shopping-api";

import { ConnectionPool } from "../../../../../ConnectionPool";
import { prepare_random_sale } from "./prepare_random_sale";

export const generate_random_sole_sale = async (
  pool: ConnectionPool,
  price: IShoppingPrice,
  quantity?: number,
): Promise<IShoppingSale> => {
  const sale: IShoppingSale =
    await ShoppingApi.functional.shoppings.sellers.sales.create(
      pool.seller,
      await prepare_random_sole_sale(pool, price, quantity),
    );
  return sale;
};

const prepare_random_sole_sale = async (
  pool: ConnectionPool,
  price: IShoppingPrice,
  quantity?: number,
): Promise<IShoppingSale.ICreate> => {
  const sale: IShoppingSale.ICreate = await prepare_random_sale(pool);
  const unit: IShoppingSaleUnit.ICreate = sale.units[0];
  const stock: IShoppingSaleUnitStock.ICreate = unit.stocks[0];

  sale.units = [unit];
  unit.stocks = [stock];
  stock.price = price;
  if (quantity !== undefined) stock.quantity = quantity;

  unit.options = [];
  stock.choices = [];

  return sale;
};
