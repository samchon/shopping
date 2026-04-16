import { IConnection } from "@samchon/shopping-api";

export const createConnection = (): IConnection => ({
  host: process.env.NEXT_PUBLIC_API_HOST || "http://127.0.0.1:37001",
  simulate: process.env.NEXT_PUBLIC_SIMULATE === "true",
  headers: {},
});

export const createAuthenticatedConnection = (
  accessToken: string,
): IConnection => ({
  host: process.env.NEXT_PUBLIC_API_HOST || "http://127.0.0.1:37001",
  simulate: process.env.NEXT_PUBLIC_SIMULATE === "true",
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});
