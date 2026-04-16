import { createConnection, createAuthenticatedConnection } from "./connection";
import * as ShoppingApi from "@samchon/shopping-api";
import type { IShoppingCustomer } from "@samchon/shopping-api";

const authApi = ShoppingApi.functional.shoppings.customers.authenticate;

interface AuthState {
  customer: IShoppingCustomer | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: Date | null;
}

const AUTH_STORAGE_KEY = "shopping_auth";

export const authStorage = {
  get(): AuthState | null {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return null;
    
    const state: AuthState = JSON.parse(stored);
    if (state.expiresAt && new Date() >= new Date(state.expiresAt)) {
      this.clear();
      return null;
    }
    return state;
  },

  set(customer: IShoppingCustomer, token: IShoppingCustomer.IToken): void {
    if (typeof window === "undefined") return;
    
    const state: AuthState = {
      customer,
      accessToken: token.access,
      refreshToken: token.refresh,
      expiresAt: new Date(token.expired_at),
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
  },

  clear(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(AUTH_STORAGE_KEY);
  },
};

export const useAuth = () => {
  const getConnection = () => createConnection();

  const createCustomer = async (input: IShoppingCustomer.ICreate) => {
    const connection = getConnection();
    const result = await authApi.create(connection, input);
    authStorage.set(result, result.token);
    return result;
  };

  const login = async (email: string, password: string) => {
    const connection = getConnection();
    const result = await authApi.login(connection, { email, password });
    // Login returns customer but not token - need to handle this
    // For simulation mode, we'll create a mock token
    if (connection.simulate) {
      const mockToken: IShoppingCustomer.IToken = {
        access: `mock_access_${Date.now()}`,
        refresh: `mock_refresh_${Date.now()}`,
        expired_at: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
        refreshable_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      };
      authStorage.set(result, mockToken);
    }
    return result;
  };

  const join = async (input: ShoppingApi.IShoppingMember.IJoin) => {
    const connection = getConnection();
    const result = await authApi.join(connection, input);
    return result;
  };

  const refresh = async (): Promise<IShoppingCustomer | null> => {
    const stored = authStorage.get();
    if (!stored?.refreshToken || !stored.accessToken) return null;

    try {
      const conn = createAuthenticatedConnection(stored.accessToken);
      const result = await authApi.refresh(conn, { value: stored.refreshToken });
      authStorage.set(result, result.token);
      return result;
    } catch (error) {
      authStorage.clear();
      return null;
    }
  };

  const logout = (): void => {
    authStorage.clear();
  };

  const getCurrentCustomer = (): IShoppingCustomer | null => {
    return authStorage.get()?.customer || null;
  };

  const getAccessToken = (): string | null => {
    return authStorage.get()?.accessToken || null;
  };

  return {
    createCustomer,
    login,
    join,
    refresh,
    logout,
    getCurrentCustomer,
    getAccessToken,
    isAuthenticated: !!authStorage.get(),
  };
};
