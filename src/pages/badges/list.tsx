import { useState } from "react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/ui/hugeicon";
import { ListView } from "@/components/refine-ui";
import { ResourceTable } from "@/components/refine-ui/resource-table";
import { Button } from "@/components/ui/button";
import { BadgeDialog } from "./badge-dialog";
import { getCurrentIdentity } from "@/lib/session";
import { hasPermission } from "@/providers/access-control-provider";

export function BadgeListPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const role = getCurrentIdentity()?.role;
  const canCreate = hasPermission(role, "badges", "create");

  return (
    <ListView
      title="Badges & Achievements"
      description="Configure gamification badges, milestones, and unlock criteria."
      headerActions={
        canCreate ? (
          <Button onClick={() => setCreateOpen(true)} className="gap-2">
            <HugeIcon icon={PlusSignIcon} size={16} />
            New Badge
          </Button>
        ) : null
      }
    >
      <ResourceTable resource="badges" />
      <BadgeDialog open={createOpen} onOpenChange={setCreateOpen} />
    </ListView>
  );
}
