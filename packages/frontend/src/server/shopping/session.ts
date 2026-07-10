import ShoppingApi, { type IConnection } from "@samchon/shopping-api";
import { shoppingConfig } from "./config";
import {
  ApiRouteError,
  getHttpMessage,
  getHttpStatus,
  isUnauthorizedError,
} from "./errors";
import { mapSession } from "./mappers";
import { simulatedShoppingFetch } from "./simulate";

const ACCESS_COOKIE = "shopping_access_token";
const REFRESH_COOKIE = "shopping_refresh_token";

type AuthorizedCustomer =
  ShoppingApi.functional.shoppings.customers.authenticate.create.Output;

export interface SessionContext {
  connection: IConnection;
  refreshToken: string | null;
  customer:
    | AuthorizedCustomer
    | ShoppingApi.functional.shoppings.customers.authenticate.get.Output
    | null;
  cookieUpdates: Array<{
    name: string;
    value: string;
    expires: Date;
  }>;
}

function parseCookies(header: string | null): Map<string, string> {
  const cookies = new Map<string, string>();
  if (!header) {
    return cookies;
  }

  for (const segment of header.split(";")) {
    const separator = segment.indexOf("=");
    if (separator <= 0) {
      continue;
    }
    const name = segment.slice(0, separator).trim();
    const value = segment.slice(separator + 1).trim();
    try {
      cookies.set(name, decodeURIComponent(value));
    } catch {
      cookies.set(name, value);
    }
  }
  return cookies;
}

function serializeCookie(
  cookie: SessionContext["cookieUpdates"][number],
): string {
  const attributes = [
    `${cookie.name}=${encodeURIComponent(cookie.value)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Expires=${cookie.expires.toUTCString()}`,
  ];
  if (process.env.NODE_ENV === "production" && !shoppingConfig.simulate) {
    attributes.push("Secure");
  }
  return attributes.join("; ");
}

function createConnection(accessToken?: string): IConnection {
  return {
    host: shoppingConfig.apiHost,
    ...(shoppingConfig.simulate
      ? {
          fetch: simulatedShoppingFetch,
        }
      : {}),
    headers: accessToken
      ? {
          Authorization: `Bearer ${accessToken}`,
        }
      : {},
  };
}

function queueTokenCookies(
  context: SessionContext,
  token: AuthorizedCustomer["token"],
) {
  context.cookieUpdates.push(
    {
      name: ACCESS_COOKIE,
      value: token.access,
      expires: new Date(token.expired_at),
    },
    {
      name: REFRESH_COOKIE,
      value: token.refresh,
      expires: new Date(token.refreshable_until),
    },
  );
  context.refreshToken = token.refresh;
  context.connection.headers ??= {};
  context.connection.headers.Authorization = `Bearer ${token.access}`;
}

async function bootstrapCustomer(
  request: Request,
): Promise<SessionContext> {
  const connection = createConnection();
  const referer = request.headers.get("referer");
  const forwardedFor = request.headers.get("x-forwarded-for");
  const href = referer ?? new URL(request.url).origin;

  const customer =
    await ShoppingApi.functional.shoppings.customers.authenticate.create(
      connection,
      {
        channel_code: shoppingConfig.channelCode,
        external_user: null,
        href,
        referrer: referer,
        ip: forwardedFor ? forwardedFor.split(",")[0]?.trim() : null,
      },
    );

  const context: SessionContext = {
    connection,
    refreshToken: customer.token.refresh,
    customer,
    cookieUpdates: [],
  };
  queueTokenCookies(context, customer.token);
  return context;
}

async function refreshCustomer(refreshToken: string): Promise<SessionContext> {
  const connection = createConnection();
  const customer =
    await ShoppingApi.functional.shoppings.customers.authenticate.refresh(
      connection,
      {
        value: refreshToken,
      },
    );
  const context: SessionContext = {
    connection,
    refreshToken: customer.token.refresh,
    customer,
    cookieUpdates: [],
  };
  queueTokenCookies(context, customer.token);
  return context;
}

function isTemperedCustomerTokenError(error: unknown): boolean {
  return (
    getHttpStatus(error) === 403 &&
    getHttpMessage(error).toLowerCase().includes("tempered token")
  );
}

async function getOrCreateContext(
  request: Request,
): Promise<SessionContext> {
  const cookies = parseCookies(request.headers.get("cookie"));
  const accessToken = cookies.get(ACCESS_COOKIE);
  const refreshToken = cookies.get(REFRESH_COOKIE) ?? null;

  if (!accessToken && refreshToken) {
    try {
      return await refreshCustomer(refreshToken);
    } catch {
      return bootstrapCustomer(request);
    }
  }

  if (!accessToken) {
    return bootstrapCustomer(request);
  }

  return {
    connection: createConnection(accessToken),
    refreshToken,
    customer: null,
    cookieUpdates: [],
  };
}

function applyCookies(response: Response, context: SessionContext) {
  for (const cookie of context.cookieUpdates) {
    response.headers.append("Set-Cookie", serializeCookie(cookie));
  }

  return response;
}

export async function jsonWithCustomerSession<T>(
  request: Request,
  handler: (context: SessionContext) => Promise<T>,
) {
  let context = await getOrCreateContext(request);

  try {
    const data = await handler(context);
    return applyCookies(Response.json(data), context);
  } catch (error) {
    if (context.customer === null && isTemperedCustomerTokenError(error)) {
      context = await bootstrapCustomer(request);
      const data = await handler(context);
      return applyCookies(Response.json(data), context);
    }
    if (isUnauthorizedError(error) && context.refreshToken) {
      context = await refreshCustomer(context.refreshToken);
      const data = await handler(context);
      return applyCookies(Response.json(data), context);
    }
    throw error;
  }
}

export async function requireCurrentCustomer(context: SessionContext) {
  context.customer ??=
    await ShoppingApi.functional.shoppings.customers.authenticate.get(
      context.connection,
    );
  return context.customer;
}

export async function requireCitizen(context: SessionContext) {
  const customer = await requireCurrentCustomer(context);
  if (!customer.citizen) {
    throw new ApiRouteError(
      428,
      "Real-name verification is required before checkout.",
    );
  }
  return customer.citizen;
}

export function mapSessionResponse(
  customer:
    | AuthorizedCustomer
    | ShoppingApi.functional.shoppings.customers.authenticate.get.Output,
) {
  return mapSession(customer);
}
