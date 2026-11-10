import { ListView, RefreshButton, ResourceTable } from "@/components/refine-ui";
import { Button } from "@/components/ui/button";

export function UserListPage() {
  return (
    <ListView
      title="Users"
      description="Search user profiles, manage roles, and monitor account status."
      canCreate={false}
      headerActions={
        <>
          <RefreshButton resource="users" />
          <Button size="sm" disabled title="Invite users via standard registration flow">
            Add User
          </Button>
        </>
      }
    >
      <ResourceTable resource="users" />
    </ListView>
  );
}
