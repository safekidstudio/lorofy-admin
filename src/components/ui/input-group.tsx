import * as React from "react";
import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "@/components/ui/button";

export interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

export const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="input-group"
        className={cn(
          "relative flex h-11 w-full items-center rounded-xl border border-input bg-background dark:bg-input/20 px-3.5 shadow-xs transition-colors focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/25 overflow-hidden",
          className,
        )}
        {...props}
      />
    );
  },
);
InputGroup.displayName = "InputGroup";

export interface InputGroupInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const InputGroupInput = React.forwardRef<
  HTMLInputElement,
  InputGroupInputProps
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      data-slot="input-group-input"
      className={cn(
        "h-full w-full flex-1 border-0 bg-transparent px-2.5 py-2 text-sm md:text-base text-foreground outline-none placeholder:text-muted-foreground/70 focus-visible:outline-none shadow-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
});
InputGroupInput.displayName = "InputGroupInput";

export interface InputGroupAddonProps
  extends React.HTMLAttributes<HTMLDivElement> {
  align?: "inline-start" | "inline-end";
}

export const InputGroupAddon = React.forwardRef<
  HTMLDivElement,
  InputGroupAddonProps
>(({ className, align = "inline-start", ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="input-group-addon"
      className={cn(
        "flex h-full items-center text-muted-foreground shrink-0 select-none",
        align === "inline-end" ? "order-last pl-1 pr-0" : "order-first pr-1 pl-0",
        className,
      )}
      {...props}
    />
  );
});
InputGroupAddon.displayName = "InputGroupAddon";

export interface InputGroupButtonProps extends ButtonProps {}

export const InputGroupButton = React.forwardRef<
  HTMLButtonElement,
  InputGroupButtonProps
>(({ className, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      data-slot="input-group-button"
      className={cn(
        "h-8 w-8 rounded-lg p-0 text-muted-foreground hover:text-foreground hover:bg-muted/60",
        className,
      )}
      {...props}
    />
  );
});
InputGroupButton.displayName = "InputGroupButton";
