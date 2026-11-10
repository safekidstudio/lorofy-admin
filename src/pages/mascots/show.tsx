import { useShow } from "@refinedev/core";
import {
  CalendarDays,
  Coins,
  FileBox,
  Flame,
  ImageIcon,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import { useParams } from "react-router";
import {
  ActiveBadge,
  CATEGORY_LABELS,
  MascotCategoryBadge,
  MascotRarityBadge,
  RARITY_LABELS,
  UNLOCK_LABELS,
} from "@/components/badges";
import { EditButton, ListButton, ShowView } from "@/components/refine-ui";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateTime, formatNumber } from "@/lib/format";
import { getCurrentIdentity } from "@/lib/session";
import { hasPermission } from "@/providers/access-control-provider";
import type { Mascot } from "@/types/api";

const CATEGORY_EMOJI: Record<Mascot["category"], string> = {
  PLANT: "🌱",
  ANIMAL: "🦊",
  FANTASY: "🐉",
};

const CATEGORY_GRADIENT: Record<Mascot["category"], string> = {
  PLANT:
    "from-emerald-200 via-lime-100 to-emerald-50 dark:from-emerald-950 dark:via-emerald-900 dark:to-emerald-950",
  ANIMAL:
    "from-orange-200 via-amber-100 to-yellow-50 dark:from-orange-950 dark:via-amber-900 dark:to-amber-950",
  FANTASY:
    "from-violet-200 via-fuchsia-100 to-purple-50 dark:from-violet-950 dark:via-purple-900 dark:to-purple-950",
};

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5 py-2">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div className="grid min-w-0 gap-0.5">
        <span className="text-[11px] text-muted-foreground">{label}</span>
        <span className="break-all text-sm font-medium">{value}</span>
      </div>
    </div>
  );
}

function requirementText(mascot: Mascot): string {
  switch (mascot.unlockType) {
    case "FREE":
      return "Free for all registered users";
    case "COINS":
      return `${formatNumber(mascot.costCoins)} gold coins`;
    case "POINTS":
      return `${formatNumber(mascot.costPoints)} Lorofy Points`;
    case "STREAK_MILESTONE":
      return `${formatNumber(mascot.requiredStreakDays)}-day streak milestone`;
    default:
      return "—";
  }
}

