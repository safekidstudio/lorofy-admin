import * as React from "react";
import {
  Delete02Icon,
  FireIcon,
  Notification01Icon,
  NotificationOff01Icon,
  ShieldCheckIcon,
  SparklesIcon,
  Tick01Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { HugeIcon } from "@/components/ui/hugeicon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface AdminNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  timeAgo: string;
  read: boolean;
  category: "milestone" | "security" | "gamification" | "system";
}

const STORAGE_KEY = "lorofy.admin.notifications.v1";

const INITIAL_NOTIFICATIONS: AdminNotification[] = [
  {
    id: "notif-1",
    title: "Focus Streak Milestone",
    description: "@alex_lorofy achieved a 30-day continuous focus streak milestone!",
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    timeAgo: "5m ago",
    read: false,
    category: "milestone",
  },
  {
    id: "notif-2",
    title: "Admin Session Authorized",
    description: "New administrative session logged in from IP 13.214.177.88.",
    timestamp: new Date(Date.now() - 24 * 60 * 1000).toISOString(),
    timeAgo: "24m ago",
    read: false,
    category: "security",
  },
  {
    id: "notif-3",
    title: "Companion Unlocked",
    description: "User @phuoctai unlocked companion 'Cyber Fox' with 500 gold coins.",
    timestamp: new Date(Date.now() - 65 * 60 * 1000).toISOString(),
    timeAgo: "1h ago",
    read: false,
    category: "gamification",
  },
  {
    id: "notif-4",
    title: "Traffic Peak Observed",
    description: "System logged 1,240 concurrent focus sessions during morning peak.",
    timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    timeAgo: "3h ago",
    read: true,
    category: "system",
  },
  {
    id: "notif-5",
    title: "Automated DB Backup",
    description: "Daily automated database snapshot completed successfully.",
    timestamp: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    timeAgo: "8h ago",
    read: true,
    category: "system",
  },
];

function getCategoryIcon(category: AdminNotification["category"]) {
  switch (category) {
    case "milestone":
      return (
        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
          <HugeIcon icon={FireIcon} size={15} />
        </div>
      );
    case "security":
      return (
        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400">
          <HugeIcon icon={ShieldCheckIcon} size={15} />
        </div>
      );
    case "gamification":
      return (
        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
          <HugeIcon icon={SparklesIcon} size={15} />
        </div>
      );
    default:
      return (
        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <HugeIcon icon={Notification01Icon} size={15} />
        </div>
      );
  }
}

export function NotificationCenter() {
  const [open, setOpen] = React.useState(false);
  const [filter, setFilter] = React.useState<"all" | "unread">("all");
  const [notifications, setNotifications] = React.useState<AdminNotification[]>(
    () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return INITIAL_NOTIFICATIONS;
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) && parsed.length > 0
          ? parsed
          : INITIAL_NOTIFICATIONS;
      } catch {
        return INITIAL_NOTIFICATIONS;
      }
    },
  );

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch {
      // Ignored
    }
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllAsRead = () => {
    if (unreadCount === 0) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
    toast.success("Notifications cleared");
  };

  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((n) => !n.read)
      : notifications;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="relative size-8 text-foreground"
          title="Notifications"
          aria-label="Notifications"
        >
          <HugeIcon icon={Notification01Icon} size={16} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground animate-in zoom-in-50">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-80 sm:w-96 p-0 shadow-xl border-border rounded-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold tracking-tight text-foreground">
              Notifications
            </span>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="h-5 px-1.5 text-[11px] font-bold">
                {unreadCount} new
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="xs"
                className="h-7 gap-1 text-[11px] text-muted-foreground hover:text-foreground"
                onClick={markAllAsRead}
                title="Mark all as read"
              >
                <HugeIcon icon={Tick01Icon} size={13} />
                Mark all read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="icon-xs"
                className="size-7 text-muted-foreground hover:text-destructive"
                onClick={clearAll}
                title="Clear all"
              >
                <HugeIcon icon={Delete02Icon} size={13} />
              </Button>
            )}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex border-b border-border px-3 py-1.5 bg-background">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                filter === "all"
                  ? "bg-muted text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("unread")}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                filter === "unread"
                  ? "bg-muted text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Unread ({unreadCount})
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="max-h-[360px] overflow-y-auto divide-y divide-border/60">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground">
                <HugeIcon icon={NotificationOff01Icon} size={22} />
              </div>
              <p className="mt-3 text-sm font-semibold text-foreground">
                All caught up!
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {filter === "unread"
                  ? "No unread administrative notifications."
                  : "No notifications recorded at this time."}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                className={cn(
                  "group relative flex items-start gap-3 p-3.5 transition-colors cursor-pointer text-left hover:bg-muted/50",
                  !notif.read && "bg-primary/5 dark:bg-primary/10",
                )}
              >
                {getCategoryIcon(notif.category)}

                <div className="flex-1 min-w-0 pr-6">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        "text-xs truncate",
                        !notif.read
                          ? "font-semibold text-foreground"
                          : "font-medium text-foreground/80",
                      )}
                    >
                      {notif.title}
                    </span>
                    {!notif.read && (
                      <span className="size-1.5 rounded-full bg-primary shrink-0" />
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {notif.description}
                  </p>
                  <span className="mt-1 inline-block text-[10px] text-muted-foreground/75 font-mono">
                    {notif.timeAgo}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => deleteNotification(notif.id, e)}
                  aria-label="Dismiss notification"
                  className="absolute top-3 right-2.5 opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive rounded-md transition-opacity"
                >
                  <HugeIcon icon={Delete02Icon} size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border bg-muted/20 px-3 py-2 text-center text-[11px] text-muted-foreground">
          Live operational alerts & system updates
        </div>
      </PopoverContent>
    </Popover>
  );
}
