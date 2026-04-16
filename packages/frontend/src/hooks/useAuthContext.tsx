"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import type { IShoppingCustomer } from "@samchon/shopping-api";

interface AuthContextType {
  customer: IShoppingCustomer | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();
  const [customer, setCustomer] = useState<IShoppingCustomer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state from storage
    const storedCustomer = auth.getCurrentCustomer();
    setCustomer(storedCustomer);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const result = await auth.login(email, password);
    setCustomer(result);
  };

  const logout = () => {
    auth.logout();
    setCustomer(null);
  };

  return (
    <AuthContext.Provider
      value={{
        customer,
        isAuthenticated: !!customer,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
