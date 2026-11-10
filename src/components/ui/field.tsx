import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

export const FieldSet = React.forwardRef<
  HTMLFieldSetElement,
  React.FieldsetHTMLAttributes<HTMLFieldSetElement>
>(({ className, ...props }, ref) => {
  return <fieldset ref={ref} className={cn("border-0 p-0 m-0", className)} {...props} />;
});
FieldSet.displayName = "FieldSet";

export const FieldGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("space-y-4", className)} {...props} />;
});
FieldGroup.displayName = "FieldGroup";

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "vertical" | "horizontal";
}

export const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  ({ className, orientation = "vertical", ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="field"
        className={cn(
          orientation === "horizontal"
            ? "flex items-center gap-2 space-y-0"
            : "grid gap-2",
          className,
        )}
        {...props}
      />
    );
  },
);
Field.displayName = "Field";

export interface FieldLabelProps extends React.ComponentProps<typeof Label> {}

export const FieldLabel = React.forwardRef<HTMLLabelElement, FieldLabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <Label
        ref={ref}
        className={cn("text-sm font-medium text-foreground tracking-tight", className)}
        {...props}
      />
    );
  },
);
FieldLabel.displayName = "FieldLabel";

export interface FieldErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
  errors?: Array<{ message?: string } | undefined>;
}

export const FieldError = React.forwardRef<
  HTMLParagraphElement,
  FieldErrorProps
>(({ className, errors, children, ...props }, ref) => {
  const message = errors?.[0]?.message ?? children;
  if (!message) return null;

  return (
    <p
      ref={ref}
      data-slot="field-error"
      className={cn("text-xs font-medium text-destructive mt-1", className)}
      {...props}
    >
      {message}
    </p>
  );
});
FieldError.displayName = "FieldError";
