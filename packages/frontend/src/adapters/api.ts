import { PlainFetcher } from "@nestia/fetcher";

import type { IConnection } from "@samchon/shopping-api";

export const API_HOST =
  process.env.NEXT_PUBLIC_API_HOST || "http://127.0.0.1:37001";

export const createConnection = (simulate: boolean = false): IConnection => {
  return {
    host: API_HOST,
    headers: {},
    simulate,
  };
};

export const api = {
  customers: {
    authenticate: {
      get: async (connection: IConnection) => {
        return await PlainFetcher.fetch(connection, {
          method: "GET",
          path: "/shoppings/customers/authenticate",
        } as any);
      },
      login: async (connection: IConnection, body: any) => {
        return await PlainFetcher.fetch(connection, {
          method: "PUT",
          path: "/shoppings/customers/authenticate/login",
        } as any);
      },
      join: async (connection: IConnection, body: any) => {
        return await PlainFetcher.fetch(connection, {
          method: "POST",
          path: "/shoppings/customers/authenticate/join",
        } as any);
      },
    },
    sales: {
      index: async (connection: IConnection, params: any) => {
        return await PlainFetcher.fetch(connection, {
          method: "PATCH",
          path: "/shoppings/customers/sales",
        } as any);
      },
      at: async (connection: IConnection, id: string) => {
        return await PlainFetcher.fetch(connection, {
          method: "GET",
          path: `/shoppings/customers/sales/${id}`,
        } as any);
      },
    },
    carts: {
      commodities: {
        index: async (connection: IConnection) => {
          return await PlainFetcher.fetch(connection, {
            method: "GET",
            path: "/shoppings/customers/carts/commodities",
          } as any);
        },
      },
    },
    orders: {
      index: async (connection: IConnection) => {
        return await PlainFetcher.fetch(connection, {
          method: "PATCH",
          path: "/shoppings/customers/orders",
        } as any);
      },
      at: async (connection: IConnection, id: string) => {
        return await PlainFetcher.fetch(connection, {
          method: "GET",
          path: `/shoppings/customers/orders/${id}`,
        } as any);
      },
      erase: async (connection: IConnection, id: string) => {
        return await PlainFetcher.fetch(connection, {
          method: "DELETE",
          path: `/shoppings/customers/orders/${id}`,
        } as any);
      },
    },
  },
  sellers: {
    authenticate: {
      login: async (connection: IConnection, body: any) => {
        return await PlainFetcher.fetch(connection, {
          method: "PUT",
          path: "/shoppings/sellers/authenticate/login",
        } as any);
      },
      get: async (connection: IConnection) => {
        return await PlainFetcher.fetch(connection, {
          method: "GET",
          path: "/shoppings/sellers/authenticate",
        } as any);
      },
    },
  },
  admins: {
    authenticate: {
      login: async (connection: IConnection, body: any) => {
        return await PlainFetcher.fetch(connection, {
          method: "PUT",
          path: "/shoppings/admins/authenticate/login",
        } as any);
      },
      get: async (connection: IConnection) => {
        return await PlainFetcher.fetch(connection, {
          method: "GET",
          path: "/shoppings/admins/authenticate",
        } as any);
      },
    },
  },
};
