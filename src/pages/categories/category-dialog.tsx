import { useEffect } from "react";
import { useForm } from "react-hook-form";
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
import type { FocusCategory } from "@/types/api";

const PRESET_COLORS = [
  "#10B981", // Emerald
  "#3B82F6", // Blue
  "#8B5CF6", // Violet
  "#F43F5E", // Rose
  "#F59E0B", // Amber
  "#06B6D4", // Cyan
  "#EC4899", // Pink
  "#64748B", // Slate
];

const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Max 50 characters")
    .trim(),
  iconName: z.string().max(50, "Max 50 characters").optional(),
  colorHex: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color (e.g. #10B981)")
    .or(z.literal(""))
    .optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: FocusCategory | null;
  onSuccess?: () => void;
}

export function CategoryDialog({
  open,
  onOpenChange,
  category,
  onSuccess,
}: CategoryDialogProps) {
  const isEditing = Boolean(category);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      iconName: "",
      colorHex: "#10B981",
    },
  });

  const selectedColor = watch("colorHex") || "#10B981";

  useEffect(() => {
    if (open) {
      if (category) {
        reset({
          name: category.name,
          iconName: category.iconName ?? "",
          colorHex: category.colorHex ?? "#10B981",
        });
      } else {
        reset({
          name: "",
          iconName: "",
          colorHex: "#10B981",
        });
      }
    }
  }, [open, category, reset]);

  const { mutate: createCategory, mutation: createMutation } =
    useCreate<FocusCategory>();
  const { mutate: updateCategory, mutation: updateMutation } =
    useUpdate<FocusCategory>();

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (values: CategoryFormValues) => {
    const payload = {
      name: values.name,
      iconName: values.iconName?.trim() || null,
      colorHex: values.colorHex?.trim() || null,
    };

    if (isEditing && category) {
      updateCategory(
        {
          resource: "categories",
          id: category.id,
          values: payload,
          successNotification: {
            message: `Category "${values.name}" updated`,
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
      createCategory(
        {
          resource: "categories",
          values: payload,
          successNotification: {
            message: `Category "${values.name}" created`,
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
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Category" : "New Focus Category"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update details for this focus category."
                : "Add a system default category available to all users."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="cat-name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="cat-name"
                placeholder="e.g. Deep Work, Coding, Reading"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cat-icon">Icon Identifier</Label>
              <Input
                id="cat-icon"
                placeholder="e.g. laptop, book, dumbbell, brain"
                {...register("iconName")}
              />
              <p className="text-[11px] text-muted-foreground">
                Icon symbol string resolved by client apps.
              </p>
              {errors.iconName && (
                <p className="text-xs text-destructive">
                  {errors.iconName.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Theme Color</Label>
              <div className="flex flex-wrap items-center gap-2">
                {PRESET_COLORS.map((hex) => (
                  <button
                    key={hex}
                    type="button"
                    onClick={() => setValue("colorHex", hex, { shouldValidate: true })}
                    className="relative h-7 w-7 rounded-full border border-border shadow-xs transition-transform hover:scale-110 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                    style={{ backgroundColor: hex }}
                    title={hex}
                  >
                    {selectedColor?.toLowerCase() === hex.toLowerCase() && (
                      <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold drop-shadow-xs">
                        ✓
                      </span>
                    )}
                  </button>
                ))}
                <div className="flex items-center gap-2 ml-1">
                  <input
                    type="color"
                    id="cat-color-picker"
                    value={selectedColor || "#10B981"}
                    onChange={(e) =>
                      setValue("colorHex", e.target.value, { shouldValidate: true })
                    }
                    className="h-7 w-7 cursor-pointer rounded-full border border-border bg-transparent p-0"
                  />
                  <Input
                    placeholder="#10B981"
                    className="w-24 h-7 text-xs font-mono"
                    {...register("colorHex")}
                  />
                </div>
              </div>
              {errors.colorHex && (
                <p className="text-xs text-destructive">
                  {errors.colorHex.message}
                </p>
              )}
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
                : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
