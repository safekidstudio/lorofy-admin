import { Badge } from "@/components/ui/badge";
import { ROLE_LABELS } from "@/providers/access-control-provider";
import type {
  AdminRole,
  MascotCategory,
  MascotRarity,
  MascotUnlockType,
  UserRole,
} from "@/types/api";

export function UserRoleBadge({ role }: { role: UserRole }) {
  return (
    <Badge variant={role === "ADMIN" ? "default" : "secondary"}>
      {role === "ADMIN" ? "Admin" : "User"}
    </Badge>
  );
}

export function AccountStatusBadge({ enabled }: { enabled: boolean }) {
  return (
    <Badge variant={enabled ? "default" : "destructive"}>
      {enabled ? "Active" : "Suspended"}
    </Badge>
  );
}

export function AdminRoleBadge({ role }: { role: AdminRole }) {
  return (
    <Badge variant="secondary">
      {ROLE_LABELS[role]}
    </Badge>
  );
}

const CATEGORY_LABELS: Record<MascotCategory, string> = {
  PLANT: "Plant",
  ANIMAL: "Animal",
  FANTASY: "Fantasy",
};

const RARITY_LABELS: Record<MascotRarity, string> = {
  COMMON: "Common",
  RARE: "Rare",
  EPIC: "Epic",
  LEGENDARY: "Legendary",
};

const UNLOCK_LABELS: Record<MascotUnlockType, string> = {
  FREE: "Free",
  COINS: "Gold Coins",
  POINTS: "Lorofy Points",
  STREAK_MILESTONE: "Streak Milestone",
};

export function MascotCategoryBadge({
  category,
}: {
  category: MascotCategory;
}) {
  return <Badge variant="outline">{CATEGORY_LABELS[category]}</Badge>;
}

export function MascotRarityBadge({ rarity }: { rarity: MascotRarity }) {
  const variant =
    rarity === "LEGENDARY"
      ? "default"
      : rarity === "EPIC"
        ? "secondary"
        : "outline";

  return (
    <Badge variant={variant}>
      {RARITY_LABELS[rarity]}
    </Badge>
  );
}

export function MascotUnlockBadge({
  unlockType,
}: {
  unlockType: MascotUnlockType;
}) {
  return (
    <Badge variant="outline">
      {UNLOCK_LABELS[unlockType]}
    </Badge>
  );
}

export function ActiveBadge({ active }: { active: boolean }) {
  return (
    <Badge variant={active ? "default" : "secondary"}>
      {active ? "Published" : "Draft"}
    </Badge>
  );
}

export function CategoryTypeBadge({ isSystem }: { isSystem: boolean }) {
  return (
    <Badge variant={isSystem ? "default" : "secondary"}>
      {isSystem ? "System Default" : "User Custom"}
    </Badge>
  );
}

const BADGE_CATEGORY_LABELS: Record<string, string> = {
  STREAK: "Streak",
  TIME: "Focus Time",
  SPECIAL: "Special",
  COMMUNITY: "Community",
};

export function BadgeCategoryBadge({ category }: { category: string }) {
  return (
    <Badge variant="outline">
      {BADGE_CATEGORY_LABELS[category] ?? category}
    </Badge>
  );
}

export function BadgeProgressTypeBadge({ type }: { type: string }) {
  return (
    <Badge variant="secondary" className="font-mono text-xs">
      {type}
    </Badge>
  );
}

export { CATEGORY_LABELS, RARITY_LABELS, UNLOCK_LABELS, BADGE_CATEGORY_LABELS };
