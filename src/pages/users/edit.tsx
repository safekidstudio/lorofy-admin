import { zodResolver } from "@hookform/resolvers/zod";
import type { HttpError } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { Loader2, Save, ShieldAlert } from "lucide-react";
import { useEffect } from "react";
import { Controller } from "react-hook-form";
import { useParams } from "react-router";
import { z } from "zod";
import { EditView } from "@/components/refine-ui";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import type { AdminUser } from "@/types/api";

const userFormSchema = z.object({
  displayName: z
    .string()
    .max(80, "Maximum 80 characters")
    .nullable()
    .optional(),
  username: z
    .string()
    .min(3, "Minimum 3 characters")
    .max(32, "Maximum 32 characters")
    .regex(
      /^[a-z0-9._-]+$/,
      "Only lowercase letters, numbers, dots, underscores, or hyphens allowed",
    ),
  email: z.string().min(1, "Please enter email").email("Invalid email address"),
  role: z.enum(["USER", "ADMIN"]),
  enabled: z.boolean(),
  countryCode: z.string().max(2, "Country code is 2 characters").nullable().optional(),
  countryName: z.string().max(80, "Maximum 80 characters").nullable().optional(),
  timezone: z.string().max(64, "Maximum 64 characters").nullable().optional(),
  goldCoins: z
    .number({ message: "Enter a valid coin amount" })
    .int("Must be an integer")
    .min(0, "Cannot be negative"),
  rankPoints: z
    .number({ message: "Enter a valid points amount" })
    .int("Must be an integer")
    .min(0, "Cannot be negative"),
});

type UserFormValues = z.infer<typeof userFormSchema>;

