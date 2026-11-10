import { useDelete, useUpdate } from "@refinedev/core";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Award01Icon,
  Delete02Icon,
  Edit02Icon,
  LockKeyholeIcon,
  LockKeyholeOpenIcon,
  MoreHorizontalIcon,
  SparklesIcon,
  Tag01Icon,
  UserGroupIcon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/ui/hugeicon";
import { useState } from "react";
import { Link } from "react-router";
import {
  AccountStatusBadge,
  ActiveBadge,
  BadgeCategoryBadge,
  BadgeProgressTypeBadge,
  CategoryTypeBadge,
  MascotCategoryBadge,
  MascotRarityBadge,
  UNLOCK_LABELS,
  UserRoleBadge,
} from "@/components/badges";
import { MascotThumb } from "@/components/mascot-thumb";
import { DataTableSorter } from "../data-table/data-table-sorter";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  formatDate,
  formatMinutes,
  formatNumber,
  initials,
} from "@/lib/format";
import { getCurrentIdentity } from "@/lib/session";
import { hasPermission } from "@/providers/access-control-provider";
import type { AdminUser, Badge, FocusCategory, Mascot } from "@/types/api";
import { CategoryDialog } from "@/pages/categories/category-dialog";
import { BadgeDialog } from "@/pages/badges/badge-dialog";
import type { ResourceSchema } from "./types";

function unlockDetail(mascot: Mascot): string {
  switch (mascot.unlockType) {
    case "FREE":
      return "Free";
    case "COINS":
      return `${formatNumber(mascot.costCoins)} coins`;
    case "POINTS":
      return `${formatNumber(mascot.costPoints)} pts`;
    case "STREAK_MILESTONE":
      return `${formatNumber(mascot.requiredStreakDays)}-day streak`;
    default:
      return "—";
  }
}

