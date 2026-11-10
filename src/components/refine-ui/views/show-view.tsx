import * as React from "react";
import { type BaseKey, useParsed, useUserFriendlyName } from "@refinedev/core";
import { ListButton } from "../buttons/list";
import { EditButton } from "../buttons/edit";
import { RefreshButton } from "../buttons/refresh";
import { DeleteButton } from "../buttons/delete";
import { cn } from "@/lib/utils";

export interface ShowViewHeaderProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  recordItemId?: BaseKey;
  canEdit?: boolean;
  canDelete?: boolean;
  canRefresh?: boolean;
  className?: string;
}

export function ShowViewHeader({
  title,
  description,
  actions,
  recordItemId,
  canEdit = true,
  canDelete = false,
  canRefresh = true,
  className,
}: ShowViewHeaderProps) {
  const { resource, id } = useParsed();
  const getUserFriendlyName = useUserFriendlyName();
  const targetId = recordItemId ?? id;

  const defaultTitle = resource?.name
    ? `${getUserFriendlyName(resource.name, "singular")} Details`
    : "Details";

  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <ListButton />
        <div className="grid gap-1">
          <h1 className="text-xl font-semibold tracking-tight">{title ?? defaultTitle}</h1>
          {description && (
            <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {actions}
        {canEdit && targetId && <EditButton id={targetId} />}
        {canRefresh && <RefreshButton id={targetId} />}
        {canDelete && targetId && <DeleteButton id={targetId} />}
      </div>
    </div>
  );
}

export interface ShowViewProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  headerActions?: React.ReactNode;
  recordItemId?: BaseKey;
  canEdit?: boolean;
  canDelete?: boolean;
  canRefresh?: boolean;
  header?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function ShowView({
  title,
  description,
  headerActions,
  recordItemId,
  canEdit = true,
  canDelete = false,
  canRefresh = true,
  header,
  children,
  className,
}: ShowViewProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {header ?? (
        <ShowViewHeader
          title={title}
          description={description}
          actions={headerActions}
          recordItemId={recordItemId}
          canEdit={canEdit}
          canDelete={canDelete}
          canRefresh={canRefresh}
        />
      )}
      {children}
    </div>
  );
}
