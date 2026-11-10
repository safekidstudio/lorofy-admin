import { zodResolver } from "@hookform/resolvers/zod";
import type { HttpError } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { Loader2, Save, Sparkles } from "lucide-react";
import { useEffect } from "react";
import { Controller } from "react-hook-form";
import { useParams } from "react-router";
import { z } from "zod";
import { CreateView, EditView } from "@/components/refine-ui";
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
import { Textarea } from "@/components/ui/textarea";
import {
  MASCOT_CATEGORIES,
  MASCOT_RARITIES,
  MASCOT_UNLOCK_TYPES,
  type Mascot,
} from "@/types/api";

const mascotFormSchema = z.object({
  name: z
    .string()
    .min(1, "Please enter mascot name")
    .max(60, "Maximum 60 characters"),
  description: z.string().max(500, "Maximum 500 characters").nullable().optional(),
  category: z.enum(MASCOT_CATEGORIES),
  rarity: z.enum(MASCOT_RARITIES),
  unlockType: z.enum(MASCOT_UNLOCK_TYPES),
  costCoins: z
    .number({ message: "Enter a valid coin amount" })
    .int("Must be an integer")
    .min(0, "Cannot be negative"),
  costPoints: z
    .number({ message: "Enter a valid points amount" })
    .int("Must be an integer")
    .min(0, "Cannot be negative"),
  requiredStreakDays: z
    .number({ message: "Enter valid streak days" })
    .int("Must be an integer")
    .min(0, "Cannot be negative"),
  riveAssetPath: z.string().min(1, "Please enter Rive asset file path"),
  previewImageUrl: z
    .string()
    .refine(
      (value) => !value || /^https?:\/\/.+/i.test(value),
      "URL must start with http:// or https://",
    )
    .nullable()
    .optional(),
  active: z.boolean(),
  sortOrder: z
    .number({ message: "Enter valid sort order" })
    .int("Must be an integer")
    .min(0, "Cannot be negative"),
});

type MascotFormValues = z.infer<typeof mascotFormSchema>;

const CATEGORY_LABELS = {
  PLANT: "Plant",
  ANIMAL: "Animal",
  FANTASY: "Fantasy",
} as const;

const RARITY_LABELS = {
  COMMON: "Common",
  RARE: "Rare",
  EPIC: "Epic",
  LEGENDARY: "Legendary",
} as const;

const UNLOCK_LABELS = {
  FREE: "Free",
  COINS: "Gold Coins",
  POINTS: "Lorofy Points",
  STREAK_MILESTONE: "Streak Milestone",
} as const;

