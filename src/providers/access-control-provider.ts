import type { AccessControlProvider } from "@refinedev/core";
import { getCurrentIdentity } from "@/lib/session";
import type { AdminRole } from "@/types/api";

export const ROLE_LABELS: Record<AdminRole | "USER", string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  CONTENT_EDITOR: "Content Editor",
  SUPPORT: "Support",
  ANALYST: "Analyst",
  USER: "User (Limited)",
};

type PermissionMap = Record<string, string[]>;

const PERMISSIONS: Record<AdminRole | "USER", PermissionMap> = {
  SUPER_ADMIN: { "*": ["*"] },
  ADMIN: {
    dashboard: ["list"],
    users: ["list", "show", "create", "edit", "delete"],
    mascots: ["list", "show", "create", "edit", "delete"],
    categories: ["list", "show", "create", "edit", "delete"],
    badges: ["list", "show", "create", "edit", "delete"],
    profile: ["show", "edit"],
  },
  CONTENT_EDITOR: {
    dashboard: ["list"],
    users: ["list", "show"],
    mascots: ["list", "show", "create", "edit"],
    categories: ["list", "show", "create", "edit", "delete"],
    badges: ["list", "show", "create", "edit", "delete"],
    profile: ["show", "edit"],
  },
  SUPPORT: {
    dashboard: ["list"],
    users: ["list", "show", "edit"],
    mascots: ["list", "show"],
    categories: ["list", "show"],
    badges: ["list", "show"],
    profile: ["show", "edit"],
  },
  ANALYST: {
    dashboard: ["list"],
    users: ["list"],
    mascots: ["list"],
    categories: ["list"],
    badges: ["list"],
    profile: ["show", "edit"],
  },
  USER: {
    profile: ["show", "edit"],
  },
};

export function hasPermission(
  role: (AdminRole | "USER") | undefined,
  resource: string,
  action: string,
): boolean {
  if (!role) return false;
  const rules = PERMISSIONS[role] ?? PERMISSIONS.USER;
  if (rules["*"]?.includes("*") || rules["*"]?.includes(action)) return true;
  return rules[resource]?.includes(action) ?? false;
}

export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action }) => {
    const role = getCurrentIdentity()?.role;

    if (hasPermission(role, resource ?? "", action)) {
      return { can: true };
    }

    return {
      can: false,
      reason: "You do not have permission to perform this action.",
    };
  },

  options: {
    buttons: {
      enableAccessControl: true,
      hideIfUnauthorized: false,
    },
  },
};
