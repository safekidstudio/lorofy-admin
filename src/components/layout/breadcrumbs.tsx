import { Fragment } from "react";
import { Link, useLocation } from "react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  users: "Users",
  mascots: "Mascots",
  create: "Create",
  show: "Details",
  edit: "Edit",
  shop: "Shop",
  analytics: "Analytics",
  audit: "Audit Logs",
  settings: "Settings",
  login: "Sign In",
};

function isDynamicSegment(segment: string): boolean {
  return (
    segment.startsWith("usr_") ||
    segment.startsWith("mascot_") ||
    /^[0-9a-f]{8}-[0-9a-f-]{27,}$/i.test(segment)
  );
}

function labelFor(segment: string): string {
  return LABELS[segment] ?? segment;
}

export function AppBreadcrumbs() {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  const items = segments
    .map((segment, index) => ({
      segment,
      path: `/${segments.slice(0, index + 1).join("/")}`,
    }))
    .filter(({ segment }) => !isDynamicSegment(segment))
    .map(({ segment, path }, index, list) => ({
      label: labelFor(segment),
      path,
      isLast: index === list.length - 1,
    }));

  return (
    <Breadcrumb className="hidden md:block">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/dashboard">Lorofy</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {items.map((item) => (
          <Fragment key={item.path}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {item.isLast ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={item.path}>{item.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
