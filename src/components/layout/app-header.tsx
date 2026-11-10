import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AppBreadcrumbs } from "./breadcrumbs";
import { NotificationCenter } from "@/components/notification-center";
import { ThemeCustomizer } from "@/components/theme-customizer";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-border/70 bg-background/80 px-3 backdrop-blur-md md:px-6">
      <SidebarTrigger className="-ml-1 rounded-full hover:bg-muted" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <AppBreadcrumbs />

      <div className="ml-auto flex items-center gap-1.5">
        <NotificationCenter />
        <ThemeCustomizer />
      </div>
    </header>
  );
}
