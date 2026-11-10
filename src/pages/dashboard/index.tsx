import { useCustom, useList } from "@refinedev/core";
import {
  ArrowUpRight,
  Clock3,
  type LucideIcon,
  Sparkles,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { Link } from "react-router";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { AccountStatusBadge, UserRoleBadge } from "@/components/badges";
import { PageHeader } from "@/components/page-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  formatCompactNumber,
  formatMinutes,
  formatNumber,
  initials,
} from "@/lib/format";
import type { AdminUser, DashboardStats } from "@/types/api";

interface StatCardProps {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
  loading?: boolean;
}

function StatCard({ label, value, hint, icon: Icon, loading }: StatCardProps) {
  return (
    <Card size="sm" className="gap-0">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardDescription>{label}</CardDescription>
          <span className="grid size-8 place-items-center rounded-lg bg-primary/8 text-primary">
            <Icon className="size-4" />
          </span>
        </div>
        <CardTitle className="text-2xl tabular-nums">
          {loading ? <Skeleton className="h-7 w-20" /> : value}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <Skeleton className="h-3 w-28" />
        ) : (
          <p className="text-xs text-muted-foreground">{hint}</p>
        )}
      </CardContent>
    </Card>
  );
}

function activityLabel(value: string): string {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return `${date.getDate()}/${date.getMonth() + 1}`;
}

export function DashboardPage() {
  const { query: statsQuery, result: statsResult } = useCustom<DashboardStats>({
    url: "/admin/stats",
    method: "get",
    queryOptions: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  });

  const stats = statsResult.data as DashboardStats | undefined;
  const statsLoading = statsQuery.isLoading;

  const { result: recentUsersResult, query: recentUsersQuery } =
    useList<AdminUser>({
      resource: "users",
      pagination: { pageSize: 5, currentPage: 1 },
      sorters: [{ field: "createdAt", order: "desc" }],
      queryOptions: { staleTime: 15_000 },
    });

  const recentUsers = recentUsersResult.data ?? [];
  const activity = stats?.activity ?? [];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Platform pulse and user engagement over the last 7 days."
        actions={
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground shadow-2xs">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            System Live
          </span>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Users"
          value={formatNumber(stats?.totalUsers)}
          hint="All registered platform accounts"
          icon={Users}
          loading={statsLoading}
        />
        <StatCard
          label="Active Users (7d)"
          value={formatNumber(stats?.activeUsers7d)}
          hint="Active session in past 7 days"
          icon={UserCheck}
          loading={statsLoading}
        />
        <StatCard
          label="New Users (7d)"
          value={formatNumber(stats?.newUsers7d)}
          hint="Profiles created recently"
          icon={UserPlus}
          loading={statsLoading}
        />
        <StatCard
          label="Published Mascots"
          value={`${formatNumber(stats?.activeMascots)}/${formatNumber(stats?.totalMascots)}`}
          hint="Live in mobile app catalog"
          icon={Sparkles}
          loading={statsLoading}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Card className="min-w-0">
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="grid gap-1">
                <CardTitle>14-Day Activity Trend</CardTitle>
                <CardDescription>
                  Daily active users and completed focus minutes.
                </CardDescription>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-(--chart-1)" />
                  Active Users
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-(--chart-2)" />
                  Focus Minutes
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : activity.length === 0 ? (
              <div className="grid h-64 place-items-center rounded-lg border border-dashed text-sm text-muted-foreground">
                No activity records found.
              </div>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={activity}
                    margin={{ top: 8, right: 8, left: -18, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="active-users-fill"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="var(--chart-1)"
                          stopOpacity={0.35}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--chart-1)"
                          stopOpacity={0.02}
                        />
                      </linearGradient>
                      <linearGradient
                        id="focus-minutes-fill"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="var(--chart-2)"
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--chart-2)"
                          stopOpacity={0.01}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      vertical={false}
                      stroke="var(--border)"
                      strokeDasharray="3 3"
                    />
                    <XAxis
                      dataKey="date"
                      tickFormatter={activityLabel}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                      minTickGap={18}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                      width={44}
                      tickFormatter={(value: number) =>
                        formatCompactNumber(value)
                      }
                    />
                    <RechartsTooltip
                      contentStyle={{
                        borderRadius: 10,
                        border: "1px solid var(--border)",
                        background: "var(--popover)",
                        color: "var(--popover-foreground)",
                        fontSize: 12,
                      }}
                      labelFormatter={(label) =>
                        `Date: ${activityLabel(String(label ?? ""))}`
                      }
                      formatter={(value, name) => {
                        const numeric = Number(value ?? 0);
                        return [
                          name === "focusMinutes"
                            ? formatMinutes(numeric)
                            : formatNumber(numeric),
                          name === "focusMinutes"
                            ? "Focus Time"
                            : "Active Users",
                        ];
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="activeUsers"
                      stroke="var(--chart-1)"
                      strokeWidth={2}
                      fill="url(#active-users-fill)"
                    />
                    <Area
                      type="monotone"
                      dataKey="focusMinutes"
                      stroke="var(--chart-2)"
                      strokeWidth={2}
                      fill="url(#focus-minutes-fill)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid content-start gap-4">
          <Card size="sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-1.5">
                  <Clock3 className="size-4 text-muted-foreground" />
                  Total Focus Time
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-36" />
              ) : (
                <p className="text-2xl font-semibold">
                  {formatMinutes(stats?.totalFocusMinutes)}
                </p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">
                Accumulated across all user focus sessions.
              </p>
            </CardContent>
          </Card>

          <Card className="min-w-0">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-2">
                <div className="grid gap-1">
                  <CardTitle>Recent Users</CardTitle>
                  <CardDescription>Latest 5 registered accounts</CardDescription>
                </div>
                <Link
                  to="/users"
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  View all
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="grid gap-1">
              {recentUsersQuery.isLoading ? (
                Array.from(
                  { length: 4 },
                  (_, index) => `recent-skeleton-${index}`,
                ).map((key) => (
                  <div key={key} className="flex items-center gap-2.5 py-1.5">
                    <Skeleton className="size-8 rounded-full" />
                    <div className="grid flex-1 gap-1">
                      <Skeleton className="h-3 w-32" />
                      <Skeleton className="h-2.5 w-24" />
                    </div>
                  </div>
                ))
              ) : recentUsers.length === 0 ? (
                <p className="py-6 text-center text-xs text-muted-foreground">
                  No users registered yet.
                </p>
              ) : (
                recentUsers.map((user) => (
                  <Link
                    key={user.id}
                    to={`/users/show/${user.id}`}
                    className="flex items-center gap-2.5 rounded-lg px-1.5 py-1.5 transition-colors hover:bg-muted"
                  >
                    <Avatar className="size-8">
                      <AvatarFallback className="bg-primary/10 text-[10px] font-semibold text-primary">
                        {initials(user.displayName ?? user.username)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid min-w-0 flex-1 gap-0.5">
                      <span className="truncate text-xs font-medium">
                        {user.displayName ?? user.username}
                      </span>
                      <span className="truncate text-[11px] text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <UserRoleBadge role={user.role} />
                      <AccountStatusBadge enabled={user.enabled} />
                    </div>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
