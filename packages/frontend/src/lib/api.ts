import { functional, type IConnection } from "@samchon/shopping-api"
import type {
  IShoppingCartCommodity,
  IShoppingCoupon,
  IShoppingOrder,
  IShoppingSale,
} from "@samchon/shopping-api"

/**
 * Shopping API Connection
 *
 * This module provides a typed interface for all shopping API endpoints.
 * The API follows the structure of the generated SDK from @samchon/shopping-api.
 */
export interface IShoppingAPI {
  // Customer endpoints
  customer: {
    authenticate: {
      password: {
        /** Login with email and password */
        login: (email: string, password: string) => Promise<void>
        /** Logout current session */
        logout: () => Promise<void>
      }
    }
    carts: {
      commodities: {
        list: () => Promise<IPage<IShoppingCartCommodity>>
        create: (commodity: IShoppingCartCommodity.ICreate) => Promise<IShoppingCartCommodity>
        update: (id: string, volume: number) => Promise<void>
        erase: (id: string) => Promise<void>
      }
    }
    orders: {
      list: (request?: IShoppingOrder.IRequest) => Promise<IPage<IShoppingOrder>>
      create: (order: IShoppingOrder.ICreate) => Promise<IShoppingOrder>
      at: (id: string) => Promise<IShoppingOrder>
    }
    sales: {
      listSummary: (request?: IShoppingSale.IRequest) => Promise<IPage<IShoppingSale.ISummary>>
      at: (id: string) => Promise<IShoppingSale>
    }
    coupons: {
      list: (request?: IShoppingCoupon.IRequest) => Promise<IPage<IShoppingCoupon>>
    }
  }

  // Seller endpoints (to be implemented)
  seller: {
    // Placeholder for seller endpoints
  }

  // Admin endpoints (to be implemented)
  admin: {
    // Placeholder for admin endpoints
  }
}

/**
 * A page of data.
 */
export interface IPage<T extends object> {
  pagination: {
    current: number
    limit: number
    records: number
    pages: number
  }
  data: T[]
}

/**
 * Connection wrapper for the Shopping API
 */
export class ShoppingAPI implements IShoppingAPI {
  private readonly connection: IConnection

  public constructor(connection: IConnection) {
    this.connection = connection
  }

  // ==================== Customer Endpoints ====================

  public get customer() {
    return {
      authenticate: {
        password: {
          login: async (email: string, password: string): Promise<void> => {
            // Login implementation
            throw new Error("Not implemented - requires backend authentication endpoint")
          },
          logout: async (): Promise<void> => {
            // Logout implementation
            throw new Error("Not implemented - requires backend authentication endpoint")
          },
        },
      },
      carts: {
        commodities: {
          list: async (): Promise<IPage<IShoppingCartCommodity>> => {
            const response = await functional.shoppings.customers.carts.commodities.index(
              this.connection,
              {},
            )
            // Parse the response to match our IPage interface
            return response
          },
          create: async (
            commodity: IShoppingCartCommodity.ICreate,
          ): Promise<IShoppingCartCommodity> => {
            const response = await functional.shoppings.customers.carts.commodities.create(
              this.connection,
              commodity,
            )
            return response
          },
          update: async (id: string, volume: number): Promise<void> => {
            await functional.shoppings.customers.carts.commodities.update(
              this.connection,
              id,
              { volume },
            )
          },
          erase: async (id: string): Promise<void> => {
            await functional.shoppings.customers.carts.commodities.erase(
              this.connection,
              id,
            )
          },
        },
      },
      orders: {
        list: async (
          request?: IShoppingOrder.IRequest,
        ): Promise<IPage<IShoppingOrder>> => {
          const response = await functional.shoppings.customers.orders.index(
            this.connection,
            request ?? {},
          )
          return response
        },
        create: async (
          order: IShoppingOrder.ICreate,
        ): Promise<IShoppingOrder> => {
          const response = await functional.shoppings.customers.orders.create(
            this.connection,
            order,
          )
          return response
        },
        at: async (id: string): Promise<IShoppingOrder> => {
          const response = await functional.shoppings.customers.orders.at(
            this.connection,
            id,
          )
          return response
        },
      },
      sales: {
        listSummary: async (
          request?: IShoppingSale.IRequest,
        ): Promise<IPage<IShoppingSale.ISummary>> => {
          const response = await functional.shoppings.customers.sales.index(
            this.connection,
            request ?? {},
          )
          return response
        },
        at: async (id: string): Promise<IShoppingSale> => {
          const response = await functional.shoppings.customers.sales.at(
            this.connection,
            id,
          )
          return response
        },
      },
      coupons: {
        list: async (
          request?: IShoppingCoupon.IRequest,
        ): Promise<IPage<IShoppingCoupon>> => {
          const response = await functional.shoppings.customers.coupons.index(
            this.connection,
            request ?? {},
          )
          return response
        },
      },
    }
  }

  // ==================== Seller Endpoints ====================

  public get seller() {
    return {
      // TODO: Implement seller endpoints
    }
  }

  // ==================== Admin Endpoints ====================

  public get admin() {
    return {
      // TODO: Implement admin endpoints
    }
  }
}
