import type * as React from "react";
import { HugeIcon } from "@/components/ui/hugeicon";

export interface EmptyStateProps {
  icon: any;
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  children,
}: EmptyStateProps) {
  const isFunction = typeof Icon === "function";

  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-6 py-14 text-center">
      <div className="grid size-10 place-items-center rounded-full bg-muted text-muted-foreground">
        {isFunction ? <Icon className="size-5" /> : <HugeIcon icon={Icon} size={20} />}
      </div>
      <p className="text-sm font-medium">{title}</p>
      {description ? (
        <p className="max-w-sm text-xs text-muted-foreground">{description}</p>
      ) : null}
      {children}
    </div>
  );
}
