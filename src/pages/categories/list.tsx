import { useState } from "react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/ui/hugeicon";
import { ListView } from "@/components/refine-ui";
import { ResourceTable } from "@/components/refine-ui/resource-table";
import { Button } from "@/components/ui/button";
import { CategoryDialog } from "./category-dialog";
import { getCurrentIdentity } from "@/lib/session";
import { hasPermission } from "@/providers/access-control-provider";

export function CategoryListPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const role = getCurrentIdentity()?.role;
  const canCreate = hasPermission(role, "categories", "create");

  return (
    <ListView
      title="Focus Categories"
      description="Manage system default focus categories and user tags."
      headerActions={
        canCreate ? (
          <Button onClick={() => setCreateOpen(true)} className="gap-2">
            <HugeIcon icon={PlusSignIcon} size={16} />
            New Category
          </Button>
        ) : null
      }
    >
      <ResourceTable resource="categories" />
      <CategoryDialog open={createOpen} onOpenChange={setCreateOpen} />
    </ListView>
  );
}
