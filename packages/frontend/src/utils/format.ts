import type { IPage } from "@samchon/shopping-api";

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(price);
};

export const formatDate = (date: string | Date): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
};

export const paginate = <T>(
  page: number,
  limit: number,
  data: T[],
): { items: T[]; total: number; page: number; limit: number } => {
  const total = data.length;
  const start = page * limit;
  const end = start + limit;
  const items = data.slice(start, end);

  return {
    items,
    total,
    page,
    limit,
  };
};

export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

export const cn = (
  ...classes: (string | undefined | null | false)[]
): string => {
  return classes.filter(Boolean).join(" ");
};
