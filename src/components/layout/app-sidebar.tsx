import { useLogout, useMenu } from "@refinedev/core";
import { Link, useLocation } from "react-router";
import {
  Logout01Icon,
  SproutIcon,
  UnfoldMoreIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/ui/hugeicon";
import { useTheme } from "@/providers/theme-provider";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { getCurrentIdentity } from "@/lib/session";
import { initials } from "@/lib/format";
import { hasPermission, ROLE_LABELS } from "@/providers/access-control-provider";

export function AppSidebar() {
  const { menuItems, selectedKey } = useMenu();
  const { sidebarVariant, sidebarCollapsible, sidebarTheme } = useTheme();
  const location = useLocation();
  const pathname = location.pathname;
  const identity = getCurrentIdentity();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { isMobile, state } = useSidebar();

  const checkIsActive = (item: { key?: string; route?: string; name?: string }) => {
    if (selectedKey && (selectedKey === item.key || selectedKey === item.name || selectedKey === item.route)) {
      return true;
    }
    const route = item.route ?? (item.name ? `/${item.name}` : undefined);
    if (!route) return false;
    if (route === "/dashboard") {
      return pathname === "/dashboard" || pathname === "/";
    }
    return pathname === route || pathname.startsWith(`${route}/`);
  };

  const visibleMenuItems = menuItems.filter(
    (item) =>
      !item.meta?.hide && hasPermission(identity?.role, item.name, "list"),
  );

  return (
    <Sidebar
      collapsible={sidebarCollapsible}
      variant={sidebarVariant}
      className={cn(
        "transition-all duration-200",
        sidebarTheme === "dark" && "dark bg-sidebar text-sidebar-foreground border-sidebar-border",
      )}
    >
      <SidebarHeader className="border-b border-sidebar-border p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="group-data-[collapsible=icon]:justify-center"
            >
              <Link to="/dashboard">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
                  <HugeIcon icon={SproutIcon} size={16} />
                </div>
                <div className="flex flex-col text-left leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="text-sm font-semibold tracking-tight text-foreground">
                    Lorofy
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    Admin Console
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {visibleMenuItems.map((item) => {
                const isActive = checkIsActive(item);

                return (
                  <SidebarMenuItem key={item.key}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={typeof item.label === "string" ? item.label : undefined}
                    >
                      <Link to={item.route ?? "/dashboard"}>
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
              {visibleMenuItems.length === 0 ? (
                <div className="px-3 py-2 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
                  No administrative tools
                </div>
              ) : null}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  tooltip={identity?.username ?? "User Account"}
                >
                  <Avatar className="size-8 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-primary text-xs font-semibold text-primary-foreground">
                      {initials(identity?.username)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-medium text-foreground">
                      {identity?.username ?? "Admin"}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {identity?.email}
                    </span>
                  </div>
                  <HugeIcon
                    icon={UnfoldMoreIcon}
                    size={16}
                    className="ml-auto text-muted-foreground group-data-[collapsible=icon]:hidden"
                  />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 rounded-lg"
                side={isMobile ? "bottom" : state === "collapsed" ? "right" : "top"}
                align="start"
                sideOffset={8}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-2 py-2 text-left text-sm">
                    <Avatar className="size-8 rounded-lg">
                      <AvatarFallback className="rounded-lg bg-primary text-xs font-semibold text-primary-foreground">
                        {initials(identity?.username)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {identity?.username ?? "Admin"}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {identity?.email}
                      </span>
                    </div>
                  </div>
                  <div className="px-2 pb-1.5">
                    <span className="inline-block rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                      {identity?.role ? ROLE_LABELS[identity.role] : "—"}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center gap-2">
                    <HugeIcon icon={UserIcon} size={15} />
                    Profile Details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  disabled={isLoggingOut}
                  onClick={() => logout()}
                >
                  <HugeIcon icon={Logout01Icon} size={15} />
                  {isLoggingOut ? "Signing out..." : "Sign Out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
