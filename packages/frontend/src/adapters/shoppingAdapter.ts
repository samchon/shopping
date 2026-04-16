/**
 * SDK Adapter Layer - Abstracts SDK calls for the application
 */
import { authStorage } from "@/lib/auth";
import {
  createAuthenticatedConnection,
  createConnection,
} from "@/lib/connection";

import * as ShoppingApi from "@samchon/shopping-api";

const functional = ShoppingApi.functional;

function getAuthenticatedConnection(): ShoppingApi.IConnection {
  const token = authStorage.get()?.accessToken;
  if (!token) throw new Error("Authentication required");
  return createAuthenticatedConnection(token);
}

export const authAdapter = {
  createCustomer: async (input: ShoppingApi.IShoppingCustomer.ICreate) => {
    const connection = createConnection();
    return await functional.shoppings.customers.authenticate.create(
      connection,
      input,
    );
  },
  login: async (email: string, password: string) => {
    const connection = createConnection();
    return await functional.shoppings.customers.authenticate.login(connection, {
      email,
      password,
    });
  },
  refresh: async () => {
    const stored = authStorage.get();
    if (!stored?.refreshToken || !stored.accessToken)
      throw new Error("No refresh token");
    const connection = createAuthenticatedConnection(stored.accessToken);
    return await functional.shoppings.customers.authenticate.refresh(
      connection,
      { value: stored.refreshToken },
    );
  },
  getCurrentCustomer:
    async (): Promise<ShoppingApi.IShoppingCustomer | null> => {
      const stored = authStorage.get();
      if (!stored?.accessToken) return null;
      try {
        const connection = createAuthenticatedConnection(stored.accessToken);
        return await functional.shoppings.customers.authenticate.get(
          connection,
        );
      } catch {
        return null;
      }
    },
};

export const salesAdapter = {
  list: async (params?: ShoppingApi.IShoppingSale.IRequest) => {
    const connection = getAuthenticatedConnection();
    return await functional.shoppings.customers.sales.index(
      connection,
      params || {},
    );
  },
  get: async (id: string): Promise<ShoppingApi.IShoppingSale> => {
    const connection = getAuthenticatedConnection();
    return await functional.shoppings.customers.sales.at(connection, id);
  },
};

export const cartAdapter = {
  add: async (input: ShoppingApi.IShoppingCartCommodity.ICreate) => {
    const connection = getAuthenticatedConnection();
    return await functional.shoppings.customers.carts.commodities.create(
      connection,
      input,
    );
  },
  remove: async (id: string) => {
    const connection = getAuthenticatedConnection();
    return await functional.shoppings.customers.carts.commodities.erase(
      connection,
      id,
    );
  },
};

export const ordersAdapter = {
  list: async (params?: ShoppingApi.IShoppingOrder.IRequest) => {
    const connection = getAuthenticatedConnection();
    return await functional.shoppings.customers.orders.index(
      connection,
      params || {},
    );
  },
  get: async (id: string): Promise<ShoppingApi.IShoppingOrder> => {
    const connection = getAuthenticatedConnection();
    return await functional.shoppings.customers.orders.at(connection, id);
  },
  create: async (input: ShoppingApi.IShoppingOrder.ICreate) => {
    const connection = getAuthenticatedConnection();
    return await functional.shoppings.customers.orders.create(
      connection,
      input,
    );
  },
};

export const couponsAdapter = {};
export const depositsAdapter = {};
export const mileagesAdapter = {};