export function MascotFormPage({ mode }: { mode: "create" | "edit" }) {
  const { id: routeId } = useParams<{ id: string }>();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
    refineCore: { id, onFinish, formLoading, query },
  } = useForm<Mascot, HttpError, MascotFormValues>({
    refineCoreProps: {
      resource: "mascots",
      action: mode,
      id: mode === "edit" ? routeId : undefined,
      redirect: "list",
    },
    resolver: zodResolver(mascotFormSchema),
    warnWhenUnsavedChanges: true,
    defaultValues: {
      name: "",
      description: "",
      category: "ANIMAL",
      rarity: "COMMON",
      unlockType: "COINS",
      costCoins: 100,
      costPoints: 0,
      requiredStreakDays: 0,
      riveAssetPath: "/assets/mascots/",
      previewImageUrl: "",
      active: false,
      sortOrder: 10,
    },
  });

  const isEdit = mode === "edit";

  useEffect(() => {
    if (isEdit && query?.data?.data) {
      const data = query.data.data;
      reset({
        name: data.name ?? "",
        description: data.description ?? "",
        category: data.category ?? "ANIMAL",
        rarity: data.rarity ?? "COMMON",
        unlockType: data.unlockType ?? "COINS",
        costCoins: data.costCoins ?? 0,
        costPoints: data.costPoints ?? 0,
        requiredStreakDays: data.requiredStreakDays ?? 0,
        riveAssetPath: data.riveAssetPath ?? "",
        previewImageUrl: data.previewImageUrl ?? "",
        active: Boolean(data.active),
        sortOrder: data.sortOrder ?? 0,
      });
    }
  }, [isEdit, query?.data?.data, reset]);

  const onSubmit = (values: MascotFormValues) => onFinish(values);

  if (isEdit && query?.isLoading) {
    return (
      <>
        <Skeleton className="h-9 w-56" />
        <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </>
    );
  }

  const ViewComponent = isEdit ? EditView : CreateView;

  return (
    <ViewComponent
      recordItemId={id}
      title={isEdit ? "Edit Mascot" : "Create Mascot"}
      description={
        isEdit
          ? "Update mascot metadata, unlock requirements, and release status."
          : "Add a new companion mascot to the Lorofy catalog."
      }
      canDelete={false}
      headerActions={
        <Button
          type="submit"
          size="sm"
          form="mascot-form"
          disabled={formLoading}
        >
          {formLoading ? <Loader2 className="animate-spin" /> : <Save />}
          {formLoading
            ? "Saving..."
            : isEdit
              ? "Save Changes"
              : "Create Mascot"}
        </Button>
      }
    >
      <form
        id="mascot-form"
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-4 xl:grid-cols-[1.6fr_1fr]"
        noValidate
      >
        <div className="grid content-start gap-4">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>
                Public metadata visible to mobile app users.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5 sm:col-span-2">
                <Label htmlFor="name">Mascot Name</Label>
                <Input
                  id="name"
                  placeholder="Ember Fox"
                  aria-invalid={Boolean(errors.name)}
                  {...register("name")}
                />
                {errors.name ? (
                  <p className="text-xs text-destructive">
                    {errors.name.message}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-1.5 sm:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  placeholder="Brief backstory and companion personality..."
                  aria-invalid={Boolean(errors.description)}
                  {...register("description")}
                />
                {errors.description ? (
                  <p className="text-xs text-destructive">
                    {errors.description.message}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-1.5">
                <Label>Category</Label>
                <Controller
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger aria-invalid={Boolean(errors.category)}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MASCOT_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {CATEGORY_LABELS[category]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="grid gap-1.5">
                <Label>Rarity</Label>
                <Controller
                  control={control}
                  name="rarity"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger aria-invalid={Boolean(errors.rarity)}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MASCOT_RARITIES.map((rarity) => (
                          <SelectItem key={rarity} value={rarity}>
                            {RARITY_LABELS[rarity]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Unlock Requirement</CardTitle>
              <CardDescription>
                Only the field corresponding to the chosen unlock type will be used.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5 sm:col-span-2">
                <Label>Unlock Type</Label>
                <Controller
                  control={control}
                  name="unlockType"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger aria-invalid={Boolean(errors.unlockType)}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MASCOT_UNLOCK_TYPES.map((unlockType) => (
                          <SelectItem key={unlockType} value={unlockType}>
                            {UNLOCK_LABELS[unlockType]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="costCoins">Gold Coins Cost</Label>
                <Input
                  id="costCoins"
                  type="number"
                  min={0}
                  step={1}
                  aria-invalid={Boolean(errors.costCoins)}
                  {...register("costCoins", { valueAsNumber: true })}
                />
                {errors.costCoins ? (
                  <p className="text-xs text-destructive">
                    {errors.costCoins.message}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="costPoints">Lorofy Points Cost</Label>
                <Input
                  id="costPoints"
                  type="number"
                  min={0}
                  step={1}
                  aria-invalid={Boolean(errors.costPoints)}
                  {...register("costPoints", { valueAsNumber: true })}
                />
                {errors.costPoints ? (
                  <p className="text-xs text-destructive">
                    {errors.costPoints.message}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="requiredStreakDays">Required Streak (Days)</Label>
                <Input
                  id="requiredStreakDays"
                  type="number"
                  min={0}
                  step={1}
                  aria-invalid={Boolean(errors.requiredStreakDays)}
                  {...register("requiredStreakDays", {
                    valueAsNumber: true,
                  })}
                />
                {errors.requiredStreakDays ? (
                  <p className="text-xs text-destructive">
                    {errors.requiredStreakDays.message}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  min={0}
                  step={1}
                  aria-invalid={Boolean(errors.sortOrder)}
                  {...register("sortOrder", { valueAsNumber: true })}
                />
                {errors.sortOrder ? (
                  <p className="text-xs text-destructive">
                    {errors.sortOrder.message}
                  </p>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid content-start gap-4">
          <Card size="sm">
            <CardHeader className="pb-2">
              <CardTitle>Asset References</CardTitle>
              <CardDescription>
                Relative path in the mobile app public assets directory.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="riveAssetPath">Rive File Path</Label>
                <Input
                  id="riveAssetPath"
                  placeholder="/assets/mascots/ember-fox.riv"
                  className="font-mono text-xs"
                  aria-invalid={Boolean(errors.riveAssetPath)}
                  {...register("riveAssetPath")}
                />
                {errors.riveAssetPath ? (
                  <p className="text-xs text-destructive">
                    {errors.riveAssetPath.message}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="previewImageUrl">Preview Image URL</Label>
                <Input
                  id="previewImageUrl"
                  placeholder="https://cdn.lorofy.app/mascots/ember-fox.png"
                  className="text-xs"
                  aria-invalid={Boolean(errors.previewImageUrl)}
                  {...register("previewImageUrl")}
                />
                {errors.previewImageUrl ? (
                  <p className="text-xs text-destructive">
                    {errors.previewImageUrl.message}
                  </p>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <Card size="sm">
            <CardHeader className="pb-2">
              <CardTitle>Publishing</CardTitle>
              <CardDescription>
                Draft mascots will not be visible in client apps.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-start justify-between gap-3 rounded-lg border p-3">
                <div className="grid gap-0.5">
                  <span className="text-sm font-medium">Published</span>
                  <span className="text-xs text-muted-foreground">
                    Enable to make mascot available in the user catalog.
                  </span>
                </div>
                <Controller
                  control={control}
                  name="active"
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-label="Publish mascot"
                    />
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card size="sm" className="border-primary/20 bg-primary/4">
            <CardContent className="flex gap-2.5">
              <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
              <div className="grid gap-1 text-xs leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground">
                  Catalog Guidelines
                </span>
                <span>
                  Verify Rive animations and preview thumbnail prior to publishing.
                  Keep mascot names distinctive and memorable.
                </span>
              </div>
            </CardContent>
          </Card>

          {isEdit ? (
            <Card size="sm">
              <CardHeader className="pb-1">
                <CardTitle className="text-sm">Mascot Identifier</CardTitle>
              </CardHeader>
              <CardContent>
                <code className="block overflow-x-auto rounded-md bg-muted px-2 py-1.5 font-mono text-[11px]">
                  {id}
                </code>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </form>
    </ViewComponent>
  );
}
