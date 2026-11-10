import * as React from "react";
import { type BaseKey, useRefreshButton } from "@refinedev/core";
import { Refresh01Icon } from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/ui/hugeicon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface RefreshButtonProps extends Omit<React.ComponentProps<typeof Button>, "id"> {
  resource?: string;
  id?: BaseKey;
  recordItemId?: BaseKey;
  dataProviderName?: string;
  meta?: Record<string, unknown>;
}

export const RefreshButton = React.forwardRef<
  React.ComponentRef<typeof Button>,
  RefreshButtonProps
>(({ resource, id, recordItemId, dataProviderName, meta, children, onClick, className, ...rest }, ref) => {
  const targetId = id ?? recordItemId;
  const { onClick: handleRefresh, label, loading } = useRefreshButton({
    resource,
    id: targetId,
    dataProviderName,
    meta,
  });

  return (
    <Button
      variant="outline"
      size="sm"
      ref={ref}
      disabled={loading || rest.disabled}
      className={className}
      onClick={(e) => {
        handleRefresh();
        onClick?.(e);
      }}
      {...rest}
    >
      {children ?? (
        <div className="flex items-center gap-1.5 font-medium">
          <HugeIcon
            icon={Refresh01Icon}
            size={15}
            className={cn(loading && "animate-spin")}
          />
          <span>{label ?? "Refresh"}</span>
        </div>
      )}
    </Button>
  );
});

RefreshButton.displayName = "RefreshButton";