export function UserEditPage() {
  const { id } = useParams<{ id: string }>();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
    refineCore: { onFinish, formLoading, query },
  } = useForm<AdminUser, HttpError, UserFormValues>({
    refineCoreProps: {
      resource: "users",
      action: "edit",
      id,
      redirect: "list",
    },
    resolver: zodResolver(userFormSchema),
    warnWhenUnsavedChanges: true,
    defaultValues: {
      displayName: "",
      username: "",
      email: "",
      role: "USER",
      enabled: true,
      countryCode: "",
      countryName: "",
      timezone: "",
      goldCoins: 0,
      rankPoints: 0,
    },
  });

  useEffect(() => {
    if (query?.data?.data) {
      const u = query.data.data;
      reset({
        displayName: u.displayName ?? "",
        username: u.username ?? "",
        email: u.email ?? "",
        role: u.role ?? "USER",
        enabled: u.enabled ?? true,
        countryCode: u.countryCode ?? "",
        countryName: u.countryName ?? "",
        timezone: u.timezone ?? "",
        goldCoins: u.goldCoins ?? 0,
        rankPoints: u.rankPoints ?? 0,
      });
    }
  }, [query?.data?.data, reset]);

  const onSubmit = (values: UserFormValues) => onFinish(values);

  if (query?.isLoading) {
    return (
      <>
        <Skeleton className="h-9 w-48" />
        <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </>
    );
  }

  return (
    <EditView
      recordItemId={id}
      title="Edit User"
      description="Update profile metadata, assigned roles, and gamification balances."
      canDelete={false}
      headerActions={
        <Button
          type="submit"
          size="sm"
          form="user-edit-form"
          disabled={formLoading}
        >
          {formLoading ? <Loader2 className="animate-spin" /> : <Save />}
          {formLoading ? "Saving..." : "Save Changes"}
        </Button>
      }
    >
      <form
        id="user-edit-form"
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-4 xl:grid-cols-[1.6fr_1fr]"
        noValidate
      >
        <div className="grid content-start gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Public metadata visible across user profiles and rankings.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5 sm:col-span-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  placeholder="Alex Rivers"
                  aria-invalid={Boolean(errors.displayName)}
                  {...register("displayName")}
                />
                {errors.displayName ? (
                  <p className="text-xs text-destructive">
                    {errors.displayName.message}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="alex.rivers"
                  aria-invalid={Boolean(errors.username)}
                  {...register("username")}
                />
                {errors.username ? (
                  <p className="text-xs text-destructive">
                    {errors.username.message}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="alex@lorofy.app"
                  aria-invalid={Boolean(errors.email)}
                  {...register("email")}
                />
                {errors.email ? (
                  <p className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Regional &amp; Localization</CardTitle>
              <CardDescription>
                Used for timezone synchronization and regional metrics.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <div className="grid gap-1.5">
                <Label htmlFor="countryCode">Country Code</Label>
                <Input
                  id="countryCode"
                  placeholder="US"
                  maxLength={2}
                  aria-invalid={Boolean(errors.countryCode)}
                  {...register("countryCode")}
                />
                {errors.countryCode ? (
                  <p className="text-xs text-destructive">
                    {errors.countryCode.message}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-1.5 sm:col-span-2">
                <Label htmlFor="countryName">Country Name</Label>
                <Input
                  id="countryName"
                  placeholder="United States"
                  aria-invalid={Boolean(errors.countryName)}
                  {...register("countryName")}
                />
                {errors.countryName ? (
                  <p className="text-xs text-destructive">
                    {errors.countryName.message}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-1.5 sm:col-span-3">
                <Label htmlFor="timezone">Timezone (IANA)</Label>
                <Input
                  id="timezone"
                  placeholder="America/New_York"
                  aria-invalid={Boolean(errors.timezone)}
                  {...register("timezone")}
                />
                {errors.timezone ? (
                  <p className="text-xs text-destructive">
                    {errors.timezone.message}
                  </p>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gamification Balances</CardTitle>
              <CardDescription>
                Modifications directly affect in-app store purchasing power.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="goldCoins">Gold Coins</Label>
                <Input
                  id="goldCoins"
                  type="number"
                  min={0}
                  step={1}
                  aria-invalid={Boolean(errors.goldCoins)}
                  {...register("goldCoins", { valueAsNumber: true })}
                />
                {errors.goldCoins ? (
                  <p className="text-xs text-destructive">
                    {errors.goldCoins.message}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="rankPoints">Rank Points</Label>
                <Input
                  id="rankPoints"
                  type="number"
                  min={0}
                  step={1}
                  aria-invalid={Boolean(errors.rankPoints)}
                  {...register("rankPoints", { valueAsNumber: true })}
                />
                {errors.rankPoints ? (
                  <p className="text-xs text-destructive">
                    {errors.rankPoints.message}
                  </p>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid content-start gap-4">
          <Card size="sm">
            <CardHeader className="pb-2">
              <CardTitle>Permissions &amp; Status</CardTitle>
              <CardDescription>
                Role assignment and authentication controls.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-1.5">
                <Label>Platform Role</Label>
                <Controller
                  control={control}
                  name="role"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger aria-invalid={Boolean(errors.role)}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USER">User</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="flex items-start justify-between gap-3 rounded-lg border p-3">
                <div className="grid gap-0.5">
                  <span className="text-sm font-medium">
                    Account Active
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Turn off to suspend sign-in without deleting data.
                  </span>
                </div>
                <Controller
                  control={control}
                  name="enabled"
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-label="Account active toggle"
                    />
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card size="sm" className="border-amber-500/30 bg-amber-500/5">
            <CardContent className="flex gap-2.5">
              <ShieldAlert className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <div className="grid gap-1 text-xs leading-relaxed">
                <span className="font-medium text-amber-700 dark:text-amber-300">
                  Security Notice
                </span>
                <span className="text-muted-foreground">
                  Roles and permission policies are strictly enforced server-side
                  across all protected API routes.
                </span>
              </div>
            </CardContent>
          </Card>

          <Card size="sm">
            <CardHeader className="pb-1">
              <CardTitle className="text-sm">Account Identifier</CardTitle>
            </CardHeader>
            <CardContent>
              <code className="block overflow-x-auto rounded-md bg-muted px-2 py-1.5 font-mono text-[11px]">
                {id}
              </code>
            </CardContent>
          </Card>
        </div>
      </form>
    </EditView>
  );
}
