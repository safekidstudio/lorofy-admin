import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreate, useUpdate } from "@refinedev/core";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BADGE_CATEGORIES,
  BADGE_PROGRESS_TYPES,
  type Badge,
} from "@/types/api";

const badgeSchema = z.object({
  id: z
    .string()
    .min(2, "ID must have at least 2 characters")
    .max(50, "Max 50 characters")
    .regex(/^[a-z0-9_-]+$/i, "Only letters, numbers, hyphens, and underscores")
    .trim(),
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Max 100 characters")
    .trim(),
  description: z.string().min(1, "Description is required").trim(),
  category: z.enum(BADGE_CATEGORIES),
  progressType: z.enum(BADGE_PROGRESS_TYPES),
  targetValue: z
    .number({ message: "Must be a valid number" })
    .int("Must be an integer")
    .min(0, "Cannot be negative"),
  unit: z
    .string()
    .min(1, "Unit is required")
    .max(30, "Max 30 characters")
    .trim(),
  iconName: z.string().max(50, "Max 50 characters").optional(),
  iconUrl: z.string().max(500, "Max 500 characters").optional(),
});

type BadgeFormValues = z.infer<typeof badgeSchema>;

interface BadgeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  badge?: Badge | null;
  onSuccess?: () => void;
}

export function BadgeDialog({
  open,
  onOpenChange,
  badge,
  onSuccess,
}: BadgeDialogProps) {
  const isEditing = Boolean(badge);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<BadgeFormValues>({
    resolver: zodResolver(badgeSchema),
    defaultValues: {
      id: "",
      title: "",
      description: "",
      category: "STREAK",
      progressType: "STREAK",
      targetValue: 7,
      unit: "days",
      iconName: "",
      iconUrl: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (badge) {
        reset({
          id: badge.id,
          title: badge.title,
          description: badge.description,
          category: badge.category,
          progressType: badge.progressType,
          targetValue: badge.targetValue,
          unit: badge.unit,
          iconName: badge.iconName ?? "",
          iconUrl: badge.iconUrl ?? "",
        });
      } else {
        reset({
          id: "",
          title: "",
          description: "",
          category: "STREAK",
          progressType: "STREAK",
          targetValue: 7,
          unit: "days",
          iconName: "",
          iconUrl: "",
        });
      }
    }
  }, [open, badge, reset]);

  const { mutate: createBadge, mutation: createMutation } =
    useCreate<Badge>();
  const { mutate: updateBadge, mutation: updateMutation } =
    useUpdate<Badge>();

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (values: BadgeFormValues) => {
    const payload = {
      id: values.id,
      title: values.title,
      description: values.description,
      category: values.category,
      progressType: values.progressType,
      targetValue: values.targetValue,
      unit: values.unit,
      iconName: values.iconName?.trim() || null,
      iconUrl: values.iconUrl?.trim() || null,
    };

    if (isEditing && badge) {
      updateBadge(
        {
          resource: "badges",
          id: badge.id,
          values: payload,
          successNotification: {
            message: `Badge "${values.title}" updated`,
            type: "success",
          },
        },
        {
          onSuccess: () => {
            onOpenChange(false);
            onSuccess?.();
          },
        }
      );
    } else {
      createBadge(
        {
          resource: "badges",
          values: payload,
          successNotification: {
            message: `Badge "${values.title}" created`,
            type: "success",
          },
        },
        {
          onSuccess: () => {
            onOpenChange(false);
            onSuccess?.();
          },
        }
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Badge" : "Create New Badge"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update badge criteria, category, and display metadata."
                : "Configure a new gamification achievement milestone."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="badge-id">
                  Identifier Code <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="badge-id"
                  placeholder="e.g. streak_7, focus_100h"
                  disabled={isEditing}
                  {...register("id")}
                />
                {errors.id && (
                  <p className="text-xs text-destructive">{errors.id.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="badge-title">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="badge-title"
                  placeholder="e.g. Week Warrior"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-xs text-destructive">
                    {errors.title.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="badge-desc">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="badge-desc"
                rows={2}
                placeholder="e.g. Maintain a 7-day focus streak without breaks."
                {...register("description")}
              />
              {errors.description && (
                <p className="text-xs text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Category</Label>
                <Controller
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="STREAK">Streak</SelectItem>
                        <SelectItem value="TIME">Focus Time</SelectItem>
                        <SelectItem value="SPECIAL">Special</SelectItem>
                        <SelectItem value="COMMUNITY">Community</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="grid gap-2">
                <Label>Progress Calculation</Label>
                <Controller
                  control={control}
                  name="progressType"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="STREAK">Streak (Consecutive)</SelectItem>
                        <SelectItem value="COUNT">Count (Occurrences)</SelectItem>
                        <SelectItem value="SUM">Sum (Accumulated)</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="badge-target">
                  Target Value <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="badge-target"
                  type="number"
                  placeholder="e.g. 7"
                  {...register("targetValue", { valueAsNumber: true })}
                />
                {errors.targetValue && (
                  <p className="text-xs text-destructive">
                    {errors.targetValue.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="badge-unit">
                  Unit Label <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="badge-unit"
                  placeholder="e.g. days, minutes, sessions"
                  {...register("unit")}
                />
                {errors.unit && (
                  <p className="text-xs text-destructive">
                    {errors.unit.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="badge-iconName">Icon Identifier</Label>
                <Input
                  id="badge-iconName"
                  placeholder="e.g. flame, medal, clock"
                  {...register("iconName")}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="badge-iconUrl">Badge Image URL</Label>
                <Input
                  id="badge-iconUrl"
                  placeholder="https://.../badge.png"
                  {...register("iconUrl")}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Saving..."
                : isEditing
                ? "Save Changes"
                : "Create Badge"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