function UserRowActions({ user }: { user: AdminUser }) {
  const role = getCurrentIdentity()?.role;
  const canEdit = hasPermission(role, "users", "edit");
  const canDelete = hasPermission(role, "users", "delete");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { mutate: updateUser, mutation: updateMutation } =
    useUpdate<AdminUser>();
  const { mutate: deleteUser, mutation: deleteMutation } =
    useDelete<AdminUser>();
  const isUpdating = updateMutation.isPending;
  const isDeleting = deleteMutation.isPending;

  if (!canEdit && !canDelete) return null;

  const toggleEnabled = () => {
    updateUser({
      resource: "users",
      id: user.id,
      values: { enabled: !user.enabled },
      successNotification: {
        message: user.enabled
          ? "User account suspended"
          : "User account activated",
        type: "success",
      },
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Actions for ${user.username}`}
          >
            <HugeIcon icon={MoreHorizontalIcon} size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem asChild>
            <Link to={`/users/show/${user.id}`}>
              <HugeIcon icon={ViewIcon} size={15} />
              View Profile
            </Link>
          </DropdownMenuItem>
          {canEdit ? (
            <DropdownMenuItem asChild>
              <Link to={`/users/edit/${user.id}`}>
                <HugeIcon icon={Edit02Icon} size={15} />
                Edit
              </Link>
            </DropdownMenuItem>
          ) : null}
          {canEdit ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled={isUpdating} onClick={toggleEnabled}>
                {user.enabled ? (
                  <HugeIcon icon={LockKeyholeIcon} size={15} />
                ) : (
                  <HugeIcon icon={LockKeyholeOpenIcon} size={15} />
                )}
                {user.enabled ? "Suspend Account" : "Activate Account"}
              </DropdownMenuItem>
            </>
          ) : null}
          {canDelete ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setConfirmOpen(true)}
              >
                <HugeIcon icon={Delete02Icon} size={15} />
                Delete Profile
              </DropdownMenuItem>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive">
              <HugeIcon icon={Delete02Icon} size={20} />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete user profile?</AlertDialogTitle>
            <AlertDialogDescription>
              The profile for <strong>{user.displayName ?? user.username}</strong> will
              be removed from the system. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeleting}
              onClick={() =>
                deleteUser({
                  resource: "users",
                  id: user.id,
                  successNotification: {
                    message: "User profile deleted",
                    type: "success",
                  },
                })
              }
            >
              {isDeleting ? "Deleting..." : "Delete Profile"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function MascotRowActions({ mascot }: { mascot: Mascot }) {
  const role = getCurrentIdentity()?.role;
  const canEdit = hasPermission(role, "mascots", "edit");
  const canDelete = hasPermission(role, "mascots", "delete");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { mutate: updateMascot, mutation: updateMutation } =
    useUpdate<Mascot>();
  const { mutate: deleteMascot, mutation: deleteMutation } =
    useDelete<Mascot>();
  const isUpdating = updateMutation.isPending;
  const isDeleting = deleteMutation.isPending;

  if (!canEdit && !canDelete) return null;

  const toggleActive = () => {
    updateMascot({
      resource: "mascots",
      id: mascot.id,
      values: { active: !mascot.active },
      successNotification: {
        message: mascot.active
          ? "Mascot marked as draft"
          : "Mascot published and active",
        type: "success",
      },
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Actions for ${mascot.name}`}
          >
            <HugeIcon icon={MoreHorizontalIcon} size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem asChild>
            <Link to={`/mascots/show/${mascot.id}`}>
              <HugeIcon icon={ViewIcon} size={15} />
              View Details
            </Link>
          </DropdownMenuItem>
          {canEdit ? (
            <DropdownMenuItem asChild>
              <Link to={`/mascots/edit/${mascot.id}`}>
                <HugeIcon icon={Edit02Icon} size={15} />
                Edit
              </Link>
            </DropdownMenuItem>
          ) : null}
          {canEdit ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled={isUpdating} onClick={toggleActive}>
                <HugeIcon icon={SparklesIcon} size={15} />
                {mascot.active ? "Unpublish (Draft)" : "Publish (Active)"}
              </DropdownMenuItem>
            </>
          ) : null}
          {canDelete ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setConfirmOpen(true)}
              >
                <HugeIcon icon={Delete02Icon} size={15} />
                Delete Mascot
              </DropdownMenuItem>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive">
              <HugeIcon icon={Delete02Icon} size={20} />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete mascot?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{mascot.name}</strong> will be permanently deleted from the
              collection. Users who already own this mascot may be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeleting}
              onClick={() =>
                deleteMascot({
                  resource: "mascots",
                  id: mascot.id,
                  successNotification: {
                    message: "Mascot deleted",
                    type: "success",
                  },
                })
              }
            >
              {isDeleting ? "Deleting..." : "Delete Mascot"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export const userColumns: ColumnDef<AdminUser>[] = [
  {
    id: "username",
    accessorKey: "username",
    header: ({ column }) => <DataTableSorter column={column} title="User" />,
    cell: ({ row }) => {
      const user = row.original;
      return (
        <Link
          to={`/users/show/${user.id}`}
          className="flex items-center gap-2.5"
        >
          <Avatar className="size-9">
            <AvatarFallback className="bg-primary/10 text-[10px] font-semibold text-primary">
              {initials(user.displayName ?? user.username)}
            </AvatarFallback>
          </Avatar>
          <div className="grid min-w-0 gap-0.5">
            <span className="truncate text-sm font-medium hover:underline">
              {user.displayName ?? user.username}
            </span>
            <span className="truncate text-[11px] text-muted-foreground">
              {user.email}
            </span>
          </div>
        </Link>
      );
    },
  },
  {
    id: "role",
    accessorKey: "role",
    header: "Role",
    enableSorting: false,
    cell: ({ row }) => <UserRoleBadge role={row.original.role} />,
  },
  {
    id: "enabled",
    accessorKey: "enabled",
    header: "Status",
    enableSorting: false,
    cell: ({ row }) => <AccountStatusBadge enabled={row.original.enabled} />,
  },
  {
    id: "totalFocusMinutes",
    accessorKey: "totalFocusMinutes",
    header: ({ column }) => <DataTableSorter column={column} title="Focus Time" />,
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {formatMinutes(row.original.totalFocusMinutes)}
      </span>
    ),
  },
  {
    id: "goldCoins",
    accessorKey: "goldCoins",
    header: ({ column }) => <DataTableSorter column={column} title="Gold Coins" />,
    cell: ({ row }) => (
      <span className="text-xs tabular-nums">
        {formatNumber(row.original.goldCoins)}
      </span>
    ),
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableSorter column={column} title="Joined" />,
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {formatDate(row.original.createdAt)}
      </span>
    ),
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    enableSorting: false,
    cell: ({ row }) => <UserRowActions user={row.original} />,
  },
];

