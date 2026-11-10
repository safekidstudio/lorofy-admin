import * as React from "react";
import { type BaseKey, type DeleteOneResponse, useDeleteButton } from "@refinedev/core";
import { Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/ui/hugeicon";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export interface DeleteButtonProps extends Omit<React.ComponentProps<typeof Button>, "id"> {
  resource?: string;
  id?: BaseKey;
  recordItemId?: BaseKey;
  dataProviderName?: string;
  meta?: Record<string, unknown>;
  accessControl?: {
    enabled?: boolean;
    hideIfUnauthorized?: boolean;
  };
  onSuccess?: (value: DeleteOneResponse) => void;
  confirmTitle?: string;
  confirmDescription?: string;
  confirmOkLabel?: string;
  confirmCancelLabel?: string;
  hideConfirmation?: boolean;
}

export const DeleteButton = React.forwardRef<
  React.ComponentRef<typeof Button>,
  DeleteButtonProps
>(
  (
    {
      resource,
      id,
      recordItemId,
      dataProviderName,
      meta,
      accessControl,
      onSuccess,
      confirmTitle: customConfirmTitle,
      confirmDescription = "Are you sure you want to delete this record? This action cannot be undone.",
      confirmOkLabel: customConfirmOkLabel,
      confirmCancelLabel: customConfirmCancelLabel,
      hideConfirmation = false,
      children,
      onClick,
      ...rest
    },
    ref
  ) => {
    const targetId = id ?? recordItemId;
    const {
      label,
      hidden,
      loading,
      disabled,
      confirmOkLabel: defaultConfirmOkLabel,
      cancelLabel: defaultCancelLabel,
      confirmTitle: defaultConfirmTitle,
      onConfirm,
    } = useDeleteButton({
      resource,
      id: targetId,
      dataProviderName,
      meta,
      accessControl,
      onSuccess,
    });

    const isDisabled = disabled || loading || rest.disabled;
    const isHidden = hidden || rest.hidden;

    if (isHidden) return null;

    const triggerButton = (
      <Button
        variant="destructive"
        size="sm"
        {...rest}
        ref={ref}
        disabled={isDisabled}
        onClick={(e) => {
          if (hideConfirmation) {
            onConfirm();
          }
          onClick?.(e);
        }}
      >
        {children ?? (
          <div className="flex items-center gap-1.5 font-medium">
            <HugeIcon icon={Delete02Icon} size={15} />
            <span>{label ?? "Delete"}</span>
          </div>
        )}
      </Button>
    );

    if (hideConfirmation) {
      return triggerButton;
    }

    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>{triggerButton}</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {customConfirmTitle ?? defaultConfirmTitle ?? "Are you sure?"}
            </AlertDialogTitle>
            <AlertDialogDescription>{confirmDescription}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {customConfirmCancelLabel ?? defaultCancelLabel ?? "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={onConfirm}
            >
              {customConfirmOkLabel ?? defaultConfirmOkLabel ?? "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
);

DeleteButton.displayName = "DeleteButton";
