"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarRange,
  CopyPlus,
  PackageCheck,
  Rocket,
  Sparkles,
  Tag,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { ErrorState } from "@/components/error-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useReplicateSellerSale, useSellerDashboard } from "@/lib/shopping/hooks";
import type { SellerReplicaSalePayload } from "@/lib/shopping/types";
import { cn, formatCurrency, formatDateTime } from "@/lib/utils";

function toDateTimeLocalValue(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

function fromDateTimeLocalValue(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  return new Date(value).toISOString();
}

function parseTags(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function SellerStudioPage() {
  const dashboard = useSellerDashboard();
  const replicateSellerSale = useReplicateSellerSale();
  const [sourceSaleId, setSourceSaleId] = useState("");
  const [replicaStatus, setReplicaStatus] = useState<"live" | "paused">("live");

  if (dashboard.isError) {
    return (
      <ErrorState
        title="Seller studio request failed"
        description="The studio could not load seller inventory. Retry after checking the seller session."
        onRetry={() => dashboard.refetch()}
      />
    );
  }

  if (dashboard.isLoading || !dashboard.data) {
    return (
      <div className="grid gap-6">
        <Skeleton className="h-40 rounded-[28px]" />
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr),minmax(0,0.9fr)]">
          <Skeleton className="h-[560px] rounded-[28px]" />
          <Skeleton className="h-[560px] rounded-[28px]" />
        </div>
      </div>
    );
  }

  const { session, sales, orders, metrics } = dashboard.data;
  if (!session.active) {
    return (
      <Card>
        <CardContent className="grid gap-4 p-8">
          <Badge className="w-fit">Seller studio</Badge>
          <h1 className="text-3xl font-semibold">Sign into the seller console first</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            This workspace is for preparing sale copies, schedules, and tag sets. Open the
            seller console, sign in with the built-in operator, then return here to manage the
            next sale.
          </p>
          <div>
            <Button asChild>
              <Link href="/seller">
                Open seller console
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const selectedSourceSaleId = sourceSaleId || sales[0]?.id || "";
  const sourceSale = sales.find((sale) => sale.id === selectedSourceSaleId) ?? sales[0] ?? null;
  const launchCards = sales.slice(0, 3).map((sale, index) => ({
    ...sale,
    accent:
      index === 0
        ? "from-amber-400/30 via-orange-500/15 to-transparent"
        : index === 1
          ? "from-sky-400/30 via-cyan-500/15 to-transparent"
          : "from-emerald-400/30 via-lime-500/15 to-transparent",
  }));

  const readySales = sales.filter((sale) => sale.status === "live").length;
  const pausedSales = sales.filter((sale) => sale.status === "paused").length;
  const avgTicket = orders.length ? Math.round(metrics.revenue / orders.length) : 0;
  const topTags = Array.from(
    new Set(sales.flatMap((sale) => sale.tags.map((tag) => tag.toLowerCase()))),
  ).slice(0, 8);

  async function submitReplica(formData: FormData) {
    if (!sourceSale) return;
    const payload: SellerReplicaSalePayload = {
      sourceSaleId: sourceSale.id,
      title: String(formData.get("title") ?? "").trim(),
      sectionCode: sourceSale.sectionCode,
      tags: parseTags(String(formData.get("tags") ?? "")),
      openedAt: fromDateTimeLocalValue(formData.get("openedAt")),
      closedAt: fromDateTimeLocalValue(formData.get("closedAt")),
      status: replicaStatus,
    };

    try {
      await replicateSellerSale.mutateAsync(payload);
      toast.success("Copied sale created.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Copied sale creation failed.");
    }
  }

  return (
    <div className="grid gap-6">
      <Card className="overflow-hidden border-none bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.16),transparent_35%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.15),transparent_35%),linear-gradient(135deg,rgba(15,23,42,1),rgba(30,41,59,0.96))] text-slate-50 shadow-[0_24px_80px_rgba(15,23,42,0.24)]">
        <CardContent className="grid gap-8 p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <Badge className="border-white/15 bg-white/10 text-white hover:bg-white/10">
                Sale workspace
              </Badge>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight">
                Copy an existing sale and prepare it for publishing
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-200/80">
                Review current sale status, recent order totals, and copied sale details in one
                place before opening the next listing.
              </p>
            </div>
            <div className="grid min-w-[240px] gap-3 rounded-[28px] border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Status summary</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-white/8 p-3">
                  <p className="text-slate-300">Live</p>
                  <p className="mt-1 text-2xl font-semibold">{readySales}</p>
                </div>
                <div className="rounded-2xl bg-white/8 p-3">
                  <p className="text-slate-300">Paused</p>
                  <p className="mt-1 text-2xl font-semibold">{pausedSales}</p>
                </div>
                <div className="rounded-2xl bg-white/8 p-3">
                  <p className="text-slate-300">Revenue</p>
                  <p className="mt-1 text-lg font-semibold">{formatCurrency(metrics.revenue)}</p>
                </div>
                <div className="rounded-2xl bg-white/8 p-3">
                  <p className="text-slate-300">Avg ticket</p>
                  <p className="mt-1 text-lg font-semibold">{formatCurrency(avgTicket)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {launchCards.map((sale) => (
              <div
                key={sale.id}
                className={cn(
                  "rounded-[28px] border border-white/10 bg-gradient-to-br p-5",
                  sale.accent,
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-[0.22em] text-slate-300">
                      {sale.sectionName}
                    </p>
                    <h2 className="mt-2 text-xl font-semibold">{sale.title}</h2>
                  </div>
                  <Badge
                    className="border-white/15 bg-white/10 text-white hover:bg-white/10"
                    variant="secondary"
                  >
                    {sale.status}
                  </Badge>
                </div>
                <div className="mt-5 grid gap-2 text-sm text-slate-200/80">
                  <p>{sale.unitCount} units across {sale.stockCount} surfaced stocks</p>
                  <p>
                    Price band {formatCurrency(sale.priceRange.lowest.real)} to{" "}
                    {formatCurrency(sale.priceRange.highest.real)}
                  </p>
                  <p>Last touched {formatDateTime(sale.updatedAt)}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {sale.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr),minmax(0,0.85fr)]">
        <Card className="border-border/70">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <CopyPlus className="h-5 w-5 text-primary" />
              Sale copy builder
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5">
            <div className="grid gap-4 rounded-[24px] bg-muted/35 p-5 lg:grid-cols-[minmax(0,1fr),280px]">
              <form
                className="grid gap-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  void submitReplica(new FormData(event.currentTarget));
                }}
              >
                <div className="grid gap-2">
                  <Label htmlFor="studio-source-sale">Base sale</Label>
                  <Select
                    onValueChange={(value) => setSourceSaleId(value)}
                    value={selectedSourceSaleId}
                  >
                    <SelectTrigger id="studio-source-sale">
                      <SelectValue placeholder="Choose a source sale" />
                    </SelectTrigger>
                    <SelectContent>
                      {sales.map((sale) => (
                        <SelectItem key={sale.id} value={sale.id}>
                          {sale.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="replica-title">Sale title</Label>
                    <Input
                      defaultValue={sourceSale ? `${sourceSale.title} Limited Edition` : ""}
                      id="replica-title"
                      name="title"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="studio-status">Initial status</Label>
                    <Select
                      onValueChange={(value: "live" | "paused") => setReplicaStatus(value)}
                      value={replicaStatus}
                    >
                      <SelectTrigger id="studio-status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="live">Live</SelectItem>
                        <SelectItem value="paused">Paused</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="replica-tags">Search tags</Label>
                  <Input
                    defaultValue={sourceSale?.tags.join(", ") ?? ""}
                    id="replica-tags"
                    name="tags"
                    placeholder="apple, watch, event, promotion"
                  />
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="replica-opened-at">Sale opens</Label>
                    <Input
                      defaultValue={toDateTimeLocalValue(sourceSale?.openedAt ?? null)}
                      id="replica-opened-at"
                      name="openedAt"
                      type="datetime-local"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="replica-closed-at">Sale closes</Label>
                    <Input
                      defaultValue={toDateTimeLocalValue(sourceSale?.closedAt ?? null)}
                      id="replica-closed-at"
                      name="closedAt"
                      type="datetime-local"
                    />
                  </div>
                </div>

                <Button disabled={!sourceSale || replicateSellerSale.isPending} type="submit">
                  {replicateSellerSale.isPending ? "Creating..." : "Create copied sale"}
                </Button>
              </form>

              <div className="grid gap-3 rounded-[24px] border border-border/60 bg-background p-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <p className="font-medium">Copied sale summary</p>
                </div>
                {sourceSale ? (
                  <>
                    <div className="rounded-2xl bg-muted/50 p-4">
                      <p className="text-sm text-muted-foreground">Source section</p>
                      <p className="mt-1 font-semibold">{sourceSale.sectionName}</p>
                    </div>
                    <div className="grid gap-2 text-sm text-muted-foreground">
                      <p>
                        This copy starts from an existing sale with {sourceSale.unitCount} sellable
                        units and {sourceSale.stockCount} surfaced stocks.
                      </p>
                      <p>
                        Current price range is {formatCurrency(sourceSale.priceRange.lowest.real)} to{" "}
                        {formatCurrency(sourceSale.priceRange.highest.real)}.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {topTags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-secondary px-2.5 py-1 text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Pick a source sale to review copied values before saving.
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-3 lg:grid-cols-3">
              <div className="rounded-[24px] border border-border/70 bg-muted/20 p-4">
                <div className="flex items-center gap-2">
                  <CalendarRange className="h-4 w-4 text-primary" />
                  <p className="font-medium">Publishing schedule</p>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {sales[0] ? `${formatDateTime(sales[0].openedAt)} is the next scheduled publish time.` : "No publish time is scheduled yet."}
                </p>
              </div>
              <div className="rounded-[24px] border border-border/70 bg-muted/20 p-4">
                <div className="flex items-center gap-2">
                  <PackageCheck className="h-4 w-4 text-primary" />
                  <p className="font-medium">Visible stock</p>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {sales.reduce((acc, sale) => acc + sale.stockCount, 0)} stock combinations are
                  currently exposed across active and paused sales.
                </p>
              </div>
              <div className="rounded-[24px] border border-border/70 bg-muted/20 p-4">
                <div className="flex items-center gap-2">
                  <Rocket className="h-4 w-4 text-primary" />
                  <p className="font-medium">Recent orders</p>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {metrics.paidOrders} paid orders are linked to this seller account, so you can
                  compare a copied sale against recent results.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-primary" />
              Sales list
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {sales.slice(0, 4).map((sale) => (
              <div
                key={sale.id}
                className="grid gap-3 rounded-[24px] border border-border/70 bg-muted/30 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{sale.title}</p>
                    <p className="text-sm text-muted-foreground">{sale.sectionName}</p>
                  </div>
                  <Badge variant={sale.status === "live" ? "default" : "secondary"}>
                    {sale.status}
                  </Badge>
                </div>
                <div className="grid gap-2 text-sm text-muted-foreground">
                  <p>Updated {formatDateTime(sale.updatedAt)}</p>
                  <p>
                    {formatCurrency(sale.priceRange.lowest.real)} to{" "}
                    {formatCurrency(sale.priceRange.highest.real)}
                  </p>
                </div>
              </div>
            ))}

            <div className="rounded-[24px] border border-dashed border-border bg-background p-4">
              <p className="text-sm font-medium">Recent buyers</p>
              <div className="mt-3 grid gap-3">
                {orders.slice(0, 3).map((order) => (
                  <div key={order.id} className="flex items-center justify-between gap-3 text-sm">
                    <div>
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-muted-foreground">{order.name}</p>
                    </div>
                    <p className="font-semibold">{formatCurrency(order.totalPrice)}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
