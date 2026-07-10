import {
  activateCitizen,
  getSessionData,
  joinMember,
  loginMember,
} from "./shopping/account";
import {
  createAdminCoupon,
  createAdminDeposit,
  createAdminMileage,
  getAdminDashboard,
  getAdminSessionData,
  joinAdmin,
  loginAdmin,
} from "./shopping/admin";
import {
  addCartItem,
  deleteCartItem,
  getCartData,
  updateCartItem,
} from "./shopping/cart";
import { getCatalogData, getProductData } from "./shopping/catalog";
import { toErrorResponse } from "./shopping/errors";
import {
  createOrder,
  getOrderDetail,
  getOrdersData,
  publishOrder,
} from "./shopping/orders";
import {
  getSellerDashboard,
  getSellerSessionData,
  joinSeller,
  loginSeller,
  openSellerSale,
  pauseSellerSale,
  replicateSellerSale,
  restoreSellerSale,
} from "./shopping/seller";
import { jsonWithCustomerSession } from "./shopping/session";
import { claimCoupon, getWalletData } from "./shopping/wallet";

function routeParameter(pathname: string, pattern: RegExp): string | null {
  const value = pathname.match(pattern)?.[1];
  return value ? decodeURIComponent(value) : null;
}

export async function handleApiRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const { pathname } = url;
  const method = request.method.toUpperCase();

  try {
    if (method === "GET" && pathname === "/api/session") {
      return await jsonWithCustomerSession(request, getSessionData);
    }
    if (method === "POST" && pathname === "/api/session/activate") {
      const payload = await request.json();
      return await jsonWithCustomerSession(request, (context) =>
        activateCitizen(payload, context),
      );
    }
    if (method === "POST" && pathname === "/api/session/join") {
      const payload = await request.json();
      return await jsonWithCustomerSession(request, (context) =>
        joinMember(payload, context),
      );
    }
    if (method === "POST" && pathname === "/api/session/login") {
      const payload = await request.json();
      return await jsonWithCustomerSession(request, (context) =>
        loginMember(payload, context),
      );
    }

    if (method === "GET" && pathname === "/api/store") {
      return await jsonWithCustomerSession(request, (context) =>
        getCatalogData(request, context),
      );
    }
    const productId = routeParameter(pathname, /^\/api\/products\/([^/]+)$/);
    if (method === "GET" && productId) {
      return await jsonWithCustomerSession(request, (context) =>
        getProductData(productId, context),
      );
    }

    if (pathname === "/api/cart" && method === "GET") {
      return await jsonWithCustomerSession(request, getCartData);
    }
    if (pathname === "/api/cart" && method === "POST") {
      const payload = await request.json();
      return await jsonWithCustomerSession(request, async (context) => {
        await addCartItem(payload, context);
        return getCartData(context);
      });
    }
    const cartItemId = routeParameter(pathname, /^\/api\/cart\/([^/]+)$/);
    if (cartItemId && method === "PATCH") {
      const payload = await request.json();
      return await jsonWithCustomerSession(request, async (context) => {
        await updateCartItem(cartItemId, payload, context);
        return getCartData(context);
      });
    }
    if (cartItemId && method === "DELETE") {
      return await jsonWithCustomerSession(request, async (context) => {
        await deleteCartItem(cartItemId, context);
        return getCartData(context);
      });
    }

    if (pathname === "/api/orders" && method === "GET") {
      return await jsonWithCustomerSession(request, getOrdersData);
    }
    if (pathname === "/api/orders" && method === "POST") {
      const payload = await request.json();
      return await jsonWithCustomerSession(request, (context) =>
        createOrder(payload, context),
      );
    }
    const publishOrderId = routeParameter(
      pathname,
      /^\/api\/orders\/([^/]+)\/publish$/,
    );
    if (publishOrderId && method === "POST") {
      const payload = await request.json();
      return await jsonWithCustomerSession(request, async (context) => {
        await publishOrder(publishOrderId, payload, context);
        return getOrderDetail(publishOrderId, context);
      });
    }
    const orderId = routeParameter(pathname, /^\/api\/orders\/([^/]+)$/);
    if (orderId && method === "GET") {
      return await jsonWithCustomerSession(request, (context) =>
        getOrderDetail(orderId, context),
      );
    }

    if (pathname === "/api/wallet" && method === "GET") {
      return await jsonWithCustomerSession(request, getWalletData);
    }
    const couponId = routeParameter(
      pathname,
      /^\/api\/wallet\/coupons\/([^/]+)\/claim$/,
    );
    if (couponId && method === "POST") {
      return await jsonWithCustomerSession(request, (context) =>
        claimCoupon(couponId, context),
      );
    }

    if (pathname === "/api/seller/session" && method === "GET") {
      return await jsonWithCustomerSession(request, getSellerSessionData);
    }
    if (pathname === "/api/seller/session/join" && method === "POST") {
      return await jsonWithCustomerSession(request, joinSeller);
    }
    if (pathname === "/api/seller/session/login" && method === "POST") {
      const payload = await request.json();
      return await jsonWithCustomerSession(request, (context) =>
        loginSeller(payload, context),
      );
    }
    if (pathname === "/api/seller/dashboard" && method === "GET") {
      return await jsonWithCustomerSession(request, getSellerDashboard);
    }
    if (pathname === "/api/seller/sales/replicate" && method === "POST") {
      const payload = await request.json();
      return await jsonWithCustomerSession(request, (context) =>
        replicateSellerSale(payload, context),
      );
    }
    const pausedSaleId = routeParameter(
      pathname,
      /^\/api\/seller\/sales\/([^/]+)\/pause$/,
    );
    if (pausedSaleId && method === "DELETE") {
      return await jsonWithCustomerSession(request, (context) =>
        pauseSellerSale(pausedSaleId, context),
      );
    }
    const restoredSaleId = routeParameter(
      pathname,
      /^\/api\/seller\/sales\/([^/]+)\/restore$/,
    );
    if (restoredSaleId && method === "PUT") {
      return await jsonWithCustomerSession(request, (context) =>
        restoreSellerSale(restoredSaleId, context),
      );
    }
    const openedSaleId = routeParameter(
      pathname,
      /^\/api\/seller\/sales\/([^/]+)\/open$/,
    );
    if (openedSaleId && method === "PUT") {
      const payload = await request.json();
      return await jsonWithCustomerSession(request, (context) =>
        openSellerSale(openedSaleId, payload, context),
      );
    }

    if (pathname === "/api/admin/session" && method === "GET") {
      return await jsonWithCustomerSession(request, getAdminSessionData);
    }
    if (pathname === "/api/admin/session/join" && method === "POST") {
      return await jsonWithCustomerSession(request, joinAdmin);
    }
    if (pathname === "/api/admin/session/login" && method === "POST") {
      const payload = await request.json();
      return await jsonWithCustomerSession(request, (context) =>
        loginAdmin(payload, context),
      );
    }
    if (pathname === "/api/admin/dashboard" && method === "GET") {
      return await jsonWithCustomerSession(request, getAdminDashboard);
    }
    if (pathname === "/api/admin/coupons" && method === "POST") {
      const payload = await request.json();
      return await jsonWithCustomerSession(request, (context) =>
        createAdminCoupon(payload, context),
      );
    }
    if (pathname === "/api/admin/deposits" && method === "POST") {
      const payload = await request.json();
      return await jsonWithCustomerSession(request, (context) =>
        createAdminDeposit(payload, context),
      );
    }
    if (pathname === "/api/admin/mileages" && method === "POST") {
      const payload = await request.json();
      return await jsonWithCustomerSession(request, (context) =>
        createAdminMileage(payload, context),
      );
    }

    return Response.json(
      { message: `No API route matched ${method} ${pathname}.` },
      { status: 404 },
    );
  } catch (error) {
    return toErrorResponse(error);
  }
}
