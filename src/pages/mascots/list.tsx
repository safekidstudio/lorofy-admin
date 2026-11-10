import {
  CreateButton,
  ListView,
  RefreshButton,
  ResourceTable,
} from "@/components/refine-ui";
import { getCurrentIdentity } from "@/lib/session";
import { hasPermission } from "@/providers/access-control-provider";

export function MascotListPage() {
  const role = getCurrentIdentity()?.role;
  const canCreate = hasPermission(role, "mascots", "create");

  return (
    <ListView
      title="Mascots"
      description="Manage 3D avatars, unlock criteria, and shop availability."
      canCreate={false}
      headerActions={
        <>
          <RefreshButton resource="mascots" />
          {canCreate ? <CreateButton resource="mascots" /> : null}
        </>
      }
    >
      <ResourceTable resource="mascots" />
    </ListView>
  );
}
