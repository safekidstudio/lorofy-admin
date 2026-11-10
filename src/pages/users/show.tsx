import { useShow } from "@refinedev/core";
import {
  CalendarDays,
  Clock3,
  Coins,
  Flame,
  Gauge,
  Globe2,
  Mail,
  ShieldCheck,
  Sparkles,
  Timer,
  Trophy,
  UserRound,
} from "lucide-react";
import type { ReactNode } from "react";
import { useParams } from "react-router";
import { AccountStatusBadge, UserRoleBadge } from "@/components/badges";
import { EditButton, ListButton, ShowView } from "@/components/refine-ui";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  formatDate,
  formatDateTime,
  formatMinutes,
  formatNumber,
  initials,
} from "@/lib/format";
import { getCurrentIdentity } from "@/lib/session";
import { hasPermission } from "@/providers/access-control-provider";
import type { AdminUser } from "@/types/api";

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5 py-2">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div className="grid min-w-0 gap-0.5">
        <span className="text-[11px] text-muted-foreground">{label}</span>
        <span className="break-words text-sm font-medium">{value}</span>
      </div>
    </div>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border bg-muted/30 p-3">
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <Icon className="size-3.5" />
        {label}
      </div>
      <p className="mt-1.5 text-lg font-semibold tabular-nums">
        {value}
      </p>
    </div>
  );
}

export function UserShowPage() {
  const { id } = useParams<{ id: string }>();
  const { result: user, query } = useShow<AdminUser>({
    resource: "users",
    id,
  });

  const canEdit = hasPermission(getCurrentIdentity()?.role, "users", "edit");

  if (query.isLoading) {
    return (
      <>
        <Skeleton className="h-9 w-48" />
        <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="grid place-items-center gap-3 py-16 text-center">
          <UserRound className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            User profile does not exist or has been removed from the platform.
          </p>
          <ListButton resource="users">Back to Users</ListButton>
        </CardContent>
      </Card>
    );
  }

  return (
    <ShowView
      recordItemId={user.id}
      title={user.displayName ?? user.username}
      description={`User Profile · ${user.email}`}
      headerActions={
        canEdit ? <EditButton resource="users" id={user.id} /> : null
      }
    >
      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <div className="grid content-start gap-4">
          <Card>
            <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Avatar className="size-20">
                <AvatarFallback className="bg-primary/10 text-2xl font-semibold text-primary">
                  {initials(user.displayName ?? user.username)}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-semibold">
                    {user.displayName ?? user.username}
                  </h2>
                  <UserRoleBadge role={user.role} />
                  <AccountStatusBadge enabled={user.enabled} />
                </div>
                <p className="text-sm text-muted-foreground">
                  @{user.username} · {user.email}
                </p>
                <p className="text-xs text-muted-foreground">
                  Member since {formatDate(user.createdAt)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Gauge className="size-4 text-muted-foreground" />
                Focus & Gamification
              </CardTitle>
              <CardDescription>
                Progress metrics and streaks synced from the Lorofy client app.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              <MiniStat
                icon={Timer}
                label="Total Focus Time"
                value={formatMinutes(user.totalFocusMinutes)}
              />
              <MiniStat
                icon={Flame}
                label="Current Streak"
                value={`${formatNumber(user.currentStreak)} days`}
              />
              <MiniStat
                icon={Trophy}
                label="Longest Streak"
                value={`${formatNumber(user.longestStreak)} days`}
              />
              <MiniStat
                icon={Coins}
                label="Gold Coins"
                value={formatNumber(user.goldCoins)}
              />
              <MiniStat
                icon={Sparkles}
                label="Rank Points"
                value={formatNumber(user.rankPoints)}
              />
              <MiniStat icon={ShieldCheck} label="Account ID" value={user.id} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <UserRound className="size-4 text-muted-foreground" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-x-8 sm:grid-cols-2">
              <DetailRow
                icon={Mail}
                label="Email"
                value={
                  <a
                    href={`mailto:${user.email}`}
                    className="text-primary hover:underline"
                  >
                    {user.email}
                  </a>
                }
              />
              <DetailRow
                icon={UserRound}
                label="Username"
                value={`@${user.username}`}
              />
              <DetailRow
                icon={Globe2}
                label="Country"
                value={
                  user.countryName ??
                  user.countryCode ?? (
                    <span className="text-muted-foreground">Not provided</span>
                  )
                }
              />
              <DetailRow
                icon={Clock3}
                label="Timezone"
                value={
                  user.timezone ?? (
                    <span className="text-muted-foreground">Not provided</span>
                  )
                }
              />
              <DetailRow
                icon={CalendarDays}
                label="Registered Date"
                value={formatDateTime(user.createdAt)}
              />
              <DetailRow
                icon={CalendarDays}
                label="Last Updated"
                value={formatDateTime(user.updatedAt)}
              />
            </CardContent>
          </Card>
        </div>

        <div className="grid content-start gap-4">
          <Card size="sm">
            <CardHeader className="pb-1">
              <CardTitle>Account & Security</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">Platform Role</span>
                <UserRoleBadge role={user.role} />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">Status</span>
                <AccountStatusBadge enabled={user.enabled} />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">Last Login</span>
                <span className="text-xs font-medium">
                  {formatDateTime(user.lastLoginAt)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">Identifier</span>
                <Badge variant="outline" className="font-mono text-[10px]">
                  {user.id}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card size="sm" className="border-dashed">
            <CardHeader className="pb-1">
              <CardTitle className="text-sm">Operations Advisory</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-xs leading-relaxed text-muted-foreground">
              <p>
                Suspending an account restricts authentication while preserving all
                focus records, streaks, and unlocked mascots.
              </p>
              <p>
                Account modifications are automatically audited according to platform
                security protocols.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </ShowView>
  );
}
