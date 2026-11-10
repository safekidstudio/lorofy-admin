import * as React from "react";
import { type BaseKey, useEditButton } from "@refinedev/core";
import { Edit02Icon } from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/ui/hugeicon";
import { Button } from "@/components/ui/button";

export interface EditButtonProps extends Omit<React.ComponentProps<typeof Button>, "id"> {
  resource?: string;
  id?: BaseKey;
  recordItemId?: BaseKey;
  accessControl?: {
    enabled?: boolean;
    hideIfUnauthorized?: boolean;
  };
  meta?: Record<string, unknown>;
}

export const EditButton = React.forwardRef<
  React.ComponentRef<typeof Button>,
  EditButtonProps
>(({ resource, id, recordItemId, accessControl, meta, children, onClick, ...rest }, ref) => {
  const targetId = id ?? recordItemId;
  const { hidden, disabled, LinkComponent, to, label } = useEditButton({
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
            <HugeIcon icon={Edit02Icon} size={15} />
            <span>{label ?? "Edit"}</span>
          </div>
        )}
      </LinkComponent>
    </Button>
  );
});

EditButton.displayName = "EditButton";
