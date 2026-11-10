import * as React from "react";
import { Tick02Icon } from "@hugeicons/core-free-icons";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { HugeIcon } from "@/components/ui/hugeicon";
import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    data-slot="checkbox"
    className={cn(
      "peer size-4.5 shrink-0 rounded-[5px] border border-input bg-background shadow-xs transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary cursor-pointer flex items-center justify-center",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      data-slot="checkbox-indicator"
      className={cn("flex items-center justify-center text-current animate-in zoom-in-75 duration-100")}
    >
      <HugeIcon icon={Tick02Icon} size={13} strokeWidth={3} className="text-current" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = "Checkbox";

export { Checkbox };
