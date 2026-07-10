import {
  IShoppingCartCommodityStock,
  IShoppingSaleUnit,
  IShoppingSaleUnitStock,
} from "@samchon/shopping-api";
import { RandomGenerator } from "@nestia/e2e";

export const prepare_random_cart_commodity_stock = (
  unit: IShoppingSaleUnit,
  input: Partial<IShoppingCartCommodityStock.ICreate> = {},
): IShoppingCartCommodityStock.ICreate => {
  const stock: IShoppingSaleUnitStock = RandomGenerator.pick(unit.stocks);
  return {
    unit_id: unit.id,
    stock_id: stock.id,
    choices: [],
    quantity: 1,
    ...input,
  };
};
