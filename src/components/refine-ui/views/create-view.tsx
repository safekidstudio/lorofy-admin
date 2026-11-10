import * as React from "react";
import { useParsed, useUserFriendlyName } from "@refinedev/core";
import { ListButton } from "../buttons/list";
import { cn } from "@/lib/utils";

export interface CreateViewHeaderProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function CreateViewHeader({
  title,
  description,
  actions,
  className,
}: CreateViewHeaderProps) {
  const { resource } = useParsed();
  const getUserFriendlyName = useUserFriendlyName();

  const defaultTitle = resource?.name
    ? `Create ${getUserFriendlyName(resource.name, "singular")}`
    : "Create";

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
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export interface CreateViewProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  headerActions?: React.ReactNode;
  header?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function CreateView({
  title,
  description,
  headerActions,
  header,
  children,
  className,
}: CreateViewProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {header ?? (
        <CreateViewHeader
          title={title}
          description={description}
          actions={headerActions}
        />
      )}
      {children}
    </div>
  );
}
