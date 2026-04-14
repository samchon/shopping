import { IShoppingActorEntity, IShoppingCustomer } from "@samchon/shopping-api";

import { ShoppingCustomerProvider } from "./ShoppingCustomerProvider";

export namespace ShoppingActorProvider {
  export const equals = <T extends IShoppingActorEntity>(
    x: T,
    y: T,
  ): boolean => {
    if (x.type !== y.type) return false;
    return x.type === "customer"
      ? ShoppingCustomerProvider.equals(x, y as IShoppingCustomer)
      : x.id === y.id;
  };
}
