import * as React from "react";
import { type BaseKey, useShowButton } from "@refinedev/core";
import { ViewIcon } from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/ui/hugeicon";
import { Button } from "@/components/ui/button";

export interface ShowButtonProps extends Omit<React.ComponentProps<typeof Button>, "id"> {
  resource?: string;
  id?: BaseKey;
  recordItemId?: BaseKey;
  accessControl?: {
    enabled?: boolean;
    hideIfUnauthorized?: boolean;
  };
  meta?: Record<string, unknown>;
}

export const ShowButton = React.forwardRef<
  React.ComponentRef<typeof Button>,
  ShowButtonProps
>(({ resource, id, recordItemId, accessControl, meta, children, onClick, ...rest }, ref) => {
  const targetId = id ?? recordItemId;
  const { hidden, disabled, LinkComponent, to, label } = useShowButton({
    resource,
    id: targetId,
    accessControl,
    meta,
  });

  const isDisabled = disabled || rest.disabled;
  const isHidden = hidden || rest.hidden;

  if (isHidden) return null;

  return (
    <Button variant="outline" size="sm" {...rest} ref={ref} disabled={isDisabled} asChild>
      <LinkComponent
        to={to}
        replace={false}
        onClick={(e: React.PointerEvent<HTMLButtonElement>) => {
          if (isDisabled) {
            e.preventDefault();
            return;
          }
          if (onClick) {
            e.preventDefault();
            onClick(e);
          }
        }}
      >
        {children ?? (
          <div className="flex items-center gap-1.5 font-medium">
            <HugeIcon icon={ViewIcon} size={15} />
            <span>{label ?? "Show"}</span>
          </div>
        )}
      </LinkComponent>
    </Button>
  );
});

ShowButton.displayName = "ShowButton";
