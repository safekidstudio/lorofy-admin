import * as React from "react";
import { HugeiconsIcon, type HugeiconsProps } from "@hugeicons/react";
import { cn } from "@/lib/utils";

export interface HugeIconProps extends Omit<HugeiconsProps, "size"> {
  icon: any;
  size?: number | string;
  className?: string;
}

export const HugeIcon = React.forwardRef<SVGSVGElement, HugeIconProps>(
  ({ icon, size = 16, strokeWidth = 1.8, className, ...props }, ref) => {
    return (
      <HugeiconsIcon
        ref={ref}
        icon={icon}
        size={size}
        strokeWidth={strokeWidth}
        className={cn("shrink-0", className)}
        {...props}
      />
    );
  },
);

HugeIcon.displayName = "HugeIcon";
