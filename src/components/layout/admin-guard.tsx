import type { ReactNode } from "react";
import { Outlet } from "react-router";
import { getCurrentIdentity } from "@/lib/session";
import { hasPermission } from "@/providers/access-control-provider";
import { AccessDeniedPage } from "@/pages/access-denied";

export function AdminGuard({
  resource = "dashboard",
  action = "list",
  children,
}: {
  resource?: string;
  action?: string;
  children?: ReactNode;
}) {
  const identity = getCurrentIdentity();
  const allowed = hasPermission(identity?.role, resource, action);

  if (!allowed) {
    return <AccessDeniedPage />;
  }

  return children ? <>{children}</> : <Outlet />;
}
