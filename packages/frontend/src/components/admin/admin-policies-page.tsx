"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgePercent,
  BanknoteArrowDown,
  BanknoteArrowUp,
  CircleDollarSign,
  Landmark,
  ShieldCheck,
  TicketPercent,
} from "lucide-react";

import { ErrorState } from "@/components/error-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminDashboard } from "@/lib/shopping/hooks";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export function AdminPoliciesPage() {
  const dashboard = useAdminDashboard();

  if (dashboard.isError) {
    return (
      <ErrorState
        title="Admin policy board request failed"
        description="The policy board could not load market metadata. Retry after checking the administrator session."
        onRetry={() => dashboard.refetch()}
      />
    );
  }

  if (dashboard.isLoading || !dashboard.data) {
    return (
      <div className="grid gap-6">
        <Skeleton className="h-40 rounded-[28px]" />
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr),360px]">
          <Skeleton className="h-[640px] rounded-[28px]" />
          <Skeleton className="h-[640px] rounded-[28px]" />
        </div>
      </div>
    );
  }

  const { session, coupons, deposits, mileages, metrics, orders } = dashboard.data;
  if (!session.active) {
    return (
      <Card>
        <CardContent className="grid gap-4 p-8">
          <Badge className="w-fit">Admin policies</Badge>
          <h1 className="text-3xl font-semibold">Sign into the admin console first</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            The policy board is a governance-focused view of coupon and ledger metadata. Open
            the admin console, authenticate, then return here to review how discount and wallet
            rules fit together.
          </p>
          <div>
            <Button asChild>
              <Link href="/admin">
                Open admin console
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const publicCoupons = coupons.filter((coupon) => coupon.access === "public").length;
  const privateCoupons = coupons.length - publicCoupons;
  const incomeDeposits = deposits.filter((item) => item.direction === "income").length;
  const outcomeMileages = mileages.filter((item) => item.direction === "outcome").length;
  const policyMoments = coupons.slice(0, 3).map((coupon, index) => ({
    ...coupon,
    accent:
      index === 0
        ? "from-emerald-400/30 via-teal-500/15 to-transparent"
        : index === 1
          ? "from-amber-400/30 via-orange-500/15 to-transparent"
          : "from-rose-400/30 via-pink-500/15 to-transparent",
  }));
  const couponRows =
    coupons.length > 0
      ? coupons
      : [
          {
            id: "policy-template-public",
            name: "Starter free-shipping week",
            discountLabel: "15% off above KRW 100,000",
            openedAt: null,
            access: "public" as const,
          },
          {
            id: "policy-template-private",
            name: "VIP recovery offer",
            discountLabel: "KRW 20,000 targeted retention credit",
            openedAt: null,
            access: "private" as const,
          },
        ];
  const depositRows =
    deposits.length > 0
      ? deposits
      : [
          {
            id: "deposit-template-charge",
            source: "Manual charge",
            code: "manual_charge",
            direction: "income" as const,
            createdAt: null,
          },
          {
            id: "deposit-template-refund",
            source: "Refund rollback",
            code: "refund_rollback",
            direction: "outcome" as const,
            createdAt: null,
          },
        ];
  const mileageRows =
    mileages.length > 0
      ? mileages
      : [
          {
            id: "mileage-template-review",
            source: "Review reward",
            code: "review_reward",
            direction: "income" as const,
            createdAt: null,
            defaultValue: 3000,
          },
          {
            id: "mileage-template-recovery",
            source: "Service recovery",
            code: "service_recovery",
            direction: "income" as const,
            createdAt: null,
            defaultValue: 5000,
          },
        ];

  return (
    <div className="grid gap-6">
      <Card className="overflow-hidden border-none bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_35%),radial-gradient(circle_at_top_right,rgba(249,115,22,0.14),transparent_32%),linear-gradient(135deg,rgba(248,250,252,1),rgba(240,249,255,0.96))] shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
        <CardContent className="grid gap-8 p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <Badge className="w-fit bg-emerald-600 text-white hover:bg-emerald-600">
                Admin policy board
              </Badge>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
                Govern discounts, wallet rails, and commerce guardrails in one view
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-700">
                This page is tuned for policy review instead of generic admin CRUD. See which
                coupon programs are live, how wallet metadata is shaped, and what recent paid
                activity the current rulebook is influencing.
              </p>
            </div>
            <div className="grid min-w-[260px] gap-3 rounded-[28px] border border-slate-200 bg-white/70 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Control sheet</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-emerald-50 p-3">
                  <p className="text-slate-500">Public coupons</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-950">{publicCoupons}</p>
                </div>
                <div className="rounded-2xl bg-amber-50 p-3">
                  <p className="text-slate-500">Private coupons</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-950">{privateCoupons}</p>
                </div>
                <div className="rounded-2xl bg-sky-50 p-3">
                  <p className="text-slate-500">Wallet rails</p>
                  <p className="mt-1 text-lg font-semibold text-slate-950">
                    {deposits.length + mileages.length}
                  </p>
                </div>
                <div className="rounded-2xl bg-rose-50 p-3">
                  <p className="text-slate-500">Revenue touched</p>
                  <p className="mt-1 text-lg font-semibold text-slate-950">
                    {formatCurrency(metrics.revenue)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {policyMoments.map((coupon) => (
              <div
                key={coupon.id}
                className={`rounded-[28px] border border-white/70 bg-gradient-to-br p-5 ${coupon.accent}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-[0.22em] text-slate-500">
                      Coupon program
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-950">{coupon.name}</h2>
                  </div>
                  <Badge variant={coupon.access === "public" ? "default" : "secondary"}>
                    {coupon.access}
                  </Badge>
                </div>
                <div className="mt-5 grid gap-2 text-sm text-slate-700">
                  <p>{coupon.discountLabel}</p>
                  <p>Opened {formatDateTime(coupon.openedAt)}</p>
                  <p>Closed {formatDateTime(coupon.closedAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr),minmax(0,0.9fr)]">
        <Card className="border-border/70">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Policy matrix
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-[24px] border border-border/70 bg-muted/20 p-4">
                <div className="flex items-center gap-2">
                  <TicketPercent className="h-4 w-4 text-primary" />
                  <p className="font-medium">Discount stack</p>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {metrics.coupons} coupon policies are on file. {publicCoupons} are open to the
                  whole market, while {privateCoupons} stay targeted.
                </p>
              </div>
              <div className="rounded-[24px] border border-border/70 bg-muted/20 p-4">
                <div className="flex items-center gap-2">
                  <Landmark className="h-4 w-4 text-primary" />
                  <p className="font-medium">Ledger direction</p>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {incomeDeposits} deposit rails move money in, while {outcomeMileages} mileage
                  policies currently model outbound value.
                </p>
              </div>
              <div className="rounded-[24px] border border-border/70 bg-muted/20 p-4">
                <div className="flex items-center gap-2">
                  <CircleDollarSign className="h-4 w-4 text-primary" />
                  <p className="font-medium">Paid pressure</p>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {orders.length} paid orders are already reflecting the current rule set in the
                  operator workspace.
                </p>
              </div>
            </div>

            <div className="grid gap-3">
              {couponRows.map((coupon) => (
                <div
                  key={coupon.id}
                  className="grid gap-3 rounded-[24px] border border-border/70 bg-background p-4 md:grid-cols-[minmax(0,1fr),180px,180px]"
                >
                  <div>
                    <p className="font-semibold">{coupon.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{coupon.discountLabel}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Opened</p>
                    <p className="mt-1 font-medium text-foreground">
                      {coupon.openedAt ? formatDateTime(coupon.openedAt) : "Suggested template"}
                    </p>
                  </div>
                  <div className="flex items-start justify-between gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Access</p>
                      <p className="mt-1 font-medium text-foreground">{coupon.access}</p>
                    </div>
                    <Badge variant={coupon.access === "public" ? "default" : "secondary"}>
                      Active
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card className="border-border/70">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <BanknoteArrowUp className="h-5 w-5 text-primary" />
                Deposit rails
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {depositRows.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[24px] border border-border/70 bg-muted/30 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{item.source}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{item.code}</p>
                    </div>
                    <Badge variant={item.direction === "income" ? "default" : "secondary"}>
                      {item.direction}
                    </Badge>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {item.createdAt
                      ? `Registered ${formatDateTime(item.createdAt)}`
                      : "Recommended ledger rail for README-ready policy planning."}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/70">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <BanknoteArrowDown className="h-5 w-5 text-primary" />
                Mileage rails
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {mileageRows.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[24px] border border-border/70 bg-muted/30 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{item.source}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{item.code}</p>
                    </div>
                    <Badge variant={item.direction === "income" ? "default" : "secondary"}>
                      {item.direction}
                    </Badge>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Default value{" "}
                    {item.defaultValue === null ? "is variable" : formatCurrency(item.defaultValue)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/70">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <BadgePercent className="h-5 w-5 text-primary" />
                Governance note
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">
                This board is intentionally separate from the main admin console so README
                screenshots can show a real policy surface rather than the same dashboard under
                a second filename.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
