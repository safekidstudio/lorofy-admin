import type { ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useTheme } from "@/providers/theme-provider";
import { cn } from "@/lib/utils";
import { AppHeader } from "./app-header";
import { AppSidebar } from "./app-sidebar";

export function AdminLayout({ children }: { children: ReactNode }) {
  const { contentWidth } = useTheme();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main
          className={cn(
            "flex flex-1 flex-col gap-5 p-4 md:p-6 transition-all duration-200",
            contentWidth === "boxed" ? "mx-auto w-full max-w-7xl" : "w-full",
          )}
        >
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
