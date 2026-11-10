import * as React from "react";
import { useListButton } from "@refinedev/core";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/ui/hugeicon";
import { Button } from "@/components/ui/button";

export interface ListButtonProps extends React.ComponentProps<typeof Button> {
  resource?: string;
  accessControl?: {
    enabled?: boolean;
    hideIfUnauthorized?: boolean;
  };
  meta?: Record<string, unknown>;
}

export const ListButton = React.forwardRef<
  React.ComponentRef<typeof Button>,
  ListButtonProps
>(({ resource, accessControl, meta, children, onClick, ...rest }, ref) => {
  const { hidden, disabled, LinkComponent, to, label } = useListButton({
    resource,
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
            <HugeIcon icon={ArrowLeft01Icon} size={15} />
            <span>{label ?? "Back"}</span>
          </div>
        )}
      </LinkComponent>
    </Button>
  );
});

ListButton.displayName = "ListButton";
