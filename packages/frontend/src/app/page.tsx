import {
  CatalogPage,
  CatalogPageFallback,
} from "@/components/catalog/catalog-page";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <Suspense fallback={<CatalogPageFallback />}>
      <CatalogPage />
    </Suspense>
  );
}
