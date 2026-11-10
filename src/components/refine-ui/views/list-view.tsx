import * as React from "react";
import { useParsed, useUserFriendlyName } from "@refinedev/core";
import { CreateButton } from "../buttons/create";
import { cn } from "@/lib/utils";

export interface ListViewHeaderProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  canCreate?: boolean;
  className?: string;
}

export function ListViewHeader({
  title,
  description,
  actions,
  canCreate = true,
  className,
}: ListViewHeaderProps) {
  const { resource } = useParsed();
  const getUserFriendlyName = useUserFriendlyName();

  const defaultTitle = resource?.name ? getUserFriendlyName(resource.name, "plural") : "";

  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4",
        className
      )}
    >
      <div className="grid gap-1">
        <h1 className="text-xl font-semibold tracking-tight">{title ?? defaultTitle}</h1>
        {description && (
          <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {actions}
        {canCreate && !actions && <CreateButton />}
      </div>
    </div>
  );
}

export interface ListViewProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  headerActions?: React.ReactNode;
  canCreate?: boolean;
  header?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function ListView({
  title,
  description,
  headerActions,
  canCreate = true,
  header,
  children,
  className,
}: ListViewProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {header ?? (
        <ListViewHeader
          title={title}
          description={description}
          actions={headerActions}
          canCreate={canCreate}
        />
      )}
      {children}
    </div>
  );
}
