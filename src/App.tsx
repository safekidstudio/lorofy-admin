import { Authenticated, Refine } from "@refinedev/core";
import routerProvider, {
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { APP_NAME } from "@/lib/env";
import { DashboardPage } from "@/pages/dashboard";
import { LoginPage } from "@/pages/login";
import { MascotCreatePage } from "@/pages/mascots/create";
import { MascotEditPage } from "@/pages/mascots/edit";
import { MascotListPage } from "@/pages/mascots/list";
import { MascotShowPage } from "@/pages/mascots/show";
import { CategoryListPage } from "@/pages/categories/list";
import { BadgeListPage } from "@/pages/badges/list";
import { ProfilePage } from "@/pages/profile";
import { AccessDeniedPage } from "@/pages/access-denied";
import { NotFoundPage } from "@/pages/not-found";
import { UserEditPage } from "@/pages/users/edit";
import { UserListPage } from "@/pages/users/list";
import { UserShowPage } from "@/pages/users/show";
import { AdminGuard } from "@/components/layout/admin-guard";
import { accessControlProvider } from "@/providers/access-control-provider";
import { authProvider } from "@/providers/auth-provider";
import { dataProvider } from "@/providers/data-provider";
import { notificationProvider } from "@/providers/notification-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import {
  Award01Icon,
  DashboardSquare01Icon,
  SparklesIcon,
  Tag01Icon,
  UserGroupIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/ui/hugeicon";

export function App() {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <BrowserRouter>
          <Refine
            dataProvider={dataProvider}
            authProvider={authProvider}
            accessControlProvider={accessControlProvider}
            notificationProvider={notificationProvider}
            routerProvider={routerProvider}
            resources={[
              {
                name: "dashboard",
                list: "/dashboard",
                meta: {
                  label: "Dashboard",
                  icon: <HugeIcon icon={DashboardSquare01Icon} size={16} />,
                },
              },
              {
                name: "mascots",
                list: "/mascots",
                create: "/mascots/create",
                show: "/mascots/show/:id",
                edit: "/mascots/edit/:id",
                meta: {
                  label: "Mascots",
                  icon: <HugeIcon icon={SparklesIcon} size={16} />,
                },
              },
              {
                name: "categories",
                list: "/categories",
                meta: {
                  label: "Categories",
                  icon: <HugeIcon icon={Tag01Icon} size={16} />,
                },
              },
              {
                name: "badges",
                list: "/badges",
                meta: {
                  label: "Badges",
                  icon: <HugeIcon icon={Award01Icon} size={16} />,
                },
              },
              {
                name: "profile",
                list: "/profile",
                meta: {
                  label: "My Profile",
                  icon: <HugeIcon icon={UserIcon} size={16} />,
                  hide: true,
                },
              },
              {
                name: "users",
                list: "/users",
                show: "/users/show/:id",
                edit: "/users/edit/:id",
                meta: {
                  label: "Users",
                  icon: <HugeIcon icon={UserGroupIcon} size={16} />,
                },
              },
            ]}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              title: { text: "Lorofy Admin" },
            }}
          >
            <Routes>
              <Route
                element={
                  <Authenticated key="auth-pages" fallback={<Outlet />}>
                    <NavigateToResource resource="dashboard" />
                  </Authenticated>
                }
              >
                <Route path="/login" element={<LoginPage />} />
              </Route>

              <Route
                element={
                  <Authenticated
                    key="authenticated"
                    fallback={<Navigate to="/login" replace />}
                  >
                    <AdminLayout>
                      <Outlet />
                    </AdminLayout>
                  </Authenticated>
                }
              >
                {/* Admin-only routes guarded by AdminGuard */}
                <Route element={<AdminGuard />}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/users" element={<UserListPage />} />
                  <Route path="/users/show/:id" element={<UserShowPage />} />
                  <Route path="/users/edit/:id" element={<UserEditPage />} />
                  <Route path="/mascots" element={<MascotListPage />} />
                  <Route path="/mascots/create" element={<MascotCreatePage />} />
                  <Route path="/mascots/show/:id" element={<MascotShowPage />} />
                  <Route path="/mascots/edit/:id" element={<MascotEditPage />} />
                  <Route path="/categories" element={<CategoryListPage />} />
                  <Route path="/badges" element={<BadgeListPage />} />
                </Route>

                {/* Profile is accessible to all authenticated users */}
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/access-denied" element={<AccessDeniedPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>

            <Toaster position="top-right" richColors closeButton />
            <UnsavedChangesNotifier />
            <DocumentTitleHandler
              handler={({ resource, action }) => {
                const label =
                  typeof resource?.meta?.label === "string"
                    ? resource.meta.label
                    : resource?.name;

                if (!label) return APP_NAME;
                if (action === "create") {
                  return `Create ${label} | ${APP_NAME}`;
                }
                if (action === "edit") {
                  return `Edit ${label} | ${APP_NAME}`;
                }
                if (action === "show") {
                  return `${label} Details | ${APP_NAME}`;
                }
                return `${label} | ${APP_NAME}`;
              }}
            />
          </Refine>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  );
}
