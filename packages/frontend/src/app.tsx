import { AdminDashboardPage } from "@/components/admin/admin-dashboard-page";
import { AdminPoliciesPage } from "@/components/admin/admin-policies-page";
import { AppFrame } from "@/components/app-frame";
import { CartPage } from "@/components/cart/cart-page";
import {
  CatalogPage,
  CatalogPageFallback,
} from "@/components/catalog/catalog-page";
import { OrderDetailPage } from "@/components/orders/order-detail-page";
import { OrdersPage } from "@/components/orders/orders-page";
import { ProductDetailPage } from "@/components/product/product-detail-page";
import { AppProviders } from "@/components/providers/app-providers";
import { SellerDashboardPage } from "@/components/seller/seller-dashboard-page";
import { SellerStudioPage } from "@/components/seller/seller-studio-page";
import { WalletPage } from "@/components/wallet/wallet-page";
import { Suspense } from "react";
import { Navigate, Route, Routes, useParams } from "react-router-dom";

function CatalogRoute() {
  return (
    <Suspense fallback={<CatalogPageFallback />}>
      <CatalogPage />
    </Suspense>
  );
}

function ProductRoute() {
  const { id } = useParams<{ id: string }>();
  return id
    ? <ProductDetailPage productId={id} />
    : <Navigate replace to="/" />;
}

function OrderRoute() {
  const { id } = useParams<{ id: string }>();
  return id
    ? <OrderDetailPage orderId={id} />
    : <Navigate replace to="/orders" />;
}

export function App() {
  return (
    <AppProviders>
      <AppFrame>
        <Routes>
          <Route path="/" element={<CatalogRoute />} />
          <Route path="/products/:id" element={<ProductRoute />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrderRoute />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/seller" element={<SellerDashboardPage />} />
          <Route path="/seller/studio" element={<SellerStudioPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/policies" element={<AdminPoliciesPage />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </AppFrame>
    </AppProviders>
  );
}