export function MascotShowPage() {
  const { id } = useParams<{ id: string }>();
  const { result: mascot, query } = useShow<Mascot>({
    resource: "mascots",
    id,
  });

  const canEdit = hasPermission(getCurrentIdentity()?.role, "mascots", "edit");

  if (query.isLoading) {
    return (
      <>
        <Skeleton className="h-9 w-48" />
        <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </>
    );
  }

  if (!mascot) {
    return (
      <Card>
        <CardContent className="grid place-items-center gap-3 py-16 text-center">
          <Sparkles className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            This mascot does not exist or has been removed from the catalog.
          </p>
          <ListButton resource="mascots">Back to Mascots</ListButton>
        </CardContent>
      </Card>
    );
  }

  return (
    <ShowView
      recordItemId={mascot.id}
      title={mascot.name}
      description={`Mascot · ${CATEGORY_LABELS[mascot.category]} · ${RARITY_LABELS[mascot.rarity]}`}
      headerActions={
        canEdit ? <EditButton resource="mascots" id={mascot.id} /> : null
      }
    >
      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <div className="grid content-start gap-4">
          <Card className="overflow-hidden">
            <div
              className={`relative grid min-h-56 place-items-center bg-gradient-to-br p-6 ${CATEGORY_GRADIENT[mascot.category]}`}
            >
              <div
                aria-hidden
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
                  backgroundSize: "22px 22px",
                }}
              />
              {mascot.previewImageUrl ? (
                <img
                  src={mascot.previewImageUrl}
                  alt={mascot.name}
                  className="relative size-40 rounded-2xl border-4 border-background/60 object-cover shadow-xl"
                />
              ) : (
                <span className="relative text-7xl drop-shadow-sm" aria-hidden>
                  {CATEGORY_EMOJI[mascot.category]}
                </span>
              )}
            </div>
            <CardContent className="grid gap-3 pt-4">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-semibold">
                  {mascot.name}
                </h2>
                <MascotCategoryBadge category={mascot.category} />
                <MascotRarityBadge rarity={mascot.rarity} />
                <ActiveBadge active={mascot.active} />
              </div>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {mascot.description || "No description provided for this mascot."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="size-4 text-muted-foreground" />
                Catalog Specifications
              </CardTitle>
              <CardDescription>
                Active metrics and parameters applied in user apps.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 sm:grid-cols-2">
              <div className="rounded-lg border bg-muted/30 p-3">
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Sparkles className="size-3.5" />
                  Unlock Type
                </div>
                <p className="mt-1.5 text-sm font-semibold">
                  {UNLOCK_LABELS[mascot.unlockType]}
                </p>
                <p className="text-xs text-muted-foreground">
                  {requirementText(mascot)}
                </p>
              </div>

              <div className="rounded-lg border bg-muted/30 p-3">
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Users className="size-3.5" />
                  Total Owners
                </div>
                <p className="mt-1.5 text-lg font-semibold tabular-nums">
                  {formatNumber(mascot.ownedCount ?? 0)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Users who unlocked this mascot
                </p>
              </div>

              <div className="rounded-lg border bg-muted/30 p-3">
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Coins className="size-3.5" />
                  Gold Coins Cost
                </div>
                <p className="mt-1.5 text-sm font-semibold tabular-nums">
                  {formatNumber(mascot.costCoins)}
                </p>
              </div>

              <div className="rounded-lg border bg-muted/30 p-3">
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Flame className="size-3.5" />
                  Streak Requirement
                </div>
                <p className="mt-1.5 text-sm font-semibold tabular-nums">
                  {formatNumber(mascot.requiredStreakDays)} days
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid content-start gap-4">
          <Card size="sm">
            <CardHeader className="pb-1">
              <CardTitle>Asset References</CardTitle>
            </CardHeader>
            <CardContent>
              <DetailRow
                icon={FileBox}
                label="Rive Asset File"
                value={
                  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]">
                    {mascot.riveAssetPath}
                  </code>
                }
              />
              <DetailRow
                icon={ImageIcon}
                label="Preview Image"
                value={
                  mascot.previewImageUrl ? (
                    <a
                      href={mascot.previewImageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline"
                    >
                      Open Image
                    </a>
                  ) : (
                    <span className="text-muted-foreground">No image URL</span>
                  )
                }
              />
              <DetailRow
                icon={FileBox}
                label="Sort Order"
                value={formatNumber(mascot.sortOrder)}
              />
            </CardContent>
          </Card>

          <Card size="sm">
            <CardHeader className="pb-1">
              <CardTitle>Metadata History</CardTitle>
            </CardHeader>
            <CardContent>
              <DetailRow
                icon={CalendarDays}
                label="Created Date"
                value={formatDateTime(mascot.createdAt)}
              />
              <DetailRow
                icon={CalendarDays}
                label="Last Updated"
                value={formatDateTime(mascot.updatedAt)}
              />
              <DetailRow
                icon={FileBox}
                label="Mascot ID"
                value={
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {mascot.id}
                  </Badge>
                }
              />
            </CardContent>
          </Card>

          <Card size="sm" className="border-dashed">
            <CardContent className="grid gap-2 text-xs leading-relaxed text-muted-foreground">
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                <Sparkles className="size-3.5 text-primary" />
                Publishing Notes
              </span>
              <p>
                Unpublishing a mascot hides it from the store catalog but preserves
                ownership for existing users.
              </p>
              <p>
                When modifying unlock prices or requirements, verify the changes
                against mobile app balance models.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </ShowView>
  );
}
