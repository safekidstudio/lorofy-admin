import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Award01Icon,
  Clock01Icon,
  Coins01Icon,
  FireIcon,
  Globe02Icon,
  Mail01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/ui/hugeicon";
import { apiRequest } from "@/lib/api-client";
import { formatMinutes, formatNumber, initials } from "@/lib/format";
import { getCurrentIdentity, setSession, getSession } from "@/lib/session";
import { ROLE_LABELS } from "@/providers/access-control-provider";
import type { ProfileResponse } from "@/types/api";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

const profileSchema = z.object({
  displayName: z
    .string()
    .min(2, "Display name must be at least 2 characters")
    .max(30, "Max 30 characters")
    .trim(),
  timezone: z.string().max(50, "Max 50 characters").optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const COMMON_TIMEZONES = [
  "UTC",
  "Asia/Ho_Chi_Minh",
  "Asia/Bangkok",
  "Asia/Tokyo",
  "Asia/Singapore",
  "Europe/London",
  "Europe/Paris",
  "America/New_York",
  "America/Los_Angeles",
];

export function ProfilePage() {
  const identity = getCurrentIdentity();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: "",
      timezone: "UTC",
    },
  });

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await apiRequest<ProfileResponse>("/profiles/me");
      setProfile(data);
      reset({
        displayName: data.displayName ?? data.username,
        timezone: data.timezone ?? "UTC",
      });
    } catch {
      // Fallback from session identity if API isn't ready
      if (identity) {
        reset({
          displayName: identity.username,
          timezone: "Asia/Ho_Chi_Minh",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      setSaving(true);
      const updated = await apiRequest<ProfileResponse>("/profiles/me", {
        method: "PUT",
        body: {
          displayName: values.displayName.trim(),
          timezone: values.timezone?.trim() || null,
        },
      });
      setProfile(updated);
      toast.success("Profile updated successfully");

      // Update local session username / displayName if necessary
      const session = getSession();
      if (session) {
        setSession({
          ...session,
          identity: {
            ...session.identity,
            username: updated.username ?? session.identity.username,
          },
        });
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl leading-none tracking-wide md:text-4xl">Account Profile</h1>
        <p className="text-sm text-muted-foreground">
          View your gamification progress, active session credentials, and personal preferences.
        </p>
      </div>

      {/* Profile Overview Card */}
      <Card className="border-border/80 shadow-xs">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="size-16 rounded-full border-2 border-primary/15 shadow-sm">
                <AvatarFallback className="rounded-full bg-primary text-xl font-semibold text-primary-foreground">
                  {initials(identity?.username)}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-2xl tracking-wide">
                    {profile?.displayName ?? identity?.username ?? "User"}
                  </h2>
                  <Badge variant={identity?.role === "USER" ? "secondary" : "default"}>
                    {identity?.role ? ROLE_LABELS[identity.role] : "User"}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <HugeIcon icon={UserIcon} size={14} />
                    @{identity?.username ?? profile?.username}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <HugeIcon icon={Mail01Icon} size={14} />
                    {identity?.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <HugeIcon icon={Globe02Icon} size={14} />
                    {profile?.timezone ?? "UTC"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gamification Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Focus Time
            </CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <HugeIcon icon={Clock01Icon} size={16} />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <div className="text-2xl font-bold tracking-tight">
                {formatMinutes(profile?.totalFocusMinutes ?? 0)}
              </div>
            )}
            <p className="mt-1 text-xs text-muted-foreground">Total dedicated time</p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Current Streak
            </CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <HugeIcon icon={FireIcon} size={16} />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <div className="text-2xl font-bold tracking-tight">
                {profile?.currentStreak ?? 0}{" "}
                <span className="text-sm font-normal text-muted-foreground">days</span>
              </div>
            )}
            <p className="mt-1 text-xs text-muted-foreground">
              Longest streak: {profile?.longestStreak ?? 0} days
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Gold Coins
            </CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
              <HugeIcon icon={Coins01Icon} size={16} />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <div className="text-2xl font-bold tracking-tight">
                {formatNumber(profile?.goldCoins ?? 0)}
              </div>
            )}
            <p className="mt-1 text-xs text-muted-foreground">In-game currency</p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Rank Points
            </CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <HugeIcon icon={Award01Icon} size={16} />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <div className="text-2xl font-bold tracking-tight">
                {formatNumber(profile?.rankPoints ?? 0)}
              </div>
            )}
            <p className="mt-1 text-xs text-muted-foreground">Leaderboard score</p>
          </CardContent>
        </Card>
      </div>

      {/* Edit Profile Settings Card */}
      <Card className="border-border/80 shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Personal Settings</CardTitle>
          <CardDescription>
            Update your public display name and preferred timezone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl">
            <div className="grid gap-2">
              <Label htmlFor="prof-email">Email Address</Label>
              <Input
                id="prof-email"
                value={identity?.email ?? ""}
                disabled
                className="bg-muted text-muted-foreground"
              />
              <p className="text-[11px] text-muted-foreground">
                Email is tied to your authentication account and cannot be modified directly.
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="prof-username">Username</Label>
              <Input
                id="prof-username"
                value={identity?.username ?? ""}
                disabled
                className="bg-muted text-muted-foreground"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="prof-display">Display Name</Label>
              <Input
                id="prof-display"
                placeholder="Your preferred name"
                {...register("displayName")}
              />
              {errors.displayName && (
                <p className="text-xs text-destructive">{errors.displayName.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="prof-tz">Timezone</Label>
              <Input
                id="prof-tz"
                list="timezones-list"
                placeholder="e.g. Asia/Ho_Chi_Minh"
                {...register("timezone")}
              />
              <datalist id="timezones-list">
                {COMMON_TIMEZONES.map((tz) => (
                  <option key={tz} value={tz} />
                ))}
              </datalist>
              {errors.timezone && (
                <p className="text-xs text-destructive">{errors.timezone.message}</p>
              )}
            </div>

            <div className="pt-2">
              <Button type="submit" disabled={saving || loading}>
                {saving ? "Saving Changes..." : "Save Preferences"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