export const mascotColumns: ColumnDef<Mascot>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }) => <DataTableSorter column={column} title="Mascot" />,
    cell: ({ row }) => {
      const mascot = row.original;
      return (
        <Link
          to={`/mascots/show/${mascot.id}`}
          className="flex items-center gap-2.5"
        >
          <MascotThumb
            name={mascot.name}
            category={mascot.category}
            imageUrl={mascot.previewImageUrl}
          />
          <div className="grid min-w-0 gap-0.5">
            <span className="truncate text-sm font-medium hover:underline">
              {mascot.name}
            </span>
            <span className="truncate font-mono text-[10px] text-muted-foreground">
              {mascot.id}
            </span>
          </div>
        </Link>
      );
    },
  },
  {
    id: "category",
    accessorKey: "category",
    header: "Category",
    enableSorting: false,
    cell: ({ row }) => <MascotCategoryBadge category={row.original.category} />,
  },
  {
    id: "rarity",
    accessorKey: "rarity",
    header: ({ column }) => <DataTableSorter column={column} title="Rarity" />,
    cell: ({ row }) => <MascotRarityBadge rarity={row.original.rarity} />,
  },
  {
    id: "unlockType",
    accessorKey: "unlockType",
    header: "Unlock",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="grid gap-0.5">
        <span className="text-xs font-medium">
          {UNLOCK_LABELS[row.original.unlockType]}
        </span>
        <span className="text-[11px] text-muted-foreground">
          {unlockDetail(row.original)}
        </span>
      </div>
    ),
  },
  {
    id: "ownedCount",
    accessorKey: "ownedCount",
    header: "Owners",
    enableSorting: false,
    cell: ({ row }) => (
      <span className="text-xs tabular-nums text-muted-foreground">
        {formatNumber(row.original.ownedCount ?? 0)}
      </span>
    ),
  },
  {
    id: "active",
    accessorKey: "active",
    header: "Status",
    enableSorting: false,
    cell: ({ row }) => <ActiveBadge active={row.original.active} />,
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    enableSorting: false,
    cell: ({ row }) => <MascotRowActions mascot={row.original} />,
  },
];

export const userResourceSchema: ResourceSchema<AdminUser> = {
  name: "users",
  initialSort: [{ field: "createdAt", order: "desc" }],
  search: {
    placeholder: "Search by name, email, or username...",
    field: "q",
  },
  filters: [
    {
      field: "role",
      label: "Role",
      options: [
        { label: "All Roles", value: "all" },
        { label: "User", value: "USER" },
        { label: "Admin", value: "ADMIN" },
      ],
    },
    {
      field: "enabled",
      label: "Status",
      options: [
        { label: "All Statuses", value: "all" },
        { label: "Active", value: "active", mappedValue: true },
        { label: "Suspended", value: "locked", mappedValue: false },
      ],
    },
  ],
  columns: userColumns,
  emptyState: {
    icon: UserGroupIcon,
    title: "No users found",
    description: "Try resetting filters or searching with a different term.",
  },
};

export const mascotResourceSchema: ResourceSchema<Mascot> = {
  name: "mascots",
  initialSort: [{ field: "sortOrder", order: "asc" }],
  search: {
    placeholder: "Search mascots...",
    field: "q",
  },
  filters: [
    {
      field: "category",
      label: "Category",
      options: [
        { label: "All Categories", value: "all" },
        { label: "Animal", value: "ANIMAL" },
        { label: "Robot", value: "ROBOT" },
        { label: "Mythical", value: "MYTHICAL" },
        { label: "Special", value: "SPECIAL" },
      ],
    },
    {
      field: "rarity",
      label: "Rarity",
      options: [
        { label: "All Rarities", value: "all" },
        { label: "Common", value: "COMMON" },
        { label: "Rare", value: "RARE" },
        { label: "Epic", value: "EPIC" },
        { label: "Legendary", value: "LEGENDARY" },
      ],
    },
    {
      field: "active",
      label: "Status",
      options: [
        { label: "All Statuses", value: "all" },
        { label: "Active", value: "active", mappedValue: true },
        { label: "Draft", value: "draft", mappedValue: false },
      ],
    },
  ],
  columns: mascotColumns,
  emptyState: {
    icon: SparklesIcon,
    title: "No mascots found",
    description: "Try resetting filters or searching with a different term.",
  },
};

