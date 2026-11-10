import { useLogout } from "@refinedev/core";
import { Link } from "react-router";
import {
  Logout01Icon,
  ShieldAlertIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/ui/hugeicon";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getCurrentIdentity } from "@/lib/session";
import { initials } from "@/lib/format";
import { ROLE_LABELS } from "@/providers/access-control-provider";

export function AccessDeniedPage() {
  const identity = getCurrentIdentity();
  const { mutate: logout, isPending } = useLogout();

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-border/80">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive shadow-xs">
            <HugeIcon icon={ShieldAlertIcon} size={28} />
          </div>
          <CardTitle className="text-xl font-bold tracking-tight">
            Restricted Access
          </CardTitle>
          <CardDescription className="text-sm">
            Administrative permissions are required to access this resource.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-2">
          <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/40 p-3">
            <Avatar className="size-10">
              <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
                {initials(identity?.username)}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left leading-tight min-w-0">
              <span className="truncate font-semibold text-sm">
                {identity?.username ?? "Current User"}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {identity?.email}
              </span>
            </div>
            <span className="shrink-0 rounded-md bg-destructive/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-destructive">
              {identity?.role ? ROLE_LABELS[identity.role] : "Limited User"}
            </span>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed text-center">
            You are currently authenticated as a standard user. You may view and
            manage your personal profile, or sign out to authenticate with an
            administrative account.
          </p>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 pt-2 sm:flex-row">
          <Button asChild className="w-full gap-2">
            <Link to="/profile">
              <HugeIcon icon={UserIcon} size={16} />
              View My Profile
            </Link>
          </Button>
          <Button
            variant="outline"
            className="w-full gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
            disabled={isPending}
            onClick={() => logout()}
          >
            <HugeIcon icon={Logout01Icon} size={16} />
            {isPending ? "Signing out..." : "Sign Out"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