function CategoryRowActions({ category }: { category: FocusCategory }) {
  const role = getCurrentIdentity()?.role;
  const canEdit = hasPermission(role, "categories", "edit");
  const canDelete = hasPermission(role, "categories", "delete");
  const [editOpen, setEditDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { mutate: deleteCategory, mutation: deleteMutation } =
    useDelete<FocusCategory>();
  const isDeleting = deleteMutation.isPending;

  if (!canEdit && !canDelete) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Actions for ${category.name}`}
          >
            <HugeIcon icon={MoreHorizontalIcon} size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          {canEdit ? (
            <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
              <HugeIcon icon={Edit02Icon} size={15} />
              Edit
            </DropdownMenuItem>
          ) : null}
          {canDelete ? (
            <>
              {canEdit && <DropdownMenuSeparator />}
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setConfirmOpen(true)}
              >
                <HugeIcon icon={Delete02Icon} size={15} />
                Delete
              </DropdownMenuItem>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>

      <CategoryDialog
        open={editOpen}
        onOpenChange={setEditDialogOpen}
        category={category}
      />

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia>
              <HugeIcon
                icon={Delete02Icon}
                size={20}
                className="text-destructive"
              />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete category?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete category{" "}
              <strong className="text-foreground">{category.name}</strong>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeleting}
              onClick={() => {
                deleteCategory(
                  {
                    resource: "categories",
                    id: category.id,
                    successNotification: {
                      message: `Category "${category.name}" deleted`,
                      type: "success",
                    },
                  },
                  {
                    onSettled: () => setConfirmOpen(false),
                  }
                );
              }}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export const categoryColumns: ColumnDef<FocusCategory>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableSorter column={column} title="Category Name" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2.5">
        <span
          className="inline-block h-3.5 w-3.5 shrink-0 rounded-full border border-border shadow-xs"
          style={{ backgroundColor: row.original.colorHex || "#10B981" }}
        />
        <span className="font-medium text-foreground">{row.original.name}</span>
      </div>
    ),
  },
  {
    id: "iconName",
    accessorKey: "iconName",
    header: "Icon Name",
    enableSorting: false,
    cell: ({ row }) =>
      row.original.iconName ? (
        <code className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground font-mono">
          {row.original.iconName}
        </code>
      ) : (
        <span className="text-xs text-muted-foreground">—</span>
      ),
  },
  {
    id: "colorHex",
    accessorKey: "colorHex",
    header: "Color Hex",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5 font-mono text-xs">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: row.original.colorHex || "#ccc" }}
        />
        <span>{row.original.colorHex ?? "—"}</span>
      </div>
    ),
  },
  {
    id: "isSystem",
    accessorKey: "isSystem",
    header: "Type",
    enableSorting: false,
    cell: ({ row }) => (
      <CategoryTypeBadge isSystem={row.original.isSystem} />
    ),
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableSorter column={column} title="Created" />
    ),
    cell: ({ row }) => (
      <span className="text-xs tabular-nums text-muted-foreground">
        {formatDate(row.original.createdAt)}
      </span>
    ),
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    enableSorting: false,
    cell: ({ row }) => <CategoryRowActions category={row.original} />,
  },
];

export const categoryResourceSchema: ResourceSchema<FocusCategory> = {
  name: "categories",
  initialSort: [{ field: "createdAt", order: "desc" }],
  search: {
    placeholder: "Search categories by name...",
    field: "q",
  },
  filters: [
    {
      field: "isSystem",
      label: "Type",
      options: [
        { label: "All Types", value: "all" },
        { label: "System Default", value: "system", mappedValue: true },
        { label: "User Custom", value: "custom", mappedValue: false },
      ],
    },
  ],
  columns: categoryColumns,
  emptyState: {
    icon: Tag01Icon,
    title: "No categories found",
    description: "Try resetting filters or adding a new system category.",
  },
};

function BadgeRowActions({ badge }: { badge: Badge }) {
  const role = getCurrentIdentity()?.role;
  const canEdit = hasPermission(role, "badges", "edit");
  const canDelete = hasPermission(role, "badges", "delete");
  const [editOpen, setEditDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { mutate: deleteBadge, mutation: deleteMutation } =
    useDelete<Badge>();
  const isDeleting = deleteMutation.isPending;

  if (!canEdit && !canDelete) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Actions for ${badge.title}`}
          >
            <HugeIcon icon={MoreHorizontalIcon} size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          {canEdit ? (
            <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
              <HugeIcon icon={Edit02Icon} size={15} />
              Edit
            </DropdownMenuItem>
          ) : null}
          {canDelete ? (
            <>
              {canEdit && <DropdownMenuSeparator />}
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setConfirmOpen(true)}
              >
                <HugeIcon icon={Delete02Icon} size={15} />
                Delete
              </DropdownMenuItem>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>

      <BadgeDialog
        open={editOpen}
        onOpenChange={setEditDialogOpen}
        badge={badge}
      />

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia>
              <HugeIcon
                icon={Delete02Icon}
                size={20}
                className="text-destructive"
              />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete badge?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete badge{" "}
              <strong className="text-foreground">{badge.title}</strong> (
              <code className="text-xs font-mono">{badge.id}</code>)?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeleting}
              onClick={() => {
                deleteBadge(
                  {
                    resource: "badges",
                    id: badge.id,
                    successNotification: {
                      message: `Badge "${badge.title}" deleted`,
                      type: "success",
                    },
                  },
                  {
                    onSettled: () => setConfirmOpen(false),
                  }
                );
              }}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export const badgeColumns: ColumnDef<Badge>[] = [
  {
    id: "badge",
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableSorter column={column} title="Badge" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        {row.original.iconUrl ? (
          <img
            src={row.original.iconUrl}
            alt={row.original.title}
            className="h-9 w-9 shrink-0 rounded-md border border-border bg-muted/40 p-1 object-contain"
          />
        ) : (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground">
            <HugeIcon icon={Award01Icon} size={18} />
          </div>
        )}
        <div className="flex flex-col min-w-0">
          <span className="font-medium text-sm text-foreground truncate">
            {row.original.title}
          </span>
          <span className="text-xs text-muted-foreground line-clamp-1">
            {row.original.description}
          </span>
        </div>
      </div>
    ),
  },
  {
    id: "id",
    accessorKey: "id",
    header: "ID Code",
    enableSorting: false,
    cell: ({ row }) => (
      <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-muted-foreground">
        {row.original.id}
      </code>
    ),
  },
  {
    id: "category",
    accessorKey: "category",
    header: "Category",
    enableSorting: false,
    cell: ({ row }) => (
      <BadgeCategoryBadge category={row.original.category} />
    ),
  },
  {
    id: "progressType",
    accessorKey: "progressType",
    header: "Progress Type",
    enableSorting: false,
    cell: ({ row }) => (
      <BadgeProgressTypeBadge type={row.original.progressType} />
    ),
  },
  {
    id: "targetValue",
    accessorKey: "targetValue",
    header: ({ column }) => (
      <DataTableSorter column={column} title="Target Criteria" />
    ),
    cell: ({ row }) => (
      <span className="text-sm font-medium tabular-nums">
        {formatNumber(row.original.targetValue)}{" "}
        <span className="text-xs text-muted-foreground">
          {row.original.unit}
        </span>
      </span>
    ),
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableSorter column={column} title="Created" />
    ),
    cell: ({ row }) => (
      <span className="text-xs tabular-nums text-muted-foreground">
        {formatDate(row.original.createdAt)}
      </span>
    ),
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    enableSorting: false,
    cell: ({ row }) => <BadgeRowActions badge={row.original} />,
  },
];

export const badgeResourceSchema: ResourceSchema<Badge> = {
  name: "badges",
  initialSort: [{ field: "targetValue", order: "asc" }],
  search: {
    placeholder: "Search badges by title or ID code...",
    field: "q",
  },
  filters: [
    {
      field: "category",
      label: "Category",
      options: [
        { label: "All Categories", value: "all" },
        { label: "Streak", value: "STREAK" },
        { label: "Focus Time", value: "TIME" },
        { label: "Special", value: "SPECIAL" },
        { label: "Community", value: "COMMUNITY" },
      ],
    },
  ],
  columns: badgeColumns,
  emptyState: {
    icon: Award01Icon,
    title: "No badges found",
    description: "Try resetting filters or adding a new gamification badge.",
  },
};

export const resourceSchemas: Record<string, ResourceSchema<any>> = {
  users: userResourceSchema,
  mascots: mascotResourceSchema,
  categories: categoryResourceSchema,
  badges: badgeResourceSchema,
};
